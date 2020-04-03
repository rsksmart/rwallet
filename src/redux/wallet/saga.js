/* eslint no-restricted-syntax:0 */
import {
  take, call, all, takeEvery, put, select, cancelled,
} from 'redux-saga/effects';

import { eventChannel /* END */ } from 'redux-saga';

import actions from './actions';
import appActions from '../app/actions';
import ParseHelper from '../../common/parse';
import CoinSwitchHelper from '../../common/coinswitch.helper';

import { createErrorNotification } from '../../common/notification.controller';
import config from '../../../config';

import wm from '../../common/wallet/walletManager';

const {
  interval: {
    // fetchBalance: FETCH_BALANCE_INTERVAL,
    fetchTransaction: FETCH_TRANSACTION_INTERVAL,
    fetchLatestBlockHeight: FETCH_LATEST_BLOCK_HEIGHT_INTERVAL,
  },
} = config;

/**
 * Utility function to create a channel to emit an event periodically
 * @param {number} interval interval between invoke in milliseconds
 */
function createTimer(interval) {
  return eventChannel((emitter) => {
    const intervalInstance = setInterval(() => {
      emitter((new Date()).getTime());

      // To close this channel, user emitter(END);
    }, interval);
    return () => {
      clearInterval(intervalInstance);
    };
  });
}

/**
 * Start the timer to call actions.FETCH_BALANCE periodically
 */
// export function* startFetchBalanceTimerRequest(action) {
//   const walletManager = action.payload;

//   // Call actions.FETCH_BALANCE once to start off
//   yield put({
//     type: actions.FETCH_BALANCE,
//     payload: walletManager,
//   });

//   const chan = yield call(createTimer, FETCH_BALANCE_INTERVAL);

//   try {
//     while (true) {
//       // take(END) will cause the saga to terminate by jumping to the finally block
//       yield take(chan);
//       yield put({
//         type: actions.FETCH_BALANCE,
//         payload: walletManager,
//       });
//     }
//   } finally {
//     console.log('fetchBalance Channel closed.');
//   }
// }

/**
 * Start the timer to call actions.FETCH_TRANSACTION periodically
 */
export function* startFetchTransactionTimerRequest(action) {
  const walletManager = action.payload;

  // Call actions.FETCH_TRANSACTION once to start off
  yield put({
    type: actions.FETCH_TRANSACTION,
    payload: walletManager,
  });

  const chan = yield call(createTimer, FETCH_TRANSACTION_INTERVAL);

  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      yield take(chan);
      yield put({
        type: actions.FETCH_TRANSACTION,
        payload: walletManager,
      });
    }
  } finally {
    console.log('fetchTransaction Channel closed.');
  }
}

/**
 * Start the timer to call actions.FETCH_LATEST_BLOCK_HEIGHT periodically
 */
export function* startFetchLatestBlockHeightTimerRequest() {
  // Call actions.FETCH_LATEST_BLOCK_HEIGHT once to start off
  yield put({
    type: actions.FETCH_LATEST_BLOCK_HEIGHT,
  });

  const chan = yield call(createTimer, FETCH_LATEST_BLOCK_HEIGHT_INTERVAL);

  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      yield take(chan);
      yield put({
        type: actions.FETCH_LATEST_BLOCK_HEIGHT,
      });
    }
  } finally {
    console.log('fetchLatestBlockHeight Channel closed.');
  }
}

// function* fetchBalanceRequest(action) {
//   const walletManager = action.payload;

//   try {
//     const response = yield call(ParseHelper.fetchBalance, walletManager.getTokens());
//     yield put({
//       type: actions.FETCH_BALANCE_RESULT,
//       value: response,
//     });
//   } catch (err) {
//     const message = yield call(ParseHelper.handleError, { err });
//     console.error(message);
//   }
// }

function* fetchTransactionRequest(action) {
  const walletManager = action.payload;

  const tokens = walletManager.getTokens();

  try {
    yield call(ParseHelper.fetchTransaction, tokens);
    yield put({
      type: actions.FETCH_TRANSACTION_RESULT,
    });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, { err });
    console.error(message);
  }
}

function* fetchLatestBlockHeight() {
  try {
    const response = yield call(ParseHelper.fetchLatestBlockHeight);
    yield put({
      type: actions.FETCH_LATEST_BLOCK_HEIGHT_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, { err });
    console.warn(message);
  }
}

function* createKeyRequest(action) {
  const {
    name, phrase, coins, walletManager, derivationPaths,
  } = action.payload;
  try {
    yield call(walletManager.createWallet, name, phrase, coins, derivationPaths);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    yield put({ type: actions.MODIFY_BALANCES_QUERY });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, { err });
    console.error(message);
  }
}

function* deleteKeyRequest(action) {
  const { walletManager, key } = action.payload;
  try {
    const state = yield select();
    const currency = state.App.get('currency');
    const prices = state.Price.get('prices');
    yield call(walletManager.deleteWallet, key);
    yield put({ type: actions.UPDATE_ASSET_VALUE, payload: { currency, prices } });
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    yield put({ type: actions.MODIFY_BALANCES_QUERY });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, { err });
    console.error(message);
  }
}

function* renameKeyRequest(action) {
  const { walletManager, key, name } = action.payload;
  try {
    yield call(walletManager.renameWallet, key, name);
    yield put({ type: actions.WALLTE_NAME_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    yield put({ type: actions.MODIFY_BALANCES_QUERY });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, { err });
    const notification = createErrorNotification('modal.incorrectKeyName.title', message.message);
    yield put(appActions.addNotification(notification));
    // console.error(message);
  }
}

function* addTokenRequest(action) {
  const {
    walletManager, wallet, token,
  } = action.payload;
  try {
    yield call(wallet.addToken, token);
    yield put({ type: actions.SET_ADD_TOKEN_RESULT, value: { state: 'success' } });
    yield call(walletManager.serialize);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    yield put({ type: actions.MODIFY_BALANCES_QUERY });
  } catch (error) {
    console.log(error);
    if (error.message === 'err.exsistedtoken') {
      yield put({ type: actions.SET_ADD_TOKEN_RESULT, value: { state: 'error', error } });
      return;
    }
    const message = yield call(ParseHelper.handleError, error);
    console.error(message);
  }
}

function* deleteTokenRequest(action) {
  const { walletManager, wallet, token } = action.payload;
  try {
    const state = yield select();
    const currency = state.App.get('currency');
    const prices = state.Price.get('prices');
    yield call(wallet.deleteToken, token);
    yield call(walletManager.serialize);
    yield put({ type: actions.UPDATE_ASSET_VALUE, payload: { currency, prices } });
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    yield put({ type: actions.MODIFY_BALANCES_QUERY });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);
    console.error(message);
  }
}

function* getSwapRateRequest(action) {
  const { sourceCoinId, destCoinId } = action.payload;
  try {
    const response = yield call(CoinSwitchHelper.getRate, sourceCoinId, destCoinId);
    const swapRate = {
      sourceCoinId,
      destCoinId,
      rate: response,
    };
    yield put({ type: actions.GET_SWAP_RATE_RESULT, value: swapRate });
  } catch (err) {
    console.log('getSwapRateRequest, err: ', err);
    yield put({ type: actions.SET_SWAP_RATE_RESULT_ERROR, value: { sourceCoinId, destCoinId, error: err } });
  }
}

function createBalancesSubscriptionChannel(subscription) {
  console.log('createBalancesSubscriptionChannel');
  return eventChannel((emitter) => {
    const subscribeHandler = () => {
      console.log('createBalancesSubscriptionChannel.subscribeHandler.');
    };
    const unsubscribeHandler = () => {
      console.log('createBalancesSubscriptionChannel.unsubscribeHandler.');
    };
    const updateHandler = (object) => {
      console.log('createBalancesSubscriptionChannel.updateHandler', object);
      const balance = {
        objectId: object.id,
        balance: object.get('balance'),
      };
      return emitter({ type: actions.FETCH_BALANCE_RESULT, value: [balance] });
    };
    const errorHandler = (error) => {
      console.log('createBalancesSubscriptionChannel.errorHandler', error);
    };
    subscription.on('open', subscribeHandler);
    subscription.on('close', unsubscribeHandler);
    subscription.on('update', updateHandler);
    subscription.on('error', errorHandler);

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

function* subscribeBalancesRequest() {
  let subscription;
  let subscriptionChannel;
  const tokens = wm.getTokens();
  console.log('subscribeBalancesRequest');

  try {
    const response = yield call(ParseHelper.fetchBalances, tokens);
    console.log('ParseHelper.fetchBalances, response: ', response);
    yield put({
      type: actions.FETCH_BALANCE_RESULT,
      value: response,
    });
  } catch (error) {
    console.log('subscribeBalancesRequest.fetchPrices, error:', error);
  }

  try {
    subscription = yield call(ParseHelper.subscribeBalances, tokens);
    subscriptionChannel = yield call(createBalancesSubscriptionChannel, subscription);
    yield put({ type: actions.SET_BALANCES_SUBSCRIPTION, value: subscription });
    while (true) {
      const payload = yield take(subscriptionChannel);
      console.log('payload: ', payload);
      yield put(payload);
    }
  } catch (err) {
    console.log('Subscription error:', err);
  } finally {
    if (yield cancelled()) {
      subscriptionChannel.close();
      subscription.close();
    } else {
      console.log('Subscription disconnected: Balance');
    }
  }
}

export default function* () {
  yield all([
    // takeEvery(actions.FETCH_BALANCE, fetchBalanceRequest),
    takeEvery(actions.FETCH_TRANSACTION, fetchTransactionRequest),
    takeEvery(actions.FETCH_LATEST_BLOCK_HEIGHT, fetchLatestBlockHeight),

    // takeEvery(actions.START_FETCH_BALANCE_TIMER, startFetchBalanceTimerRequest),
    takeEvery(actions.START_FETCH_TRANSACTION_TIMER, startFetchTransactionTimerRequest),
    takeEvery(actions.START_FETCH_LATEST_BLOCK_HEIGHT_TIMER, startFetchLatestBlockHeightTimerRequest),

    takeEvery(actions.DELETE_KEY, deleteKeyRequest),
    takeEvery(actions.RENAME_KEY, renameKeyRequest),
    takeEvery(actions.CREATE_KEY, createKeyRequest),
    takeEvery(actions.ADD_TOKEN, addTokenRequest),
    takeEvery(actions.DELETE_TOKEN, deleteTokenRequest),

    takeEvery(actions.GET_SWAP_RATE, getSwapRateRequest),

    takeEvery(actions.SUBSCRIBE_BALANCES, subscribeBalancesRequest),
  ]);
}

/* eslint no-restricted-syntax:0 */
import {
  take, call, all, takeEvery, put, select, cancelled,
} from 'redux-saga/effects';

import { eventChannel /* END */ } from 'redux-saga';
import moment from 'moment';
import actions from './actions';
import appActions from '../app/actions';
import ParseHelper from '../../common/parse';
import CoinSwitchHelper from '../../common/coinswitch.helper';

import { createErrorNotification } from '../../common/notification.controller';
import config from '../../../config';

const {
  interval: {
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
    const tokens = walletManager.getTokens();
    yield call(walletManager.createWallet, name, phrase, coins, derivationPaths);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    yield put({ type: actions.INIT_LIVE_QUERY_BALANCES, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, { err });
    console.error(message);
  }
}

function* deleteKeyRequest(action) {
  const { walletManager, key } = action.payload;
  const tokens = walletManager.getTokens();
  try {
    const state = yield select();
    const currency = state.App.get('currency');
    const prices = state.Price.get('prices');
    yield call(walletManager.deleteWallet, key);
    yield put({ type: actions.UPDATE_ASSET_VALUE, payload: { currency, prices } });
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    yield put({ type: actions.INIT_LIVE_QUERY_BALANCES, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
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
  const tokens = walletManager.getTokens();
  try {
    yield call(wallet.addToken, token);
    yield put({ type: actions.SET_ADD_TOKEN_RESULT, value: { state: 'success' } });
    yield call(walletManager.serialize);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    yield put({ type: actions.INIT_LIVE_QUERY_BALANCES, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
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
    const tokens = walletManager.getTokens();
    const state = yield select();
    const currency = state.App.get('currency');
    const prices = state.Price.get('prices');
    yield call(wallet.deleteToken, token);
    yield call(walletManager.serialize);
    yield put({ type: actions.UPDATE_ASSET_VALUE, payload: { currency, prices } });
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    yield put({ type: actions.INIT_LIVE_QUERY_BALANCES, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
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
    const unsubscribeHandler = () => {
      ParseHelper.unsubscribe(subscription);
      console.log('createBalancesSubscriptionChannel.unsubscribeHandler.');
    };
    const updateHandler = (object) => {
      console.log('createBalancesSubscriptionChannel.updateHandler', object);
      const balance = {
        objectId: object.id, balance: object.get('balance'), address: object.get('address'), symbol: object.get('symbol'),
      };
      return emitter({ type: actions.FETCH_BALANCE_RESULT, value: [balance] });
    };
    subscription.on('update', updateHandler);
    subscription.on('create', updateHandler);
    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

function* initLiveQueryBalancesRequest(action) {
  let subscription;
  let subscriptionChannel;
  const { tokens } = action;
  console.log('initLiveQueryBalancesRequest, tokens: ', tokens);

  const state = yield select();
  const balancesChannel = state.Wallet.get('balancesChannel');
  if (balancesChannel) {
    balancesChannel.close();
  }

  try {
    console.log('ParseHelper.fetchBalances, tokens: ', tokens);
    const response = yield call(ParseHelper.fetchBalances, tokens);
    console.log('ParseHelper.fetchBalances, response: ', response);
    yield put({
      type: actions.FETCH_BALANCE_RESULT,
      value: response,
    });
  } catch (error) {
    console.log('initLiveQueryBalancesRequest.fetchPrices, error:', error);
  }

  try {
    subscription = yield call(ParseHelper.subscribeBalances, tokens);
    subscriptionChannel = yield call(createBalancesSubscriptionChannel, subscription);
    yield put({ type: actions.SET_BALANCES_CHANNEL, value: subscriptionChannel });
    while (true) {
      const payload = yield take(subscriptionChannel);
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

function createTransactionsSubscriptionChannel(subscription) {
  console.log('createTransactionsSubscriptionChannel');
  return eventChannel((emitter) => {
    const subscribeHandler = () => {
      console.log('createTransactionsSubscriptionChannel.subscribeHandler.');
    };
    const unsubscribeHandler = () => {
      ParseHelper.unsubscribe(subscription);
      console.log('createTransactionsSubscriptionChannel.unsubscribeHandler.');
    };
    const updateHandler = (item) => {
      console.log('createTransactionsSubscriptionChannel.updateHandler', item);
      const createdAt = item.get('createdAt');
      const confirmedAt = item.get('confirmedAt');
      const transaction = {
        createdAt: createdAt ? moment(createdAt) : null,
        confirmedAt: confirmedAt ? moment(confirmedAt) : null,
        chain: item.get('chain'),
        type: item.get('type'),
        from: item.get('from'),
        hash: item.get('hash'),
        value: item.get('value'),
        blockHeight: item.get('blockHeight'),
        symbol: item.get('symbol'),
        to: item.get('to'),
        confirmations: item.get('confirmations'),
        memo: item.get('memo'),
        status: item.get('status'),
        objectId: item.id,
      };
      return emitter({ type: actions.FETCH_TRANSACTION_RESULT, value: [transaction] });
    };
    const errorHandler = (error) => {
      console.log('createTransactionsSubscriptionChannel.errorHandler', error);
    };
    subscription.on('open', subscribeHandler);
    subscription.on('update', updateHandler);
    subscription.on('error', errorHandler);
    subscription.on('create', updateHandler);

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}


function* fetchTransactions(tokens) {
  try {
    const transactions = yield call(ParseHelper.fetchTransactions, tokens);
    console.log('ParseHelper.fetchTransactions, response: ', transactions);
    yield put({
      type: actions.FETCH_TRANSACTION_RESULT,
      value: transactions,
    });
  } catch (error) {
    console.log('initLiveQueryTransactionsRequest.fetchTransactions, error:', error);
  }
}

function* initLiveQueryTransactionsRequest(action) {
  let subscription;
  let subscriptionChannel;
  const { tokens } = action;
  console.log('initLiveQueryTransactionsRequest, tokens: ', tokens);

  const state = yield select();
  const transactionsChannel = state.Wallet.get('transactionsChannel');
  if (transactionsChannel) {
    transactionsChannel.close();
  }

  yield call(fetchTransactions, tokens);

  try {
    subscription = yield call(ParseHelper.subscribeTransactions, tokens);
    subscriptionChannel = yield call(createTransactionsSubscriptionChannel, subscription);
    yield put({ type: actions.SET_TRANSACTIONS_CHANNEL, value: subscriptionChannel });
    while (true) {
      const payload = yield take(subscriptionChannel);
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
    takeEvery(actions.FETCH_LATEST_BLOCK_HEIGHT, fetchLatestBlockHeight),

    takeEvery(actions.START_FETCH_LATEST_BLOCK_HEIGHT_TIMER, startFetchLatestBlockHeightTimerRequest),

    takeEvery(actions.DELETE_KEY, deleteKeyRequest),
    takeEvery(actions.RENAME_KEY, renameKeyRequest),
    takeEvery(actions.CREATE_KEY, createKeyRequest),
    takeEvery(actions.ADD_TOKEN, addTokenRequest),
    takeEvery(actions.DELETE_TOKEN, deleteTokenRequest),

    takeEvery(actions.GET_SWAP_RATE, getSwapRateRequest),

    takeEvery(actions.INIT_LIVE_QUERY_BALANCES, initLiveQueryBalancesRequest),
    takeEvery(actions.INIT_LIVE_QUERY_TRANSACTIONS, initLiveQueryTransactionsRequest),
  ]);
}

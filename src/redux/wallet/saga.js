/* eslint no-restricted-syntax:0 */
import {
  take, call, all, takeEvery, put,
} from 'redux-saga/effects';

import _ from 'lodash';

import { eventChannel /* END */ } from 'redux-saga';

import actions from './actions';
import appActions from '../app/actions';
import ParseHelper from '../../common/parse';

import { createErrorNotification } from '../../common/notification.controller';
import config from '../../../config';

const {
  consts: { supportedTokens, currencies: currencySettings },
  interval: {
    fetchPrice: FETCH_PRICE_INTERVAL,
    fetchBalance: FETCH_BALANCE_INTERVAL,
    fetchTransaction: FETCH_TRANSACTION_INTERVAL,
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
 * Start the timer to call actions.GET_PRICE periodically
 */
export function* startFetchPriceTimerRequest() {
  // Call actions.GET_PRICE once to start off
  yield put({
    type: actions.GET_PRICE,
    payload: {
      symbols: supportedTokens,
      currencies: _.map(currencySettings, (item) => item.name),
    },
  });

  const chan = yield call(createTimer, FETCH_PRICE_INTERVAL);

  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      yield take(chan);
      yield put({
        type: actions.GET_PRICE,
        payload: {
          symbols: supportedTokens,
          currencies: _.map(currencySettings, (item) => item.name),
        },
      });
    }
  } finally {
    console.log('fetchPrice Channel closed.');
  }
}

/**
 * Start the timer to call actions.FETCH_BALANCE periodically
 */
export function* startFetchBalanceTimerRequest(action) {
  const walletManager = action.payload;

  // Call actions.FETCH_BALANCE once to start off
  yield put({
    type: actions.FETCH_BALANCE,
    payload: walletManager,
  });

  const chan = yield call(createTimer, FETCH_BALANCE_INTERVAL);

  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      yield take(chan);
      yield put({
        type: actions.FETCH_BALANCE,
        payload: walletManager,
      });
    }
  } finally {
    console.log('fetchBalance Channel closed.');
  }
}

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

function* getPriceRequest(action) {
  const { symbols, currencies } = action.payload;
  try {
    const response = yield call(ParseHelper.getPrice, { symbols, currencies });

    console.log('getPrice', response);

    // Sets state in reducer for success
    yield put({
      type: actions.GET_PRICE_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);
    console.warn(message);
  }
}

function* fetchBalanceRequest(action) {
  const walletManager = action.payload;

  try {
    const response = yield call(ParseHelper.fetchBalance, walletManager.getTokens());
    yield put({
      type: actions.FETCH_BALANCE_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);
    console.error(message);
  }
}

function* fetchTransactionRequest(action) {
  const walletManager = action.payload;

  const tokens = walletManager.getTokens();

  try {
    yield call(ParseHelper.fetchTransaction, tokens);
    yield put({
      type: actions.FETCH_TRANSACTION_RESULT,
    });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);
    console.error(message);
  }
}

function* createKeyRequest(action) {
  const {
    name, phrase, coinIds, walletManager,
  } = action.payload;
  try {
    yield call(walletManager.createWallet, name, phrase, coinIds);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);
    console.error(message);
  }
}

function* deleteKeyRequest(action) {
  const { walletManager, key } = action.payload;
  try {
    yield call(walletManager.deleteWallet, key);
    // TODO: delete relevant transactions about the wallet
    yield call(ParseHelper.deleteWallet, key);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);
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
    const message = yield call(ParseHelper.handleError, err);
    const notification = createErrorNotification('Incorrect name', message.message);
    yield put(appActions.addNotification(notification));
    // console.error(message);
  }
}

export default function* () {
  yield all([
    takeEvery(actions.GET_PRICE, getPriceRequest),
    takeEvery(actions.FETCH_BALANCE, fetchBalanceRequest),
    takeEvery(actions.FETCH_TRANSACTION, fetchTransactionRequest),

    takeEvery(actions.START_FETCH_PRICE_TIMER, startFetchPriceTimerRequest),
    takeEvery(actions.START_FETCH_BALANCE_TIMER, startFetchBalanceTimerRequest),
    takeEvery(actions.START_FETCH_TRANSACTION_TIMER, startFetchTransactionTimerRequest),

    takeEvery(actions.DELETE_KEY, deleteKeyRequest),
    takeEvery(actions.RENAME_KEY, renameKeyRequest),
    takeEvery(actions.CREATE_KEY, createKeyRequest),
  ]);
}

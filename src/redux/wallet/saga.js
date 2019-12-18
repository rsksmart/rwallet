/* eslint no-restricted-syntax:0 */
import {
  take, call, all, takeEvery, put,
} from 'redux-saga/effects';

import { eventChannel, END } from 'redux-saga';

import actions from './actions';
import appActions from '../app/actions';

import ParseHelper from '../../common/parse';
import { createErrorNotification } from '../../common/notification.controller';

function countdown(seconds) {
  let secs = seconds;
  return eventChannel((emitter) => {
    const iv = setInterval(() => {
      secs -= 1;
      if (secs > 0) {
        emitter(secs);
      } else {
        // this causes the channel to close
        emitter(END);
      }
    }, 1000);
      // The subscriber must return an unsubscribe function
    return () => {
      clearInterval(iv);
    };
  });
}

export function* startFetchBalanceTimerRequest() {
  const chan = yield call(countdown, 5);
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const seconds = yield take(chan);
      console.log(`countdown: ${seconds}`);
    }
  } finally {
    console.log('countdown terminated');
  }
}

function* getWalletsRequest() {
  console.log('saga.getWalletsRequest is called');

  try {
    const response = yield call(ParseHelper.getWallets);

    console.log('getWalletsRequest got response, response: ', response);

    // Sets state in reducer for success
    yield put({
      type: actions.GET_WALLETS_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);

    console.error(message);

    // On error, use appActions.SET_ERROR to notify UI
    yield put({
      type: appActions.SET_ERROR,
      value: { message },
    });
  }
}

function* getPriceRequest(action) {
  const { symbols, currencies } = action.payload;
  try {
    const response = yield call(ParseHelper.getPrice, { symbols, currencies });

    // Sets state in reducer for success
    yield put({
      type: actions.GET_PRICE_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);

    console.error(message);

    // On error, use appActions.SET_ERROR to notify UI
    yield put({
      type: appActions.SET_ERROR,
      value: { message },
    });
  }
}

function* fetchBalanceRequest(action) {
  const tokens = action.payload;

  try {
    const response = yield call(ParseHelper.fetchBalance, tokens);
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
  const { walletManager } = action;

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

function* deleteKeyRequest(action) {
  const { walletManager, key } = action.payload;
  try {
    yield call(walletManager.deleteWallet, key);
    yield put({ type: actions.WALLTES_UPDATED });
    yield put(appActions.updateUser({ wallets: walletManager.wallets }));
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
    yield put(appActions.updateUser({ wallets: walletManager.wallets }));
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);
    const notification = createErrorNotification('Incorrect name', message.message);
    yield put(appActions.addNotification(notification));
    // console.error(message);
  }
}

export default function* () {
  yield all([
    // When app loading action is fired, try to fetch server info
    takeEvery(actions.GET_WALLETS, getWalletsRequest),
    takeEvery(actions.GET_PRICE, getPriceRequest),
    takeEvery(actions.FETCH_BALANCE, fetchBalanceRequest),
    takeEvery(actions.FETCH_TRANSACTION, fetchTransactionRequest),
    takeEvery(actions.START_FETCH_BALANCE_TIMER, startFetchBalanceTimerRequest),
    takeEvery(actions.DELETE_KEY, deleteKeyRequest),
    takeEvery(actions.RENAME_KEY, renameKeyRequest),
  ]);
}

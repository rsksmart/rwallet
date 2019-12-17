/* eslint no-restricted-syntax:0 */
import {
  take, call, all, takeEvery, put,
} from 'redux-saga/effects';

import _ from 'lodash';

import { eventChannel /* END */ } from 'redux-saga';

import actions from './actions';
import appActions from '../app/actions';
import ParseHelper from '../../common/parse';
import config from '../../../config';

const {
  consts: { supportedTokens, currencies: currencySettings },
  interval: { fetchPrice: fetchPriceInterval },
} = config;

function createTimer(interval) {
  return eventChannel((emitter) => {
    const intervalInstance = setInterval(() => {
      emitter((new Date()).getTime());

      // this causes the channel to close
      // emitter(END);
    }, interval);
    return () => {
      clearInterval(intervalInstance);
    };
  });
}

export function* startFetchPriceTimerRequest() {
  const chan = yield call(createTimer, fetchPriceInterval);

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
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);
    console.warn(message);
  } finally {
    console.log('fetchPrice Channel closed.');
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
    console.warn(message);
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

export default function* () {
  yield all([
    // When app loading action is fired, try to fetch server info
    takeEvery(actions.GET_WALLETS, getWalletsRequest),
    takeEvery(actions.GET_PRICE, getPriceRequest),
    takeEvery(actions.FETCH_BALANCE, fetchBalanceRequest),
    takeEvery(actions.FETCH_TRANSACTION, fetchTransactionRequest),
    takeEvery(actions.START_FETCH_PRICE_TIMER, startFetchPriceTimerRequest),
  ]);
}

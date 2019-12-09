/* eslint no-restricted-syntax:0 */
import {
  call, all, takeEvery, put,
} from 'redux-saga/effects';


import actions from './actions';
import appActions from '../app/actions';

import ParseHelper from '../../common/parse';

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
    const message = yield call(ParseHelper.handlError, err);

    console.error(message);

    // On error, use appActions.SET_ERROR to notify UI
    yield put({
      type: appActions.SET_ERROR,
      value: { message },
    });
  }
}

function* getPriceRequest(action) {
  const { payload, currency } = action;
  try {
    const response = yield call(ParseHelper.getPrice, payload);

    // Sets state in reducer for success
    yield put({
      type: actions.GET_PRICE_RESULT,
      value: Object.assign(response, { currency }),
    });
  } catch (err) {
    const message = yield call(ParseHelper.handlError, err);

    console.error(message);

    // On error, use appActions.SET_ERROR to notify UI
    yield put({
      type: appActions.SET_ERROR,
      value: { message },
    });
  }
}

function* fetchBalanceRequest(action) {
  const { walletManager } = action;

  const addresses = walletManager.getAddresses();
  console.log('fetchBalanceRequest, get Coin instances:', addresses);

  try {
    yield call(ParseHelper.fetchBalance(addresses));
  } catch (err) {
    const message = yield call(ParseHelper.handlError, err);
    console.error(message);
  }
}

export default function* () {
  yield all([
    // When app loading action is fired, try to fetch server info
    takeEvery(actions.GET_WALLETS, getWalletsRequest),
    takeEvery(actions.GET_PRICE, getPriceRequest),
    takeEvery(actions.FETCH_BALANCE, fetchBalanceRequest),
  ]);
}

/* eslint no-restricted-syntax:0 */
import {
  call, all, takeEvery, put,
} from 'redux-saga/effects';

import actions from './actions';

import ParseHelper from '../../common/parse';

function* getServerInfoRequest(action) {
  const { value } = action;

  console.log('getServerInfoRequest is triggered, value: ', value); // This is undefined

  try {
    const response = yield call(ParseHelper.getServerInfo);

    console.log('getServerInfoRequest got response, response: ', response);

    // Sets state in reducer for success
    yield put({
      type: actions.GET_SERVER_INFO_RESULT,
      value: response,
    });
  } catch (err) {
    const message = yield call(ParseHelper.handlError, err);

    console.error(message);
    // On error, also sets state in reducer
    // so UI could reflect those errors
    // Note that error value here is to be consumed by UI,
    // so it should be an object contains at least a message field
    yield put({
      type: actions.SET_ERROR,
      value: { message },
    });
  }
}

function* getTransactions(action) {
  const { payload } = action;

  console.log('getTransactions is triggered, value: ', payload); // This is undefined

  try {
    const response = yield call(ParseHelper.getTransactionsByAddress, payload);

    console.log('getServerInfoRequest got response, response: ', response);

    // Sets state in reducer for success
    yield put({
      type: actions.GET_TRANSACTIONS_RESULT,
      value: response,
    });
  } catch (err) {
    console.log(err);
    const message = yield call(ParseHelper.handleError, err);

    // console.error(message);
    // On error, also sets state in reducer
    // so UI could reflect those errors
    // Note that error value here is to be consumed by UI,
    // so it should be an object contains at least a message field
    yield put({
      type: actions.SET_ERROR,
      value: { message },
    });
  }
}

export default function* () {
  yield all([
    // When app loading action is fired, try to fetch server info
    takeEvery(actions.GET_SERVER_INFO, getServerInfoRequest),
    takeEvery(actions.GET_TRANSACTIONS, getTransactions),
  ]);
}

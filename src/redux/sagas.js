import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import walletSagas from './wallet/saga';

export default function* rootSaga() {
  yield all([
    appSagas(),
    walletSagas(),
  ]);
}

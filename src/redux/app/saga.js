/* eslint no-restricted-syntax:0 */
import {
  call, all, takeEvery, put, select, take,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import _ from 'lodash';

/* Actions */
import actions from './actions';
import walletActions from '../wallet/actions';
import priceActions from '../price/actions';

import application from '../../common/application';
import settings from '../../common/settings';
import common from '../../common/common';
import walletManager from '../../common/wallet/walletManager';
import definitions from '../../common/definitions';
import storage from '../../common/storage';
import fcmHelper, { FcmType } from '../../common/fcmHelper';

/* Component Dependencies */
import ParseHelper from '../../common/parse';

import { createErrorNotification } from '../../common/notification.controller';

function* updateUserRequest() {
  // Upload wallets or settings to server
  try {
    const state = yield select();
    const isLogin = state.App.get('isLogin');
    if (!isLogin) {
      return;
    }
    const fcmToken = state.App.get('fcmToken');
    const updatedParseUser = yield call(ParseHelper.updateUser, { wallets: walletManager.wallets, settings, fcmToken });

    // Update coin's objectId and return isDirty true if there's coin updated
    const addressesJSON = _.map(updatedParseUser.get('wallets'), (wallet) => wallet.toJSON());
    const isDirty = walletManager.updateCoinObjectIds(addressesJSON);

    // If Coins are updated then we need to serialize them
    if (isDirty) {
      console.log('serializeWalletsIfDirty, walletManager is dirty, serialize ...', walletManager);
      yield call(walletManager.serialize);
    } else {
      console.log('serializeWalletsIfDirty, walletManager is not dirty; no change');
    }
  } catch (err) {
    console.log('updateUserRequest', err);
  }
}

function* initFromStorageRequest() {
  try {
    // yield call(storage.remove, 'wallets');

    // 1. Deserialize Settings from permenate storage
    yield call(settings.deserialize);

    // set language
    common.setLanguage(settings.get('language'));
    common.setMomentLocale(settings.get('language'));

    // Sets state in reducer for success
    yield put({
      type: actions.SET_SETTINGS,
      value: settings,
    });

    // 2. Set passcode in reducer
    const passcode = yield call(storage.getPasscode);
    yield put({
      type: actions.UPDATE_PASSCODE,
      passcode,
    });

    // 3. Deserialize Wallets from permenate storage
    yield call(walletManager.deserialize);

    // 4. Deserialize prices
    const prices = yield call(storage.getPrices);
    yield put({ type: priceActions.PRICE_OBJECT_UPDATED, data: prices });
    const currency = settings.get('currency');
    walletManager.updateAssetValue(prices, currency);

    // 5. Deserialize all active dapps and types
    const dapps = yield call(storage.getDapps);
    yield put({ type: actions.UPDATE_DAPPS, dapps });
    const dappTypes = yield call(storage.getDappTypes);
    yield put({ type: actions.UPDATE_DAPP_TYPES, dappTypes });

    // 6. Deserialize recent dapps
    const recentDapps = yield call(storage.getRecentDapps);
    yield put({ type: actions.UPDATE_RECENT_DAPPS, recentDapps });

    // 7. Deserialize dapp advertisements
    const advertisements = yield call(storage.getAdvertisements);
    yield put({ type: actions.UPDATE_ADVERTISEMENT, advertisements });

    // Sets state in reducer for success
    yield put({
      type: walletActions.SET_WALLET_MANAGER,
      value: walletManager,
    });

    // 3. Deserialize appId from permenate storage
    yield call(application.deserialize);

    console.log('initFromStorageRequest, appId:', application.get('id'));

    yield put({
      type: actions.SET_APPLICATION,
      value: application,
    });

    // If we don't encounter error here, mark initialization finished
    yield put({
      type: actions.INIT_FROM_STORAGE_DONE,
    });
  } catch (err) {
    const { message } = err; // TODO: handle app error in a class
    console.error(message);
  }
}

function* loginRequest() {
  const appId = application.get('id');
  try {
    // Read Parse.User from storage, if not, sign in or sign up
    const user = yield call(ParseHelper.getUser);
    console.log('initWithParseRequest, read from storage, user: ', user);
    if (!user) {
      yield call(ParseHelper.signInOrSignUp, appId);
    }
    console.log(`User found with appId ${appId}. Sign in successful.`);
    yield put(actions.resetLoginError());
    yield put(actions.loginDone());
    yield put(actions.updateUser());
  } catch (err) {
    yield call(ParseHelper.handleError, { err });
    yield put(actions.setLoginError());
    // If it's error in signIn, do it again.
    yield put(actions.login());
  }
}

function* createRawTransaction(action) {
  const { payload } = action;
  console.log('saga::createRawTransaction is triggered, payload: ', payload); // This is undefined
  try {
    const response = yield call(ParseHelper.createRawTransaction, payload);
    console.log('saga::createRawTransaction got response, response: ', response);
    yield put({
      type: actions.CREATE_RAW_TRANSATION_RESULT,
      value: response,
    });
  } catch (err) {
    console.log(err);
    // TODO: need to add notification here if failed
  }
}

function* setSingleSettingsRequest(action) {
  const { key, value } = action;
  console.log('saga::setSingleSettingsRequest is triggered, key: ', key, ', value:', value);
  try {
    // 1. Set settings by key
    settings.set(key, value);
    console.log('settings', settings);

    // 2. Serialize settings
    yield call(settings.serialize);

    yield put({
      type: actions.SET_SETTINGS,
      value: settings,
    });
  } catch (err) {
    console.log(err);
    const notification = createErrorNotification(definitions.defaultErrorNotification.title, definitions.defaultErrorNotification.message);
    yield put(actions.addNotification(notification));
  }
}

function* changeLanguageRequest(action) {
  const { language } = action;
  console.log('saga::changeLanguageRequest is triggered, language: ', language);
  try {
    // 1. Set language
    common.setLanguage(language);
    common.setMomentLocale(language);

    // 2. Save setting
    yield put(actions.setSingleSettings('language', language));
  } catch (err) {
    console.log(err);
    const notification = createErrorNotification(definitions.defaultErrorNotification.title, definitions.defaultErrorNotification.message);
    yield put(actions.addNotification(notification));
  }
}

function* renameRequest(action) {
  const { name } = action;
  try {
    settings.validateName(name);
    yield put(actions.setSingleSettings('username', name));
    yield put({ type: actions.USER_NAME_UPDATED });
  } catch (err) {
    let notification = null;
    switch (err.message) {
      case 'err.nametooshort':
        notification = createErrorNotification('modal.incorrectName.title', 'modal.incorrectName.tooShort');
        break;
      case 'err.nametoolong':
        notification = createErrorNotification('modal.incorrectName.title', 'modal.incorrectName.tooLong');
        break;
      case 'err.nameinvalid':
        notification = createErrorNotification('modal.incorrectName.title', 'modal.incorrectName.invalid');
        break;
      default:
        notification = createErrorNotification(definitions.defaultErrorNotification.title, definitions.defaultErrorNotification.message);
    }
    yield put(actions.addNotification(notification));
  }
}

function* fingerprintUsePasscodeRequest(action) {
  yield put(actions.hideFingerprintModal());
  yield put(actions.showPasscode('verify', action.value.callback, action.value.fallback));
}

/**
 * authVerifyRequest decide how to verify authorization
 * If fingerprint in settings is enabled, and sensor is avaliable, use fingerprint
 * If passcode is seted, use passcode
 * If passcode is not seted, call callback function
 */
function* authVerifyRequest(action) {
  const { callback, fallback } = action.value;
  const state = yield select();
  const isFingerprint = state.App.get('fingerprint');
  const passcode = state.App.get('passcode');
  if (isFingerprint && common.isFingerprintAvailable()) {
    yield put(actions.showFingerprintModal(callback, fallback));
  } else if (passcode) {
    yield put(actions.showPasscode('verify', callback, fallback));
  } else if (callback) {
    yield call(callback);
  }
}

function* setPasscodeRequest(action) {
  const { passcode } = action;
  try {
    yield call(storage.setPasscode, passcode);
    yield put({
      type: actions.UPDATE_PASSCODE,
      passcode,
    });
  } catch (error) {
    console.log('setPasscodeRequest, error: ', error);
  }
}

/**
 * processNotificationRequest
 * @param {*} notification
 * @param {*} fcmType
 */
function* processNotificationRequest(action) {
  const { notification } = action;
  if (!notification) {
    return null;
  }
  const { title, body, data } = notification;
  console.log(`FirebaseMessaging, onFireMessagingNotification, title: ${title}, body: ${body} `);
  if (!data) {
    return null;
  }
  const { event, eventParams } = data;
  const params = eventParams ? JSON.parse(eventParams) : null;
  switch (event) {
    case 'sentTransaction':
    case 'receivingTransaction':
    case 'receivedTransaction': {
      const { symbol, type, address } = params;
      const coin = walletManager.findToken(symbol, type, address);
      if (!coin) {
        return null;
      }
      common.currentNavigation.navigate('Home');
      const newAction = actions.setFcmNavParams({
        routeName: 'WalletHistory',
        routeParams: { coin },
      });
      yield put(newAction);
      break;
    }
    case 'createRnsSuccess':
    case 'createRnsFail': {
      common.currentNavigation.navigate('Home');
      const newAction = actions.setFcmNavParams({
        routeName: 'RnsStatus',
        routeParams: { rnsRows: params },
      });
      yield put(newAction);
      break;
    }
    default:
  }
  return null;
}

function createFcmChannel() {
  return eventChannel((emitter) => {
    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribeHandler = () => {};

    fcmHelper.startListen((notification, fcmType) => {
      let action = null;
      if (fcmType === FcmType.INAPP) {
        action = actions.showInAppNotification(notification);
      } else {
        action = actions.processNotification(notification);
      }
      emitter(action);
    });

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

function* initFcmChannelRequest() {
  const fcmChannel = yield call(createFcmChannel);
  while (true) {
    const payload = yield take(fcmChannel);
    yield put(payload);
  }
}

function* initFcmRequest() {
  const fcmToken = yield call(fcmHelper.initFirebaseMessaging);
  yield put({ type: actions.SET_FCM_TOKEN, fcmToken });
  yield put({ type: actions.UPDATE_USER });
  yield call(initFcmChannelRequest);
}

function* getServerInfoRequest() {
  // 2. Test server connection and get Server info
  try {
    const response = yield call(ParseHelper.getServerInfo);

    // Sets state in reducer for success
    yield put({
      type: actions.GET_SERVER_INFO_RESULT,
      value: response,
    });
  } catch (err) {
    yield call(ParseHelper.handleError, { err });
  }
}

function* fetchDapps() {
  const dapps = yield call(ParseHelper.fetchDapps);
  yield put({ type: actions.UPDATE_DAPPS, dapps });
}

function* fetchDappTypes() {
  const dappTypes = yield call(ParseHelper.fetchDappTypes);
  yield put({ type: actions.UPDATE_DAPP_TYPES, dappTypes });
}

function* fetchAdvertisements() {
  const advertisements = yield call(ParseHelper.fetchAdvertisements);
  yield put({ type: actions.UPDATE_ADVERTISEMENT, advertisements });
}

/**
 * Add the recently opened dapp at the top of the recentDapps if dapp is not exist
 * Move the recently opened dapp at the top of the recentDapps if dapp is exist
 * @param {*} dapp
 */
function* addRecentDapp(action) {
  const { dapp } = action;
  const state = yield select();
  const recentDapps = state.App.get('recentDapps');

  // delete the recently opened dapp from recentDapps if dapp is exist
  const filterRecentDapps = _.filter(recentDapps, (recentDapp) => recentDapp.id !== dapp.id);
  // add the recently opened dapp at the top of the recentDapps
  const newRecentDapps = [dapp, ...filterRecentDapps];
  yield put({ type: actions.UPDATE_RECENT_DAPPS, recentDapps: newRecentDapps });
}

export default function* () {
  yield all([
    // When app loading action is fired, try to fetch server info
    takeEvery(actions.INIT_FROM_STORAGE, initFromStorageRequest),
    takeEvery(actions.LOGIN, loginRequest),
    takeEvery(actions.CREATE_RAW_TRANSATION, createRawTransaction),
    takeEvery(actions.SET_SINGLE_SETTINGS, setSingleSettingsRequest),
    takeEvery(actions.UPDATE_USER, updateUserRequest),
    takeEvery(actions.CHANGE_LANGUAGE, changeLanguageRequest),
    takeEvery(actions.RENAME, renameRequest),
    takeEvery(actions.GET_SERVER_INFO, getServerInfoRequest),

    takeEvery(actions.FINGERPRINT_USE_PASSCODE, fingerprintUsePasscodeRequest),
    takeEvery(actions.AUTH_VERIFY, authVerifyRequest),
    takeEvery(actions.SET_PASSCODE, setPasscodeRequest),

    takeEvery(actions.INIT_FCM, initFcmRequest),
    takeEvery(actions.INIT_FCM_CHANNEL, initFcmChannelRequest),
    takeEvery(actions.PROCESS_NOTIFICATON, processNotificationRequest),

    takeEvery(actions.FETCH_DAPPS, fetchDapps),
    takeEvery(actions.FETCH_DAPP_TYPES, fetchDappTypes),
    takeEvery(actions.FETCH_ADVERTISEMENT, fetchAdvertisements),
    takeEvery(actions.ADD_RECENT_DAPP, addRecentDapp),
  ]);
}

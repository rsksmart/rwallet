import { Platform } from 'react-native';
import {
  call, all, takeEvery, put, select, take, delay,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import _ from 'lodash';
import { getUniqueId } from 'react-native-device-info';

/* Actions */
import actions from './actions';
import walletActions from '../wallet/actions';
import priceActions from '../price/actions';

import application from '../../common/application';
import settings from '../../common/settings';
import common from '../../common/common';
import walletManager from '../../common/wallet/walletManager';
import { defaultErrorNotification } from '../../common/constants';
import storage from '../../common/storage';
import fcmHelper, { FcmType } from '../../common/fcmHelper';
import config from '../../../config';

/* Component Dependencies */
import ParseHelper from '../../common/parse';

import { createErrorNotification } from '../../common/notification.controller';

const RELOGIN_DELAY_TIME = 7000;

function* updateUserRequest() {
  // Upload wallets or settings to server
  try {
    const state = yield select();
    const isLogin = state.App.get('isLogin');
    if (!isLogin) {
      return;
    }
    const fcmToken = state.App.get('fcmToken');
    const deviceId = yield call(getUniqueId);
    const updatedParseUser = yield call(ParseHelper.updateUser, {
      wallets: walletManager.wallets, settings, fcmToken, deviceId,
    });

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

    // If the storage version is lower, upgrade
    const storageVersion = yield call(storage.getStorageVersion);
    if (!storageVersion || config.storageVersion > storageVersion) {
      // TODO: upgrade from old version
      // update current storage version
      yield call(storage.setStorageVersion, config.storageVersion);
    }

    const isReadOnlyWalletIntroShowed = yield call(storage.getReadOnlyWalletIntroShowed);
    if (isReadOnlyWalletIntroShowed) {
      yield put(actions.setReadOnlyWalletIntroShowed());
    }
    // Restore update version info from storage
    const updateVersionInfo = yield call(storage.getUpdateVersionInfo);
    if (updateVersionInfo) {
      yield put(actions.setUpdateVersionInfo(updateVersionInfo));
    }

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

function* loginRequest(action) {
  const { isRelogin } = action;
  try {
    const password = yield call(storage.getUserPassword);
    // If the password does not exist, it means this is a new user, then sign up.
    // Else login.
    const currentUser = yield call(ParseHelper.getUser);
    console.log('loginRequest, read from storage, user: ', currentUser);

    if (_.isEmpty(password)) {
      if (currentUser) {
        // In order to register new user when user is delete on server.
        // We need to log out, otherwise Parse.User.signUp() will always receive error: 209, Invalid session token
        yield call(ParseHelper.logOut);
      }

      // Sign up
      const username = yield call(application.createId);
      const newPassword = common.randomString(11);
      yield call(ParseHelper.signUp, username, newPassword);

      // Save username and password to storage
      yield call(application.saveId, username);
      yield call(storage.setUserPassword, newPassword);

      // refresh fcm token
      fcmHelper.refreshFcmToken();
    } else if (!currentUser || isRelogin) {
      // Read Parse.User from storage, if not, sign in or sign up
      // If you need to log in again, or the user exists, call ParseHelper.signIn
      // Else use the user from storage
      const appId = application.get('id');
      yield call(ParseHelper.signIn, appId, password);
    }

    const newAppId = application.get('id');
    console.log(`User found with appId ${newAppId}. Sign in successful.`);

    yield put(actions.resetLoginError());
    yield put(actions.setLogin(true));
    yield put(actions.updateUser());
  } catch (err) {
    console.log('loginRequest, error: ', err.message);
    yield put(actions.setLoginError());
    // If it's error in signIn, do it again.
    yield delay(RELOGIN_DELAY_TIME);
    yield put(actions.login(isRelogin));
  }
}

function* reloginRequest() {
  const state = yield select();
  const isLogin = state.App.get('isLogin');
  // Prevent repeated calls to the reloginRequest function
  if (!isLogin) {
    return;
  }
  yield put(actions.setLogin(false));
  yield put(actions.login(true));
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
    const notification = createErrorNotification(defaultErrorNotification.title, defaultErrorNotification.message);
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
    const notification = createErrorNotification(defaultErrorNotification.title, defaultErrorNotification.message);
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
        notification = createErrorNotification(defaultErrorNotification.title, defaultErrorNotification.message);
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
  console.log('isFingerprint: ', isFingerprint);
  const passcode = state.App.get('passcode');
  if (isFingerprint && common.getBiometryType()) {
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
    yield put(actions.lockApp(false));
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
      emitter(actions.receiveNotification(notification, fcmType));
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
    const state = yield select();
    const language = state.App.get('language');
    const serverInfo = yield call(ParseHelper.getServerInfo, Platform.OS, language);
    const serverVersion = serverInfo.version;
    const updateVersionInfo = {
      latestClientVersion: serverInfo.latestClientVersion,
      url: serverInfo.url,
      title: serverInfo.title,
      body: serverInfo.body,
      forceUpdate: serverInfo.forceUpdate,
    };
    yield call(storage.setUpdateVersionInfo, updateVersionInfo);

    // Sets state in reducer for success
    yield put({
      type: actions.GET_SERVER_INFO_RESULT,
      value: {
        serverVersion,
        updateVersionInfo,
      },
    });
  } catch (err) {
    console.log(err.message);
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

function* receiveNotificationRequest(action) {
  const { notification, fcmType } = action;
  if (!notification) {
    return null;
  }
  const { title, body, data } = notification;
  console.log(`receiveNotificationRequest, title: ${title}, body: ${body} `);
  if (data) {
    const { event, eventParams } = data;
    const params = eventParams ? JSON.parse(eventParams) : null;
    switch (event) {
      case 'createRnsSuccess':
      case 'createRnsFail': {
        // Change subdomains status by notification params
        yield put(walletActions.setSubdomains(params));
        break;
      }
      default:
    }
  }

  if (fcmType === FcmType.INAPP) {
    yield put(actions.showInAppNotification(notification));
  } else {
    yield put(actions.processNotification(notification));
  }

  return null;
}

function* showReadOnlyWalletIntroRequest() {
  yield call(storage.setReadOnlyWalletIntroShowed);
  yield put(actions.setReadOnlyWalletIntroShowed());
}

function* showUpdateModalRequest() {
  yield put(actions.setUpdateModal(true));
}

function* hideUpdateModalRequest() {
  yield put(actions.setUpdateModal(false));
}

export default function* () {
  yield all([
    // When app loading action is fired, try to fetch server info
    takeEvery(actions.INIT_FROM_STORAGE, initFromStorageRequest),
    takeEvery(actions.LOGIN, loginRequest),
    takeEvery(actions.RELOGIN, reloginRequest),
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
    takeEvery(actions.RECEIVE_NOTIFICATION, receiveNotificationRequest),

    takeEvery(actions.SHOW_READ_ONLY_WALLET_INTRO, showReadOnlyWalletIntroRequest),

    takeEvery(actions.SHOW_UPDATE_MODAL, showUpdateModalRequest),
    takeEvery(actions.HIDE_UPDATE_MODAL, hideUpdateModalRequest),
  ]);
}

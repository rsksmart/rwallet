/* eslint no-restricted-syntax:0 */
import {
  call, all, takeEvery, put,
} from 'redux-saga/effects';
import _ from 'lodash';

/* Actions */
import actions from './actions';
import walletActions from '../wallet/actions';

import application from '../../common/application';
import settings from '../../common/settings';
import walletManager from '../../common/wallet/walletManager';
import common from '../../common/common';

/* Component Dependencies */
import ParseHelper from '../../common/parse';

import { createErrorNotification } from '../../common/notification.controller';

// Define default error notification text
const DEFAULT_ERROR_NOTIFICATION_TITLE = 'modal.defaultError.title';
const DEFAULT_ERROR_NOTIFICATION_MESSAGE = 'modal.defaultError.body';

function* updateUserRequest() {
  // Upload wallets or settings to server
  try {
    const updatedParseUser = yield call(ParseHelper.updateUser, { wallets: walletManager.wallets, settings });

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

    // 2. Deserialize Wallets from permenate storage
    yield call(walletManager.deserialize);

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

function* initWithParseRequest() {
  const appId = application.get('id');

  // 1. Sign in or sign up to get Parse.User object
  // ParseHelper will have direct access to the User object so we don't need to pass it to state here
  try {
    yield call(ParseHelper.signInOrSignUp, appId);
    console.log(`User found with appId ${appId}. Sign in successful.`);
  } catch (err) {
    yield call(ParseHelper.handleError, { err, appId });
  }

  // 2. Test server connection and get Server info
  try {
    const response = yield call(ParseHelper.getServerInfo);

    // Sets state in reducer for success
    yield put({
      type: actions.GET_SERVER_INFO_RESULT,
      value: response,
    });
  } catch (err) {
    yield call(ParseHelper.handleError, { err, appId });
  }

  // 3. Upload wallets and settings to server
  yield put({
    type: actions.UPDATE_USER,
    payload: { walletManager, settings },
  });

  // If we don't encounter error here, mark initialization finished
  yield put({
    type: actions.INIT_WITH_PARSE_DONE,
  });
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
    const notification = createErrorNotification(DEFAULT_ERROR_NOTIFICATION_TITLE, DEFAULT_ERROR_NOTIFICATION_MESSAGE);
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
    const notification = createErrorNotification(DEFAULT_ERROR_NOTIFICATION_TITLE, DEFAULT_ERROR_NOTIFICATION_MESSAGE);
    yield put(actions.addNotification(notification));
  }
}

function* renameRequest(action) {
  const { name } = action;
  try {
    settings.rename(name);
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
        notification = createErrorNotification(DEFAULT_ERROR_NOTIFICATION_TITLE, DEFAULT_ERROR_NOTIFICATION_MESSAGE);
    }
    yield put(actions.addNotification(notification));
  }
}

export default function* () {
  yield all([
    // When app loading action is fired, try to fetch server info
    takeEvery(actions.INIT_FROM_STORAGE, initFromStorageRequest),
    takeEvery(actions.INIT_WITH_PARSE, initWithParseRequest),
    takeEvery(actions.CREATE_RAW_TRANSATION, createRawTransaction),
    takeEvery(actions.SET_SINGLE_SETTINGS, setSingleSettingsRequest),
    takeEvery(actions.UPDATE_USER, updateUserRequest),
    takeEvery(actions.CHANGE_LANGUAGE, changeLanguageRequest),
    takeEvery(actions.RENAME, renameRequest),
  ]);
}

import { Map } from 'immutable';
import actions from './actions';
import config from '../../../config';
import storage from '../../common/storage';

const { defaultSettings } = config;

const initState = new Map({
  isInitFromStorageDone: false, // Mark whether the first step, initalization from Storage done
  isLogin: false, // Mark whether user logged in
  isLoginError: false,

  application: undefined,
  settings: undefined, // Settings instance
  user: undefined, // user instance

  isPageLoading: false,
  serverVersion: undefined,
  error: undefined,
  transactions: undefined,
  showNotification: false,
  notification: null,
  confirmationCancelCallback: null,
  showPasscode: false,
  passcodeType: null,
  passcodeCallback: null,
  passcodeFallback: null,
  currency: defaultSettings.currency,
  language: defaultSettings.language,
  fingerprint: defaultSettings.fingerprint,
  username: defaultSettings.username,
  isUsernameUpdated: false,
  isShowConfirmation: false,
  confirmation: null,
  confirmationCallback: null,
  isShowFingerprintModal: false,
  fingerprintCallback: null,
  fingerprintFallback: null,
  appLock: true,
  passcode: undefined,
  isShowInAppNotification: false,
  inAppNotification: undefined,
  fcmNavParams: undefined,
  fcmToken: undefined,
  dapps: undefined,
  dappTypes: undefined,
  advertisements: undefined,
  recentDapps: undefined,
  page: undefined,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.INIT_FROM_STORAGE_DONE:
    {
      return state.set('isInitFromStorageDone', true);
    }
    case actions.GET_SERVER_INFO_RESULT:
    {
      const serverVersion = action.value && action.value.version;
      return state.set('serverVersion', serverVersion);
    }
    case actions.CREATE_RAW_TRANSATION_RESULT:
    {
      const result = action.value;
      const newstate = state.set('rawTransaction', result);
      return newstate;
    }
    case actions.SET_ERROR:
      return state.set('error', action.value);
    case actions.ADD_NOTIFICATION:
      return state
        .set('showNotification', true)
        .set('notification', action.notification)
        .set('notificationCloseCallback', action.notification.notificationCloseCallback);
    case actions.REMOVE_NOTIFICATION:
      return state
        .set('showNotification', false)
        .set('notification', null)
        .set('notificationCloseCallback', null);
    case actions.ADD_CONFIRMATION:
      return state
        .set('isShowConfirmation', true)
        .set('confirmation', action.confirmation)
        .set('confirmationCallback', action.confirmation.confirmationCallback)
        .set('confirmationCancelCallback', action.confirmation.confirmationCancelCallback);
    case actions.REMOVE_CONFIRMATION:
      return state
        .set('isShowConfirmation', false)
        .set('confirmation', null)
        .set('confirmationCallback', null)
        .set('confirmationCancelCallback', null);
    case actions.SHOW_PASSCODE:
      return state
        .set('showPasscode', true)
        .set('passcodeType', action.value.category)
        .set('passcodeCallback', action.value.callback)
        .set('passcodeFallback', action.value.fallback);
    case actions.HIDE_PASSCODE:
      return state
        .set('showPasscode', false)
        .set('passcodeType', null)
        .set('passcodeCallback', null)
        .set('passcodeFallback', null);
    case actions.SET_APPLICATION:
      return state.set('application', action.value);
    case actions.SET_SETTINGS:
    {
      const settings = action.value;
      return state.set('settings', settings)
        .set('currency', settings && settings.get('currency'))
        .set('language', settings && settings.get('language'))
        .set('fingerprint', settings && settings.get('fingerprint'))
        .set('username', settings && settings.get('username'));
    }
    case actions.USER_NAME_UPDATED:
      return state.set('isUsernameUpdated', true);
    case actions.RESET_USER_NAME_UPDATED:
      return state.set('isUsernameUpdated', false);
    case actions.SHOW_FINGERPRINT_MODAL:
      return state.set('isShowFingerprintModal', true)
        .set('fingerprintCallback', action.value.callback)
        .set('fingerprintFallback', action.value.fallback);
    case actions.HIDE_FINGERPRINT_MODAL:
      return state.set('isShowFingerprintModal', false)
        .set('fingerprintCallback', null)
        .set('fingerprintFallback', null);
    case actions.LOCK_APP:
      return state.set('appLock', action.lock);
    case actions.UPDATE_PASSCODE:
      return state.set('passcode', action.passcode);
    case actions.SHOW_INAPP_NOTIFICATION:
      return state.set('isShowInAppNotification', true)
        .set('inAppNotification', action.inAppNotification);
    case actions.RESET_INAPP_NOTIFICATION:
      return state.set('isShowInAppNotification', false)
        .set('inAppNotification', null);
    case actions.SET_FCM_NAV_PARAMS:
      return state.set('fcmNavParams', action.fcmNavParams);
    case actions.RESET_FCM_NAV_PARAMS:
      return state.set('fcmNavParams', null);
    case actions.SET_FCM_TOKEN:
      return state.set('fcmToken', action.fcmToken);
    case actions.LOGIN_DONE:
      return state.set('isLogin', true);
    case actions.SET_LOGIN_ERROR:
      return state.set('isLoginError', true);
    case actions.RESET_LOGIN_ERROR:
      return state.set('isLoginError', false);
    case actions.UPDATE_DAPPS: {
      const { dapps } = action;
      storage.setDapps(dapps);
      return state.set('dapps', dapps);
    }
    case actions.UPDATE_DAPP_TYPES: {
      const { dappTypes } = action;
      storage.setDappTypes(dappTypes);
      return state.set('dappTypes', dappTypes);
    }
    case actions.UPDATE_ADVERTISEMENT: {
      const { advertisements } = action;
      storage.setAdvertisements(advertisements);
      return state.set('advertisements', advertisements);
    }
    case actions.UPDATE_RECENT_DAPPS: {
      const { recentDapps } = action;
      storage.setRecentDapps(recentDapps);
      return state.set('recentDapps', recentDapps);
    }
    case actions.SET_PAGE:
      return state.set('page', action.page);
    case actions.RESET_PAGE:
      return state.set('page', null);
    default:
      return state;
  }
}

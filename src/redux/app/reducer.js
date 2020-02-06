import { Map } from 'immutable';
import actions from './actions';
import config from '../../../config';

const { defaultSettings } = config;

const initState = new Map({
  isInitFromStorageDone: false, // Mark whether the first step, initalization from Storage done
  isInitWithParseDone: false, // Mark whether the second step, initalization with Parse done

  application: undefined,
  settings: undefined, // Settings instance
  user: undefined, // user instance

  isPageLoading: false,
  serverVersion: undefined,
  error: undefined,
  transactions: undefined,
  showNotification: false,
  notification: null,
  showPasscode: false,
  passcodeType: null,
  passcodeCallback: null,
  passcodeFallback: null,
  currency: defaultSettings.currency,
  language: defaultSettings.language,
  fingerprint: defaultSettings.fingerprint,
  username: defaultSettings.username,
  isShowConfirmation: false,
  confirmation: null,
  isUsernameUpdated: false,
  isShowFingerprintModal: false,
  fingerprintCallback: null,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.IS_PAGE_LOADING:
    {
      return state.set('isPageLoading', action.value);
    }
    case actions.INIT_FROM_STORAGE_DONE:
    {
      return state.set('isInitFromStorageDone', true);
    }
    case actions.INIT_WITH_PARSE_DONE:
    {
      return state.set('isInitWithParseDone', true);
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
        .set('notification', action.notification);
    case actions.REMOVE_NOTIFICATION:
      return state
        .set('showNotification', false)
        .set('notification', null);
    case actions.ADD_CONFIRMATION:
      return state
        .set('isShowConfirmation', true)
        .set('confirmation', action.confirmation)
        .set('confirmationCallback', action.confirmation.confirmationCallback);
    case actions.REMOVE_CONFIRMATION:
      return state
        .set('isShowConfirmation', false)
        .set('confirmation', null)
        .set('confirmationCallback', null);
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
    default:
      return state;
  }
}

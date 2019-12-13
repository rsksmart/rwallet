import { Map } from 'immutable';
import actions from './actions';
import config from '../../../config';

const { defaultSettings } = config;

const initState = new Map({
  isPageLoading: false,
  serverVersion: undefined,
  error: undefined,
  transactions: undefined,
  showNotification: false,
  notification: null,
  application: undefined,
  settings: undefined, // Settings instance
  currency: defaultSettings.currency,
  language: defaultSettings.language,
  fingerprint: defaultSettings.fingerprint,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.IS_PAGE_LOADING:
      return state.set('isPageLoading', action.value);

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
      console.log('REMOVE_NOTIFICATION');
      return state
        .set('showNotification', false)
        .set('notification', null);
    case actions.SET_APPLICATION:
      return state.set('application', action.value);
    case actions.SET_SETTINGS:
    {
      const settings = action.value;
      return state.set('settings', settings)
        .set('currency', settings && settings.get('currency'))
        .set('language', settings && settings.get('language'))
        .set('fingerprint', settings && settings.get('fingerprint'));
    }
    default:
      return state;
  }
}

import { Map } from 'immutable';
import actions from './actions';
import appContext from '../../common/appContext';

const initState = new Map({
  isLoading: false,
  serverVersion: undefined,
  error: undefined,
  transactions: undefined,
  currency: undefined,
  notifications: [],
  application: undefined,
  settings: undefined, // Settings instance
  walletManager: undefined, // WalletManager instance
});

export default function appReducer(state = initState, action) {
  let notifications = [];
  switch (action.type) {
    case actions.LOADING:
      return state.set('isLoading', action.value);

    case actions.GET_SERVER_INFO_RESULT:
    {
      const serverVersion = action.value && action.value.version;
      return state.set('serverVersion', serverVersion);
    }
    case actions.GET_TRANSACTIONS:
    {
      return state.set('isLoading', true);
    }
    case actions.GET_TRANSACTIONS_RESULT:
    {
      const transactions = action.value;
      let newstate = state.set('isLoading', false);
      newstate = newstate.set('transactions', transactions);
      return newstate;
    }
    case actions.CREATE_RAW_TRANSATION_RESULT:
    {
      const result = action.value;
      const newstate = state.set('rawTransaction', result);
      return newstate;
    }
    case actions.CHANGE_CURRENCY:
    {
      const { currency } = action.payload;
      appContext.saveSettings({ currency }); // Serialize
      const newstate = state.set('currency', currency);
      return newstate;
    }
    case actions.SET_ERROR:
      return state.set('error', action.value);
    case actions.ADD_NOTIFICATION:
      notifications = state.get('notifications');
      /* eslint-disable no-case-declarations */
      const addNotifications = notifications.slice();
      addNotifications.push(action.notification);
      return state.set('notifications', addNotifications);
    case actions.REMOVE_NOTIFICATION:
      notifications = state.get('notifications');
      /* eslint-disable no-case-declarations */
      const removeNotifications = notifications.slice().filter(
        (notification) => notification.id !== action.id,
      );
      return state.set('notifications', removeNotifications);

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
    case actions.SET_WALLET_MANAGER:
      return state.set('walletManager', action.value);
    default:
      return state;
  }
}

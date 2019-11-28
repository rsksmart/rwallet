import { Map } from 'immutable';
import actions from './actions';
import appContext from '../../common/appContext';

const initState = new Map({
  isLoading: false,
  serverVersion: undefined,
  error: undefined,
  transactions: undefined,
  prices: {},
  currency: undefined,
});

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOADING:
      return state.set('isLoading', action.value);

    case actions.GET_SERVER_INFO_RESULT:
    {
      const serverVersion = action.value && action.value.version;
      console.log('reducer, serverVersion', serverVersion);
      return state.set('serverVersion', serverVersion);
    }
    case actions.GET_TRANSACTIONS:
    {
      return state.set('isLoading', true);
    }
    case actions.GET_TRANSACTIONS_RESULT:
    {
      const transactions = action.value;
      console.log('reducer, transtions', transactions);
      let newstate = state.set('isLoading', false);
      newstate = newstate.set('transactions', transactions);
      return newstate;
    }
    case actions.CREATE_RAW_TRANSATION_RESULT:
    {
      const result = action.value;
      console.log('CREATE_RAW_TRANSATION_RESULT, result', result);
      const newstate = state.set('rawTransaction', result);
      return newstate;
    }
    case actions.GET_PRICE_RESULT:
    {
      const result = action.value;
      console.log('GET_PRICE_RESULT, result', result);
      let prices = state.get('prices');
      prices = Object.assign(prices, result);
      const newstate = state.set('prices', prices);
      return newstate;
    }
    case actions.CHANGE_CURRENCY:
    {
      const { currency } = action.payload;
      appContext.saveSettings({ currency });
      const newstate = state.set('currency', currency);
      return newstate;
    }
    case actions.SET_ERROR:
      return state.set('error', action.value);
    default:
      return state;
  }
}

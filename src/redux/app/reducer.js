import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  isLoading: false,
  serverVersion: undefined,
  error: undefined,
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
    case actions.GET_TRANSACTIONS_RESULT:
    {
      const transactions = action.value;
      console.log('reducer, transtions', transactions);
      return state.set('transactions', transactions);
    }
    case actions.SET_ERROR:
      return state.set('error', action.value);
    default:
      return state;
  }
}

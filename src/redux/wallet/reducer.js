import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  wallets: [],
  prices: [],
});

export default function walletReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_WALLETS_RESULT:
      return state.set('wallets', action.value);
    case actions.GET_PRICE_RESULT:
    {
      return state.set('prices', action.value && action.value.value);
    }
    default:
      return state;
  }
}

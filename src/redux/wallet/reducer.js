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
      const result = action.value;
      console.log('GET_PRICE_RESULT, result', result);
      let prices = state.get('prices');
      prices = Object.assign(prices, result);
      const newstate = state.set('prices', prices);
      return newstate;
    }
    default:
      return state;
  }
}

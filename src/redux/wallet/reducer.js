import { Map } from 'immutable';
import _ from 'lodash';
import actions from './actions';

const initState = new Map({
  wallets: [],
  prices: [],
  walletManager: undefined, // WalletManager instance
});

export default function walletReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_WALLETS_RESULT:
      return state.set('wallets', action.value);
    case actions.GET_PRICE_RESULT:
    {
      const prices = action.value && action.value.value;
      let newState = state;

      // Only set state and calculate total asset value when price is not undefined and have changed
      if (prices && !_.isEqual(state.get('prices') && prices)) {
        // Update asset value in wallet manger
        const walletManager = state.get('walletManager');
        const { currency } = action.value; // currency is in appReducer so we need to reference from there
        if (walletManager) {
          walletManager.updateAssetValue(prices);
          walletManager.getTotalAssetValue(currency);
        }
        newState = newState.set('prices', action.value && action.value.value);
      }

      return newState;
    }
    case actions.SET_WALLET_MANAGER:
      return state.set('walletManager', action.value);
    default:
      return state;
  }
}

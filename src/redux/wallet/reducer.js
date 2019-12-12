import { Map } from 'immutable';
import _ from 'lodash';
import actions from './actions';
import settings from '../../common/settings';

const initState = new Map({
  wallets: [],
  prices: [],
  walletManager: undefined, // WalletManager instance
  isFetchingBalance: false,
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
          walletManager.updateAssetValue(prices, currency);
          walletManager.getTotalAssetValue(currency);
        }
        newState = newState.set('prices', action.value && action.value.value);
      }

      return newState;
    }
    case actions.SET_WALLET_MANAGER:
      return state.set('walletManager', action.value);
    case actions.FETCH_BALANCE:
      return state.set('isFetchingBalance', false);
    case actions.FETCH_BALANCE_RESULT: {
      const prices = state.get('prices');
      console.log('prices:', prices);
      if (prices) {
        // Update asset value in wallet manger
        const walletManager = state.get('walletManager');
        const currency = settings.get('currency');
        if (walletManager) {
          walletManager.updateAssetValue(prices, currency);
        }
      }
      return state.set('isFetchingBalance', true);
    }
    default:
      return state;
  }
}

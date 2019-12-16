import { Map } from 'immutable';
import _ from 'lodash';
import actions from './actions';

const initState = new Map({
  wallets: [],
  prices: [],
  walletManager: undefined, // WalletManager instance
  isTransactionUpdated: false,
});

export default function walletReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_WALLETS_RESULT:
      return state.set('wallets', action.value);
    case actions.GET_PRICE_RESULT:
    {
      // Only set state when price is an array, to prevent saving mal-formatted data into state
      if (_.isArray(action.value)) {
        return state.set('prices', action.value);
      }

      return state;
    }
    case actions.SET_WALLET_MANAGER:
      return state.set('walletManager', action.value);
    case actions.FETCH_BALANCE_RESULT: {
      const balances = action.value;

      // Update balances in walletManager
      const walletManager = state.get('walletManager');
      if (walletManager) {
        walletManager.updateBalance(balances);
      }

      return state.set('walletManager', walletManager);
    }
    case actions.RESET_TRANSACTION_UPDATED: {
      return state.set('isTransactionUpdated', false);
    }
    case actions.FETCH_TRANSACTION_RESULT: {
      console.log('FETCH_TRANSACTION_RESULT');
      const newState = state.set('isTransactionUpdated', true);
      return newState;
    }
    case actions.UPDATE_ASSET_VALUE: {
      const walletManager = state.get('walletManager');
      const prices = state.get('prices');
      const { currency } = actions.payload;

      if (walletManager) {
        walletManager.updateAssetValue(prices, currency);
      }

      return state.set('walletManager', walletManager);
    }
    default:
      return state;
  }
}

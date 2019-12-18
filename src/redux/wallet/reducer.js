import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  wallets: [],
  prices: [],
  walletManager: undefined, // WalletManager instance
  isAssetValueUpdated: false,
  isTransactionUpdated: false,
  isWalletsUpdated: false,
  isWalletNameUpdated: false,
});

export default function walletReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_WALLETS_RESULT:
      return state.set('wallets', action.value);
    case actions.GET_PRICE_RESULT:
      return state.set('prices', action.value && action.value.value);
    case actions.SET_WALLET_MANAGER:
      return state.set('walletManager', action.value);
    case actions.FETCH_BALANCE_RESULT: {
      const balances = action.value;
      let newState = state;

      // Update balances in walletManager
      const walletManager = state.get('walletManager');
      if (walletManager) {
        const isDirty = walletManager.updateBalance(balances);

        if (isDirty) {
          newState = newState.set('isAssetValueUpdated', true);
        }
      }

      return newState;
    }
    case actions.RESET_ASSET_VALUE_UPDATED:
      return state.set('isAssetValueUpdated', false);
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
      const currency = action.payload;

      if (walletManager) {
        walletManager.updateAssetValue(prices, currency);
      }

      return state.set('isAssetValueUpdated', true);
    }
    case actions.WALLTES_UPDATED: {
      return state.set('isWalletsUpdated', true);
    }
    case actions.RESET_WALLETS_UPDATED: {
      return state.set('isWalletsUpdated', false);
    }
    case actions.WALLTE_NAME_UPDATED: {
      return state.set('isWalletNameUpdated', true);
    }
    case actions.RESET_WALLET_NAME_UPDATED: {
      return state.set('isWalletNameUpdated', false);
    }
    default:
      return state;
  }
}

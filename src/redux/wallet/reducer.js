import { Map } from 'immutable';
import actions from './actions';
import common from '../../common/common';

const initState = new Map({
  wallets: [],
  prices: [],
  latestBlockHeights: [],
  walletManager: undefined, // WalletManager instance
  updateTimestamp: 0,
  isBalanceUpdated: false,
  isWalletsUpdated: false,
  isWalletNameUpdated: false,
  swapFromCoin: null,
  swapDestCoin: null,
});

/**
 * Return current Date's timestamp in order to update updateTimestamp value
 */
function getUpdateTimestamp() {
  return (new Date()).getTime();
}

export default function walletReducer(state = initState, action) {
  switch (action.type) {
    case actions.SET_WALLET_MANAGER:
    {
      return state.set('walletManager', action.value);
    }
    case actions.GET_PRICE_RESULT:
    {
      let prices = action.value && action.value.value;
      // Add or update DOC price
      prices = prices && common.addOrUpdateDOCPrice(prices);
      return state.set('prices', prices);
    }
    case actions.FETCH_BALANCE_RESULT:
    {
      const balances = action.value;

      // Update balances in walletManager
      const walletManager = state.get('walletManager');
      if (walletManager) {
        const isDirty = walletManager.updateBalance(balances);

        if (isDirty) {
          return state.set('isBalanceUpdated', true);
        }
      }

      return state;
    }
    case actions.RESET_BALANCE_UPDATED: {
      return state.set('isBalanceUpdated', false);
    }
    case actions.FETCH_TRANSACTION_RESULT: {
      return state.set('updateTimestamp', getUpdateTimestamp());
    }
    case actions.FETCH_LATEST_BLOCK_HEIGHT_RESULT: {
      return state.set('latestBlockHeights', action.value);
    }
    case actions.UPDATE_ASSET_VALUE: {
      const walletManager = state.get('walletManager');
      const prices = state.get('prices');
      const currency = action.payload;

      if (walletManager) {
        walletManager.updateAssetValue(prices, currency);
      }

      return state.set('updateTimestamp', getUpdateTimestamp());
    }
    case actions.WALLETS_UPDATED: {
      return state.set('isWalletsUpdated', true)
        .set('updateTimestamp', getUpdateTimestamp());
    }
    case actions.RESET_WALLETS_UPDATED: {
      return state.set('isWalletsUpdated', false);
    }
    case actions.WALLTE_NAME_UPDATED: {
      return state.set('isWalletNameUpdated', true)
        .set('updateTimestamp', getUpdateTimestamp());
    }
    case actions.RESET_WALLET_NAME_UPDATED: {
      return state.set('isWalletNameUpdated', false);
    }
    case actions.SET_SWAP_SOURCE: {
      return state.set('swapSource', action.payload);
    }
    case actions.SET_SWAP_DEST: {
      return state.set('swapDest', action.payload);
    }
    case actions.RESET_SWAP: {
      return state.set('swapDest', null);
    }
    case actions.SWITCH_SWAP: {
      const swapSource = state.get('swapSource');
      const swapDest = state.get('swapDest');
      return state.set('swapSource', swapDest)
        .set('swapDest', swapSource);
    }
    default:
      return state;
  }
}

import { Map } from 'immutable';
import _ from 'lodash';
import actions from './actions';

const initState = new Map({
  wallets: [],
  latestBlockHeights: [],
  walletManager: undefined, // WalletManager instance
  updateTimestamp: 0,
  isTokensUpdated: false,
  isWalletsUpdated: false,
  isWalletNameUpdated: false,
  swapFromCoin: null,
  swapDestCoin: null,
  addTokenResult: null,
  swapRates: {},
  swapRatesError: null,
  tokensChannel: undefined,
  transactionsChannel: undefined,
  txTimestamp: undefined,
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
    case actions.FETCH_TOKENS_RESULT:
    {
      const balances = action.value;

      // Update tokens data in walletManager
      const walletManager = state.get('walletManager');
      if (walletManager) {
        const isDirty = walletManager.updateTokens(balances);

        if (isDirty) {
          return state.set('isTokensUpdated', true);
        }
      }

      return state;
    }
    case actions.RESET_TOKENS_UPDATED: {
      return state.set('isTokensUpdated', false);
    }
    case actions.FETCH_TRANSACTIONS_RESULT: {
      return state.set('txTimestamp', action.timestamp);
    }
    case actions.FETCH_LATEST_BLOCK_HEIGHT_RESULT: {
      return state.set('latestBlockHeights', action.value);
    }
    case actions.UPDATE_LATEST_BLOCK_HEIGHT: {
      const blockHeightObj = action.value;
      const latestBlockHeights = state.get('latestBlockHeights');
      const txIndex = _.findIndex(latestBlockHeights, { chain: blockHeightObj.chain, type: blockHeightObj.type });
      latestBlockHeights[txIndex] = blockHeightObj;
      return state.set('latestBlockHeights', latestBlockHeights);
    }
    case actions.UPDATE_ASSET_VALUE: {
      const walletManager = state.get('walletManager');
      const { currency, prices } = action.payload;

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
    case actions.WALLET_NAME_UPDATED: {
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
    case actions.RESET_SWAP_SOURCE: {
      return state.set('swapSource', null);
    }
    case actions.RESET_SWAP_DEST: {
      return state.set('swapDest', null);
    }
    case actions.SWITCH_SWAP: {
      const swapSource = state.get('swapSource');
      const swapDest = state.get('swapDest');
      return state.set('swapSource', swapDest)
        .set('swapDest', swapSource);
    }
    case actions.SET_ADD_TOKEN_RESULT: {
      return state.set('addTokenResult', action.value);
    }
    case actions.RESET_ADD_TOKEN_RESULT: {
      return state.set('addTokenResult', null);
    }
    case actions.GET_SWAP_RATE_RESULT: {
      const swapRates = _.clone(state.get('swapRates'));
      const swapRate = action.value;
      const { sourceCoinId, destCoinId, rate } = swapRate;
      _.merge(swapRates, { [sourceCoinId]: { [destCoinId]: rate } });
      console.log('swapRates: ', swapRates);
      return state.set('swapRates', swapRates);
    }
    case actions.SET_SWAP_RATE_RESULT_ERROR: {
      const swapRates = state.get('swapRates');
      const { sourceCoinId, destCoinId, error } = action.value;
      // If pairs is not in the swapRates cache, set error
      if (!swapRates[sourceCoinId] || !swapRates[sourceCoinId][destCoinId]) {
        return state.set('swapRatesError', error);
      }
      return state;
    }
    case actions.RESET_SWAP_RATE_RESULT_ERROR: {
      return state.set('swapRatesError', null);
    }
    case actions.SET_TOKENS_CHANNEL: {
      return state.set('tokensChannel', action.value);
    }
    case actions.SET_TRANSACTIONS_CHANNEL: {
      return state.set('transactionsChannel', action.value);
    }
    default:
      return state;
  }
}

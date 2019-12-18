/** Actions related to Wallet functions */

const actions = {
  // Constants definition
  GET_WALLETS: 'GET_WALLETS',
  GET_WALLETS_RESULT: 'GET_WALLETS_RESULT',
  GET_PRICE: 'GET_PRICE',
  GET_PRICE_RESULT: 'GET_PRICE_RESULT',
  FETCH_BALANCE: 'FETCH_BALANCE',
  FETCH_BALANCE_RESULT: 'FETCH_BALANCE_RESULT',
  FETCH_TRANSACTION: 'FETCH_TRANSACTION',
  FETCH_TRANSACTION_RESULT: 'FETCH_TRANSACTION_RESULT',
  SET_WALLET_MANAGER: 'SET_WALLET_MANAGER',
  DELETE_KEY: 'DELETE_KEY',
  RENAME_KEY: 'RENAME_KEY',
  CREATE_KEY: 'CREATE_KEY',
  RESET_ASSET_VALUE_UPDATED: 'RESET_ASSET_VALUE_UPDATED',
  RESET_TRANSACTION_UPDATED: 'RESET_TRANSACTION_UPDATED',
  UPDATE_ASSET_VALUE: 'UPDATE_ASSET_VALUE',
  START_FETCH_BALANCE_TIMER: 'START_FETCH_BALANCE_TIMER',
  WALLTES_UPDATED: 'WALLTES_UPDATED',
  RESET_WALLETS_UPDATED: 'RESET_WALLETS_UPDATED',
  WALLTE_NAME_UPDATED: 'WALLTE_NAME_UPDATED',
  RESET_WALLET_NAME_UPDATED: 'RESET_WALLTE_NAME_UPDATED',

  // Functions definition
  getWallets: () => ({
    type: actions.GET_WALLETS,
  }),
  getPrice: (symbols, currencies) => ({
    type: actions.GET_PRICE,
    payload: {
      symbols,
      currencies,
    },
  }),
  fetchBalance: (tokens) => ({
    type: actions.FETCH_BALANCE,
    payload: tokens,
  }),
  fetchTransaction: (walletManager) => ({
    type: actions.FETCH_TRANSACTION,
    walletManager,
  }),
  resetAssetValueUpdated: () => ({
    type: actions.RESET_ASSET_VALUE_UPDATED,
  }),
  resetTransactionUpdated: () => ({
    type: actions.RESET_TRANSACTION_UPDATED,
  }),
  updateAssetValue: (currency) => ({
    type: actions.UPDATE_ASSET_VALUE,
    payload: currency,
  }),
  startFetchBalanceTimer: () => ({
    type: actions.START_FETCH_BALANCE_TIMER,
  }),
  deleteKey: (key, walletManager) => ({
    type: actions.DELETE_KEY,
    payload: {
      key,
      walletManager,
    },
  }),
  renameKey: (key, name, walletManager) => ({
    type: actions.RENAME_KEY,
    payload: {
      key,
      name,
      walletManager,
    },
  }),
  createKey: (name, phrase, coinIds, walletManager) => ({
    type: actions.CREATE_KEY,
    payload: {
      name,
      phrase,
      coinIds,
      walletManager,
    },
  }),
  resetWalletsUpdated: () => ({
    type: actions.RESET_WALLETS_UPDATED,
  }),
  resetWalletNameUpdated: () => ({
    type: actions.RESET_WALLET_NAME_UPDATED,
  }),
};

export default actions;

/** Actions related to Wallet functions */

const actions = {
  // Constants definition
  SET_WALLET_MANAGER: 'SET_WALLET_MANAGER',

  GET_PRICE: 'GET_PRICE',
  GET_PRICE_RESULT: 'GET_PRICE_RESULT',

  FETCH_BALANCE: 'FETCH_BALANCE',
  FETCH_BALANCE_RESULT: 'FETCH_BALANCE_RESULT',
  RESET_BALANCE_UPDATED: 'RESET_BALANCE_UPDATED',

  FETCH_TRANSACTION: 'FETCH_TRANSACTION',
  FETCH_TRANSACTION_RESULT: 'FETCH_TRANSACTION_RESULT',

  FETCH_LATEST_BLOCK_HEIGHT: 'FETCH_LATEST_BLOCK_HEIGHT',
  FETCH_LATEST_BLOCK_HEIGHT_RESULT: 'FETCH_LATEST_BLOCK_HEIGHT_RESULT',

  DELETE_KEY: 'DELETE_KEY',
  RENAME_KEY: 'RENAME_KEY',
  CREATE_KEY: 'CREATE_KEY',
  ADD_CUSTOM_TOKEN: 'ADD_CUSTOM_TOKEN',

  UPDATE_ASSET_VALUE: 'UPDATE_ASSET_VALUE',
  WALLETS_UPDATED: 'WALLETS_UPDATED',

  START_FETCH_PRICE_TIMER: 'START_FETCH_PRICE_TIMER',
  START_FETCH_BALANCE_TIMER: 'START_FETCH_BALANCE_TIMER',
  START_FETCH_TRANSACTION_TIMER: 'START_FETCH_TRANSACTION_TIMER',
  START_FETCH_LATEST_BLOCK_HEIGHT_TIMER: 'START_FETCH_LATEST_BLOCK_HEIGHT_TIMER',

  WALLTES_UPDATED: 'WALLTES_UPDATED',
  RESET_WALLETS_UPDATED: 'RESET_WALLETS_UPDATED',
  WALLTE_NAME_UPDATED: 'WALLTE_NAME_UPDATED',
  RESET_WALLET_NAME_UPDATED: 'RESET_WALLTE_NAME_UPDATED',

  SET_SWAP_SOURCE: 'SET_SWAP_SOURCE',
  SET_SWAP_DEST: 'SET_SWAP_DEST',
  RESET_SWAP: 'RESET_SWAP',
  SWITCH_SWAP: 'SWITCH_SWAP',

  // Functions definition
  getPrice: (symbols, currencies) => ({
    type: actions.GET_PRICE,
    payload: {
      symbols,
      currencies,
    },
  }),
  fetchBalance: (walletManager) => ({
    type: actions.FETCH_BALANCE,
    payload: walletManager,
  }),
  resetBalanceUpdated: () => ({
    type: actions.RESET_BALANCE_UPDATED,
  }),
  fetchTransaction: (walletManager) => ({
    type: actions.FETCH_TRANSACTION,
    payload: walletManager,
  }),
  updateAssetValue: (currency) => ({
    type: actions.UPDATE_ASSET_VALUE,
    payload: currency,
  }),
  startFetchPriceTimer: () => ({
    type: actions.START_FETCH_PRICE_TIMER,
  }),
  startFetchBalanceTimer: (walletManager) => ({
    type: actions.START_FETCH_BALANCE_TIMER,
    payload: walletManager,
  }),
  startFetchTransactionTimer: (walletManager) => ({
    type: actions.START_FETCH_TRANSACTION_TIMER,
    payload: walletManager,
  }),
  startFetchLatestBlockHeightTimer: () => ({
    type: actions.START_FETCH_LATEST_BLOCK_HEIGHT_TIMER,
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
  createKey: (name, phrase, coins, walletManager) => ({
    type: actions.CREATE_KEY,
    payload: {
      name,
      phrase,
      coins,
      walletManager,
    },
  }),

  resetWalletsUpdated: () => ({
    type: actions.RESET_WALLETS_UPDATED,
  }),
  resetWalletNameUpdated: () => ({
    type: actions.RESET_WALLET_NAME_UPDATED,
  }),
  setSwapSource: (walletName, coin) => ({
    type: actions.SET_SWAP_SOURCE,
    payload: {
      walletName,
      coin,
    },
  }),
  setSwapDest: (walletName, coin) => ({
    type: actions.SET_SWAP_DEST,
    payload: {
      walletName,
      coin,
    },
  }),
  resetSwap: () => ({ type: actions.RESET_SWAP }),
  switchSwap: () => ({ type: actions.SWITCH_SWAP }),
  addCustomToken: (walletManager, wallet, symbol, type) => ({
    type: actions.ADD_CUSTOM_TOKEN,
    payload: {
      walletManager, wallet, symbol, type,
    },
  }),
};

export default actions;

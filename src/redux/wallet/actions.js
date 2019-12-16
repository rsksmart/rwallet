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
  RESET_TRANSACTION_UPDATED: 'RESET_TRANSACTION_UPDATED',
  UPDATE_ASSET_VALUE: 'UPDATE_ASSET_VALUE',
  START_FETCH_BALANCE_TIMER: 'START_FETCH_BALANCE_TIMER',

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
  resetTransactionUpdated: () => ({
    type: actions.RESET_TRANSACTION_UPDATED,
  }),
  updateAssetValue: (currency) => ({
    type: actions.UPDATE_ASSET_VALUE,
    payload: { currency },
  }),
  startFetchBalanceTimer: () => ({
    type: actions.START_FETCH_BALANCE_TIMER,

  }),
};

export default actions;

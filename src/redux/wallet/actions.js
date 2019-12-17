/** Actions related to Wallet functions */

const actions = {
  // Constants definition
  GET_WALLETS: 'GET_WALLETS',
  GET_WALLETS_RESULT: 'GET_WALLETS_RESULT',
  GET_PRICE: 'GET_PRICE',
  GET_PRICE_RESULT: 'GET_PRICE_RESULT',
  FETCH_BALANCE: 'FETCH_BALANCE',
  FETCH_TRANSACTION: 'FETCH_TRANSACTION',
  SET_WALLET_MANAGER: 'SET_WALLET_MANAGER',
  DELETE_KEY: 'DELETE_KEY',
  RENAME_KEY: 'RENAME_KEY',

  // Functions definition
  getWallets: () => ({
    type: actions.GET_WALLETS,
  }),
  getPrice: (symbols, currencies, currency) => {
    console.log('actions::getPrice is called.', symbols, currencies, currency);
    return {
      type: actions.GET_PRICE,
      payload: {
        symbols,
        currencies,
      },
      currency,
    };
  },
  fetchBalance: (walletManager) => ({
    type: actions.FETCH_BALANCE,
    walletManager,
  }),
  fetchTransaction: (walletManager) => ({
    type: actions.FETCH_TRANSACTION,
    walletManager,
  }),
  deleteKey: (key) => ({
    type: actions.DELETE_KEY,
    payload: {
      key,
    },
  }),
  renameKey: (key) => ({
    type: actions.RENAME_KEY,
    payload: {
      key,
    },
  }),
};

export default actions;

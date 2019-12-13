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
  RESET_BALANCE_UPDATED: 'RESET_BALANCE_UPDATED',
  RESET_TRANSACTION_UPDATED: 'RESET_TRANSACTION_UPDATED',

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
  resetBalanceUpdated: () => ({
    type: actions.RESET_BALANCE_UPDATED,
  }),
  fetchTransaction: (walletManager) => ({
    type: actions.FETCH_TRANSACTION,
    walletManager,
  }),
  resetTransactionUpdated: () => ({
    type: actions.RESET_TRANSACTION_UPDATED,
  }),
};

export default actions;

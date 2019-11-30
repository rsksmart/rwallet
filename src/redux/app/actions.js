/** App actions set variables that are used globally */

const actions = {
  // Constants definition
  LOADING: 'LOADING',
  INIT_APP: 'INIT_APP',

  GET_SERVER_INFO: 'GET_SERVER_INFO',
  GET_SERVER_INFO_RESULT: 'GET_SERVER_INFO_RESULT',
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  GET_TRANSACTIONS_RESULT: 'GET_TRANSACTIONS_RESULT',
  CREATE_RAW_TRANSATION: 'CREATE_RAW_TRANSATION',
  CREATE_RAW_TRANSATION_RESULT: 'CREATE_RAW_TRANSATION_RESULT',
  SET_ERROR: 'SET_ERROR',
  CHANGE_CURRENCY: 'CHANGE_CURRENCY',

  // Functions definition
  loading: (isLoading) => ({
    type: actions.LOADING,
    value: isLoading,
  }),
  initApp: () => ({
    type: actions.INIT_APP,
  }),
  getServerInfo: () => {
    console.log('getServerInfo is called.');
    return {
      type: actions.GET_SERVER_INFO,
    };
  },
  getTransactions: (symbol, type, address) => {
    console.log('actions::getTransactions is called.');
    return {
      type: actions.GET_TRANSACTIONS,
      payload: { symbol, type, address },
    };
  },
  createRawTransaction: (symbol, type, sender, receiver, value, data) => {
    console.log('actions::createRawTransaction is called.');
    return {
      type: actions.CREATE_RAW_TRANSATION,
      payload: {
        symbol, type, sender, receiver, value, data,
      },
    };
  },
  changeCurrency: (currency) => ({
    type: actions.CHANGE_CURRENCY,
    payload: { currency },
  }),
};

export default actions;

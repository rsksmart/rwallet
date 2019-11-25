/** App actions set variables that are used globally */

const actions = {
  // Constants definition
  LOADING: 'LOADING',
  GET_SERVER_INFO: 'GET_SERVER_INFO',
  GET_SERVER_INFO_RESULT: 'GET_SERVER_INFO_RESULT',
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  GET_TRANSACTIONS_RESULT: 'GET_TRANSACTIONS_RESULT',
  CREATE_RAW_TRANSATION: 'CREATE_RAW_TRANSATION',
  CREATE_RAW_TRANSATION_RESULT: 'CREATE_RAW_TRANSATION_RESULT',
  GET_PRICE: 'GET_PRICE',
  GET_PRICE_RESULT: 'GET_PRICE_RESULT',
  SET_ERROR: 'SET_ERROR',

  // Functions definition
  loading: (isLoading) => ({
    type: actions.LOADING,
    value: isLoading,
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
  getPrice: (symbols) => {
    console.log('actions::getPriace is called.');
    return {
      type: actions.GET_PRICE,
      payload: { symbols },
    };
  },
};

export default actions;

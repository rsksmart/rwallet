/** App actions set variables that are used globally */

const actions = {
  // Constants definition
  IS_PAGE_LOADING: 'IS_PAGE_LOADING',

  INIT_FROM_STORAGE: 'INIT_FROM_STORAGE',
  INIT_FROM_STORAGE_DONE: 'INIT_FROM_STORAGE_DONE',

  INIT_WITH_PARSE: 'INIT_WITH_PARSE',
  INIT_WITH_PARSE_DONE: 'INIT_WITH_PARSE_DONE',
  RESET_INIT_DONE: 'RESET_INIT_DONE',

  UPDATE_USER: 'UPDATE_USER',

  GET_SERVER_INFO_RESULT: 'GET_SERVER_INFO_RESULT',
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  GET_TRANSACTIONS_RESULT: 'GET_TRANSACTIONS_RESULT',
  CREATE_RAW_TRANSATION: 'CREATE_RAW_TRANSATION',
  CREATE_RAW_TRANSATION_RESULT: 'CREATE_RAW_TRANSATION_RESULT',
  SET_ERROR: 'SET_ERROR',
  SET_APPLICATION: 'SET_APPLICATION',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_SINGLE_SETTINGS: 'SET_SINGLE_SETTINGS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',

  // Functions definition
  initializeFromStorage: () => ({
    type: actions.INIT_FROM_STORAGE,
  }),
  initializeWithParse: () => ({
    type: actions.INIT_WITH_PARSE,
  }),
  addNotification: (notification) => ({
    type: actions.ADD_NOTIFICATION,
    notification,
  }),
  removeNotification: () => ({
    type: actions.REMOVE_NOTIFICATION,
  }),
  setPageLoading: (isLoading) => ({
    type: actions.IS_PAGE_LOADING,
    value: isLoading,
  }),
  getTransactions: (symbol, type, address, page) => {
    console.log('actions::getTransactions is called.');
    return {
      type: actions.GET_TRANSACTIONS,
      payload: {
        symbol, type, address, page,
      },
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
  setSingleSettings: (key, value) => ({
    type: actions.SET_SINGLE_SETTINGS,
    key,
    value,
  }),
  updateUser: () => ({
    type: actions.UPDATE_USER,
  }),
  resetInitDone: () => ({
    type: actions.RESET_INIT_DONE,
  }),
};

export default actions;

/** App actions set variables that are used globally */

const actions = {
  // Constants definition
  IS_PAGE_LOADING: 'IS_PAGE_LOADING',

  INIT_FROM_STORAGE: 'INIT_FROM_STORAGE',
  INIT_FROM_STORAGE_DONE: 'INIT_FROM_STORAGE_DONE',

  INIT_WITH_PARSE: 'INIT_WITH_PARSE',
  INIT_WITH_PARSE_DONE: 'INIT_WITH_PARSE_DONE',

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
  SHOW_PASSCODE: 'SHOW_PASSCODE',
  HIDE_PASSCODE: 'HIDE_PASSCODE',
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
  ADD_CONFIRMATION: 'ADD_CONFIRMATION',
  REMOVE_CONFIRMATION: 'REMOVE_CONFIRMATION',
  SET_USER: 'SET_USER',
  RENAME: 'RENAME',
  USER_NAME_UPDATED: 'USER_NAME_UPDATED',
  RESET_USER_NAME_UPDATED: 'RESET_USER_NAME_UPDATED',

  LOCK_APP: 'LOCK_APP',

  SET_PASSCODE: 'SET_PASSWORD',
  UPDATE_PASSCODE: 'UPDATE_PASSCODE',

  SHOW_INAPP_NOTIFICATON: 'SHOW_INAPP_NOTIFICATON',

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
  showPasscode: (category, callback, fallback) => ({
    type: actions.SHOW_PASSCODE,
    value: { category, callback, fallback },
  }),
  hidePasscode: () => ({
    type: actions.HIDE_PASSCODE,
  }),
  setPageLoading: (isLoading) => ({
    type: actions.IS_PAGE_LOADING,
    value: isLoading,
  }),
  getTransactions: (symbol, type, address, page) => ({
    type: actions.GET_TRANSACTIONS,
    payload: {
      symbol, type, address, page,
    },
  }),
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
  changeLanguage: (language) => ({
    type: actions.CHANGE_LANGUAGE,
    language,
  }),
  addConfirmation: (confirmation) => ({
    type: actions.ADD_CONFIRMATION,
    confirmation,
  }),
  removeConfirmation: () => ({
    type: actions.REMOVE_CONFIRMATION,
  }),
  rename: (name) => ({
    type: actions.RENAME,
    name,
  }),
  resetUsernameUpdated: () => ({
    type: actions.RESET_USER_NAME_UPDATED,
  }),
  lockApp: (lock) => ({
    type: actions.LOCK_APP,
    lock,
  }),
  setPasscode: (passcode) => ({
    type: actions.SET_PASSCODE,
    passcode,
  }),
  showInAppNotification: () => ({
    type: actions.SHOW_INAPP_NOTIFICATON,
  }),
};

export default actions;

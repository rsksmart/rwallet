/** App actions set variables that are used globally */

const actions = {
  // Constants definition
  INIT_FROM_STORAGE: 'INIT_FROM_STORAGE',
  INIT_FROM_STORAGE_DONE: 'INIT_FROM_STORAGE_DONE',

  INIT_WITH_PARSE: 'INIT_WITH_PARSE',
  INIT_WITH_PARSE_DONE: 'INIT_WITH_PARSE_DONE',

  UPDATE_USER: 'UPDATE_USER',

  GET_SERVER_INFO: 'GET_SERVER_INFO',
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
  SHOW_FINGERPRINT_MODAL: 'SHOW_FINGERPRINT_MODAL',
  HIDE_FINGERPRINT_MODAL: 'HIDE_FINGERPRINT_MODAL',
  FINGERPRINT_USE_PASSCODE: 'FINGERPRINT_USE_FINGERPRINT',
  AUTH_VERIFY: 'AUTH_VERIFY',

  LOCK_APP: 'LOCK_APP',

  SET_PASSCODE: 'SET_PASSWORD',
  UPDATE_PASSCODE: 'UPDATE_PASSCODE',

  SHOW_INAPP_NOTIFICATION: 'SHOW_INAPP_NOTIFICATION',
  RESET_INAPP_NOTIFICATION: 'RESET_INAPP_NOTIFICATION',
  SET_INIT_APP_DONE: 'SET_INIT_APP_DONE',
  RECEIVE_NOTIFICATION: 'RECEIVE_NOTIFICATION',
  PROCESS_NOTIFICATON: 'PROCESS_NOTIFICATON',
  SET_FCM_NAV_PARAMS: 'SET_FCM_NAV_PARAMS',
  RESET_FCM_NAV_PARAMS: 'RESET_FCM_NAV_PARAMS',

  INIT_FCM: 'INIT_FCM',
  SET_FCM_TOKEN: 'SET_FCM_TOKEN',
  INIT_FCM_CHANNEL: 'INIT_FCM_CHANNEL',

  LOGIN: 'LOGIN',
  RELOGIN: 'RELOGIN',
  SET_LOGIN: 'SET_LOGIN',
  SET_LOGIN_ERROR: 'SET_LOGIN_ERROR',
  RESET_LOGIN_ERROR: 'RESET_LOGIN_ERROR',

  FETCH_DAPPS: 'FETCH_DAPPS',
  FETCH_DAPP_TYPES: 'FETCH_DAPP_TYPES',
  FETCH_ADVERTISEMENT: 'FETCH_ADVERTISEMENT',
  UPDATE_DAPPS: 'UPDATE_DAPPS',
  UPDATE_DAPP_TYPES: 'UPDATE_DAPP_TYPES',
  UPDATE_ADVERTISEMENT: 'UPDATE_ADVERTISEMENT',
  ADD_RECENT_DAPP: 'ADD_RECENT_DAPP',
  UPDATE_RECENT_DAPPS: 'UPDATE_RECENT_DAPPS',

  SET_PAGE: 'SET_PAGE',
  RESET_PAGE: 'RESET_PAGE',

  SHOW_READ_ONLY_WALLET_INTRO: 'SHOW_READ_ONLY_WALLET_INTRO',
  SET_READ_ONLY_WALLET_INTRO_SHOWED: 'SET_READ_ONLY_WALLET_INTRO_SHOWED',

  SHOW_UPDATE_MODAL: 'SHOW_UPDATE_MODAL',
  HIDE_UPDATE_MODAL: 'HIDE_UPDATE_MODAL',
  SET_UPDATE_MODAL: 'SET_UPDATE_MODAL',

  SET_UPDATE_VERSION_INFO: 'SET_UPDATE_VERSION_INFO',

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
  showFingerprintModal: (callback, fallback, fingerprintPasscodeDisabled = false) => ({
    type: actions.SHOW_FINGERPRINT_MODAL,
    value: { callback, fallback, fingerprintPasscodeDisabled },
  }),
  hideFingerprintModal: () => ({
    type: actions.HIDE_FINGERPRINT_MODAL,
  }),
  fingerprintUsePasscode: (callback, fallback) => ({
    type: actions.FINGERPRINT_USE_PASSCODE,
    value: { callback, fallback },
  }),
  /**
 * callAuthVerify decide how to verify authorization
 * fingerprint, passcode or nothing
 */
  callAuthVerify: (callback, fallback) => ({
    type: actions.AUTH_VERIFY,
    value: { callback, fallback },
  }),
  lockApp: (lock) => ({
    type: actions.LOCK_APP,
    lock,
  }),
  setPasscode: (passcode) => ({
    type: actions.SET_PASSCODE,
    passcode,
  }),
  showInAppNotification: (inAppNotification) => ({
    type: actions.SHOW_INAPP_NOTIFICATION,
    inAppNotification,
  }),
  resetInAppNotification: () => ({
    type: actions.RESET_INAPP_NOTIFICATION,
  }),
  initFcmChannel: () => ({
    type: actions.INIT_FCM_CHANNEL,
  }),
  receiveNotification: (notification, fcmType) => ({
    type: actions.RECEIVE_NOTIFICATION,
    notification,
    fcmType,
  }),
  processNotification: (notification) => ({
    type: actions.PROCESS_NOTIFICATON,
    notification,
  }),
  setFcmNavParams: (fcmNavParams) => ({
    type: actions.SET_FCM_NAV_PARAMS,
    fcmNavParams,
  }),
  resetFcmNavParams: () => ({
    type: actions.RESET_FCM_NAV_PARAMS,
  }),
  getServerInfo: () => ({
    type: actions.GET_SERVER_INFO,
  }),
  initFcm: () => ({
    type: actions.INIT_FCM,
  }),
  setLoginError: () => ({
    type: actions.SET_LOGIN_ERROR,
  }),
  resetLoginError: () => ({
    type: actions.RESET_LOGIN_ERROR,
  }),
  login: (isRelogin) => ({
    type: actions.LOGIN,
    isRelogin,
  }),
  relogin: () => ({
    type: actions.RELOGIN,
  }),
  setLogin: (isLogin) => ({
    type: actions.SET_LOGIN,
    isLogin,
  }),
  fetchDapps: () => ({
    type: actions.FETCH_DAPPS,
  }),
  fetchDappTypes: () => ({
    type: actions.FETCH_DAPP_TYPES,
  }),
  fetchAdvertisements: () => ({
    type: actions.FETCH_ADVERTISEMENT,
  }),
  addRecentDapp: (dapp) => ({
    type: actions.ADD_RECENT_DAPP,
    dapp,
  }),
  setPage: (page) => ({
    type: actions.SET_PAGE,
    page,
  }),
  resetPage: () => ({
    type: actions.RESET_PAGE,
  }),
  showReadOnlyWalletIntro: () => ({
    type: actions.SHOW_READ_ONLY_WALLET_INTRO,
  }),
  setReadOnlyWalletIntroShowed: () => ({
    type: actions.SET_READ_ONLY_WALLET_INTRO_SHOWED,
  }),
  showUpdateModal: () => ({
    type: actions.SHOW_UPDATE_MODAL,
  }),
  hideUpdateModal: () => ({
    type: actions.HIDE_UPDATE_MODAL,
  }),
  setUpdateModal: (visible) => ({
    type: actions.SET_UPDATE_MODAL,
    visible,
  }),
  setUpdateVersionInfo: (updateVersionInfo) => ({
    type: actions.SET_UPDATE_VERSION_INFO,
    updateVersionInfo,
  }),
};

export default actions;

import definitions from './definitions';
import ERROR_CODE from './errors';

const errorNotifications = {
  [ERROR_CODE.ERC20_CONTRACT_NOT_FOUND]: {
    title: 'modal.contractNotFound.title',
    body: 'modal.contractNotFound.body',
  },
  [ERROR_CODE.ERR_REQUEST_TIMEOUT]: {
    title: 'modal.requestTimeout.title',
    body: 'modal.requestTimeout.body',
  },
  [ERROR_CODE.NOT_ENOUGH_BTC]: {
    title: 'modal.txFailed.title',
    body: 'modal.txFailed.moreBTC',
  },
  [ERROR_CODE.NOT_ENOUGH_RBTC]: {
    title: 'modal.txFailed.title',
    body: 'modal.txFailed.moreRBTC',
  },
  [ERROR_CODE.NOT_ENOUGH_BALANCE]: {
    title: 'modal.txFailed.title',
    body: 'modal.txFailed.moreBalance',
  },
  [ERROR_CODE.TIME_OUT]: {
    title: 'modal.txFailed.title',
    body: 'modal.txFailed.serverTimeout',
  },
};


export const createSuccessNotification = (title, message, buttonText, notificationCloseCallback) => ({
  id: Date.now(),
  type: 'success',
  title,
  message,
  buttonText,
  notificationCloseCallback,
});

export const createInfoNotification = (title, message, buttonText, notificationCloseCallback) => ({
  id: Date.now(),
  type: 'info',
  title,
  message,
  buttonText,
  notificationCloseCallback,
});

export const createWarningNotification = (title, message, buttonText, notificationCloseCallback) => ({
  id: Date.now(),
  type: 'warning',
  title,
  message,
  buttonText,
  notificationCloseCallback,
});

export const createErrorNotification = (title, message, buttonText, notificationCloseCallback) => ({
  id: Date.now(),
  type: 'error',
  title,
  message,
  buttonText,
  notificationCloseCallback,
});

/**
 * get error notification by error code
 * @param {number} errorCode
 * @param {string} buttonText
 * @param {function} notificationCloseCallback
 * @returns {object} notification object
 */
export const getErrorNotification = (errorCode, buttonText, notificationCloseCallback) => {
  const errNotification = errorNotifications[errorCode];
  if (!errNotification) {
    return null;
  }
  const { title, body } = errNotification;
  const notification = createErrorNotification(title, body, buttonText, notificationCloseCallback);
  return notification;
};

export const getDefaultErrorNotification = (buttonText, notificationCloseCallback) => createErrorNotification(
  definitions.defaultErrorNotification.title,
  definitions.defaultErrorNotification.message,
  buttonText,
  notificationCloseCallback,
);

export const getDefaultTxFailedErrorNotification = (buttonText, notificationCloseCallback) => createErrorNotification(
  'modal.txFailed.title',
  'modal.txFailed.contactService',
  buttonText,
  notificationCloseCallback,
);

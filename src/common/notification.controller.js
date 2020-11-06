import _ from 'lodash';
import { defaultErrorNotification } from './constants';
import { ERROR_CODE } from './error';
import { strings } from './i18n';

export const errorNotifications = {
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
  [ERROR_CODE.ERR_SYMBOL_TYPE_TOKEN]: {
    title: 'modal.InvalidTokenSymbol.title',
    body: 'modal.InvalidTokenSymbol.body',
  },
  [ERROR_CODE.ERR_EXCEED_RNS_QUOTA]: {
    title: 'modal.rnsExceeded.title',
    body: 'modal.rnsExceeded.body',
  },
  [ERROR_CODE.ERR_USER_NOT_LOGIN]: {
    title: 'modal.userNotLogin.title',
    body: 'modal.userNotLogin.body',
  },
  [ERROR_CODE.ERR_USER_ALREADY_OPERATED]: {
    title: 'modal.userOperated.title',
    body: 'modal.userOperated.body',
  },
  [ERROR_CODE.ERR_INVALID_PROPOSAL]: {
    title: 'modal.invalidProposal.title',
    body: 'modal.invalidProposal.body',
  },
  [ERROR_CODE.ERR_EXIST_UNFINISHED_PROPOSAL]: {
    title: 'modal.existUnfinishedProposal.title',
    body: 'modal.existUnfinishedProposal.body',
  },
  [ERROR_CODE.ERR_FEE_CALCULATION]: {
    title: 'modal.feeCalculationError.title',
    body: 'modal.feeCalculationError.body',
  },
  [ERROR_CODE.ERR_INVALID_ADDRESS]: {
    title: 'modal.invalidAddress.title',
    body: 'modal.invalidAddress.body',
  },
  [ERROR_CODE.ERR_MULTISIG_INVITATION_NOT_FOUND]: {
    title: 'modal.invitationNotFound.title',
    body: 'modal.invitationNotFound.body',
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
  message: strings(message),
  buttonText,
  notificationCloseCallback,
});

export const createWarningNotification = (title, message, buttonText, notificationCloseCallback) => ({
  id: Date.now(),
  type: 'warning',
  title,
  message: strings(message),
  buttonText,
  notificationCloseCallback,
});

export const createErrorNotification = (title, message, buttonText, notificationCloseCallback) => ({
  id: Date.now(),
  type: 'error',
  title,
  message: strings(message),
  buttonText,
  notificationCloseCallback,
});

export const createErrorNotificationWithMessageParams = (title, message, messageParams, buttonText, notificationCloseCallback) => ({
  id: Date.now(),
  type: 'error',
  title,
  message: strings(message, messageParams),
  buttonText,
  notificationCloseCallback,
});

/**
 * get error notification by error code
 * @param {number} errorCode
 * @param {string} buttonText
 * @param {object} messageParams, translation params for message
 * @param {function} notificationCloseCallback
 * @returns {object} notification object
 */
export const getErrorNotification = (errorCode, buttonText, messageParams, notificationCloseCallback) => {
  const errNotification = errorNotifications[errorCode];
  if (!errNotification) {
    return null;
  }
  const { title, body } = errNotification;
  const notification = _.isEmpty(messageParams) ? createErrorNotification(title, body, buttonText, notificationCloseCallback)
    : createErrorNotificationWithMessageParams(title, body, messageParams, buttonText, notificationCloseCallback);
  return notification;
};

export const getDefaultErrorNotification = (buttonText, notificationCloseCallback) => createErrorNotification(
  defaultErrorNotification.title,
  defaultErrorNotification.message,
  buttonText,
  notificationCloseCallback,
);

export const getDefaultTxFailedErrorNotification = (buttonText, notificationCloseCallback) => createErrorNotification(
  'modal.txFailed.title',
  'modal.txFailed.contactService',
  buttonText,
  notificationCloseCallback,
);

export const createReadOnlyLimitNotification = () => createInfoNotification('modal.readOnlyLimit.title', 'modal.readOnlyLimit.body');

export const createUnableRecoverNotification = () => createErrorNotification('modal.unableRecover.title', 'modal.unableRecover.body');

export const createDuplicatePhraseNotification = (callback) => createErrorNotification('modal.duplicatePhrase.title', 'modal.duplicatePhrase.body', callback);

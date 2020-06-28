const createInfoConfirmation = (title, message, confirmationCallback, confirmationCancelCallback) => ({
  id: Date.now(),
  type: 'info',
  title,
  message,
  confirmationCallback,
  confirmationCancelCallback,
});


const createErrorConfirmation = (title, message, confirmText, confirmationCallback, confirmationCancelCallback) => ({
  id: Date.now(),
  type: 'error',
  title,
  message,
  confirmText,
  confirmationCallback,
  confirmationCancelCallback,
});

const createNewFeatureConfirmation = (title, message, confirmText, cancelText, confirmationCallback, confirmationCancelCallback) => ({
  id: Date.now(),
  type: 'newFeature',
  title,
  message,
  confirmText,
  cancelText,
  confirmationCallback,
  confirmationCancelCallback,
});

const createDappWarningConfirmation = (title, message, confirmationCallback, confirmationCancelCallback) => ({
  id: Date.now(),
  type: 'dappWarning',
  title,
  titleStyle: { fontFamily: 'Avenir-Heavy', fontSize: 17, color: 'black' },
  messageStyle: { fontFamily: 'Avenir-Book', fontSize: 16, color: 'black' },
  message,
  confirmText: 'page.dapp.button.understood',
  cancelText: 'page.dapp.button.cancel',
  confirmationCallback,
  confirmationCancelCallback,
  showCloseBtn: true,
});

export {
  createInfoConfirmation, createErrorConfirmation, createNewFeatureConfirmation, createDappWarningConfirmation,
};

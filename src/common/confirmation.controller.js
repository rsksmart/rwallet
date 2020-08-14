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
  message,
  confirmationCallback,
  confirmationCancelCallback,
});

const createBTCAddressTypeConfirmation = (confirmationCallback, confirmationCancelCallback) => ({
  id: Date.now(),
  type: 'info',
  title: 'modal.chooseBTCAddressType.title',
  message: 'modal.chooseBTCAddressType.body',
  confirmText: 'modal.chooseBTCAddressType.legacy',
  cancelText: 'modal.chooseBTCAddressType.segwit',
  confirmationCallback,
  confirmationCancelCallback,
});

export {
  createInfoConfirmation, createErrorConfirmation, createNewFeatureConfirmation, createDappWarningConfirmation, createBTCAddressTypeConfirmation,
};

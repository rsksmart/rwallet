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

export { createInfoConfirmation, createErrorConfirmation, createNewFeatureConfirmation };

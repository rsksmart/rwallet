const createInfoConfirmation = (title, message, confirmationCallback, confirmationCancelCallback) => ({
  id: Date.now(),
  type: 'info',
  title,
  message,
  confirmationCallback,
  confirmationCancelCallback,
});


const createErrorConfirmation = (title, message, comfirmText, confirmationCallback, confirmationCancelCallback) => ({
  id: Date.now(),
  type: 'error',
  title,
  message,
  comfirmText,
  confirmationCallback,
  confirmationCancelCallback,
});

export { createInfoConfirmation, createErrorConfirmation };

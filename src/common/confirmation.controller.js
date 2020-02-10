const createInfoConfirmation = (title, message, confirmationCallback, confirmationCancelCallback) => ({
  id: Date.now(),
  type: 'info',
  title,
  message,
  confirmationCallback,
  confirmationCancelCallback,
});

export default createInfoConfirmation;

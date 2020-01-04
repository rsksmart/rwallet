const createInfoConfirmation = (title, message, confirmationCallback) => ({
  id: Date.now(),
  type: 'info',
  title,
  message,
  confirmationCallback,
});

export default createInfoConfirmation;

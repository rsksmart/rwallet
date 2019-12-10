export const createSuccessNotification = (title, message) => ({
  id: Date.now(),
  type: 'success',
  title,
  message,
});

export const createInfoNotification = (title, message, buttonText) => ({
  id: Date.now(),
  type: 'info',
  title,
  message,
  buttonText,
});

export const createWarningNotification = (title, message) => ({
  id: Date.now(),
  type: 'warning',
  title,
  message,
});

export const createErrorNotification = (title, message, buttonText) => ({
  id: Date.now(),
  type: 'error',
  title,
  message,
  buttonText,
});

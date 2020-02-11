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

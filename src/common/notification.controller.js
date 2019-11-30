export const createSuccessNotification = (title, message) => ({
  id: Date.now(),
  type: 'success',
  title,
  message,
});

export const createInfoNotification = (title, message) => ({
  id: Date.now(),
  type: 'info',
  title,
  message,
});

export const createWarningNotification = (title, message) => ({
  id: Date.now(),
  type: 'warning',
  title,
  message,
});

export const createErrorNotification = (title, message) => ({
  id: Date.now(),
  type: 'error',
  title,
  message,
});

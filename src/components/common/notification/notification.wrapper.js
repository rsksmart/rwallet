import React from 'react';
import PropTypes from 'prop-types';
import SuccessNotification from './notification.success';
import InfoNotification from './notification.info';
import WarningNotification from './notification.warning';
import ErrorNotification from './notification.error';

const NotificationWrapper = (props) => {
  const { type } = props;
  switch (type) {
    case 'success':
      return <SuccessNotification {...props} />;
    default:
    case 'info':
      return <InfoNotification {...props} />;
    case 'warning':
      return <WarningNotification {...props} />;
    case 'error':
      return <ErrorNotification {...props} />;
  }
};

NotificationWrapper.propTypes = {
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default NotificationWrapper;

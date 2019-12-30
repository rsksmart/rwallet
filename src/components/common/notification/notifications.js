import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Notification from './notification.wrapper';

const Notifications = (props) => {
  const { showNotification, notification, removeNotification } = props;
  return (
    <View>
      {showNotification && notification && (
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        buttonText={notification.buttonText}
        onClosePress={removeNotification}
      />
      )}
    </View>
  );
};

Notifications.propTypes = {
  showNotification: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  notification: PropTypes.object,
  removeNotification: PropTypes.func.isRequired,
};

Notifications.defaultProps = {
  // eslint-disable-next-line react/forbid-prop-types
  notification: null,
};

export default Notifications;

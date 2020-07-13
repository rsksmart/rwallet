import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Notification from './notification.wrapper';

const Notifications = (props) => {
  const {
    showNotification, notification, removeNotification, notificationCloseCallback,
  } = props;
  return (
    <View>
      {showNotification && notification && (
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        buttonText={notification.buttonText}
        onClosePress={removeNotification}
        notificationCloseCallback={notificationCloseCallback}
      />
      )}
    </View>
  );
};

Notifications.propTypes = {
  showNotification: PropTypes.bool.isRequired,
  notification: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    buttonText: PropTypes.string,
  }),
  removeNotification: PropTypes.func.isRequired,
  notificationCloseCallback: PropTypes.func,
};

Notifications.defaultProps = {
  notification: null,
  notificationCloseCallback: null,
};

export default Notifications;

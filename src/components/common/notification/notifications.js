import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Notification from './notification.wrapper';
import actions from '../../../redux/app/actions';

const Notifications = (props) => {
  const { notifications } = props;
  return (
    <>
      {notifications && notifications.map((notification, index) => (
        <View
          key={notification.id}
          style={{
            marginTop: index !== 0 ? 15 : 0,
          }}
        >
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClosePress={() => {
              actions.removeNotification(notification);
            }}
          />
        </View>
      ))}
    </>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Notifications;

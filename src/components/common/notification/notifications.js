import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Notification from './notification.wrapper';
import actions from '../../../redux/app/actions';

const Notifications = (props) => {
  const { showNotification, notification, dispatch } = props;
  return (
    <View>
      {showNotification && (
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClosePress={() => dispatch(actions.removeNotification())}
      />
      )}
    </View>
  );
};

Notifications.propTypes = {
  showNotification: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  notification: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Notifications;

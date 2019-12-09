import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Notification from './notification.wrapper';
import actions from '../../../redux/app/actions';

const Notifications = (props) => {
  const { showNotification, notification, dispatch } = props;
  return (
    <View>
      {showNotification && notification && (
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        buttonText={notification.buttonText}
        onClosePress={() => dispatch(actions.removeNotification())}
      />
      )}
    </View>
  );
};

Notifications.propTypes = {
  showNotification: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  notification: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
};

Notifications.defaultProps = {
  // eslint-disable-next-line react/forbid-prop-types
  notification: null,
};

export default Notifications;

import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, TouchableOpacity, View, Text, Vibration,
} from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import color from '../../../assets/styles/color.ts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 13,
  },
  title: {
    color: color.black,
    fontWeight: 'bold',
  },
  message: {
    color: color.black,
    marginTop: 5,
  },
});

class NotificationBar extends React.Component {
  componentDidUpdate(prevProps) {
    const { vibrate, isOpen } = this.props;
    if ((prevProps.vibrate || vibrate) && isOpen && !prevProps.isOpen) {
      Vibration.vibrate();
    }
  }

  onNotificationPress = () => {
    const { onPress, onClose } = this.props;
    onClose();
    onPress();
  }

  onSwipe = (direction) => {
    const { onClose } = this.props;
    const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

    if (direction === SWIPE_RIGHT || direction === SWIPE_LEFT) {
      onClose();
    }
  }

  render() {
    const { title, message } = this.props;

    return (
      <GestureRecognizer onSwipe={this.onSwipe} style={styles.container}>
        <TouchableOpacity
          style={styles.content}
          activeOpacity={0.3}
          underlayColor="transparent"
          onPress={this.onNotificationPress}
        >
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
            <Text numberOfLines={1} style={styles.message}>{message}</Text>
          </View>
        </TouchableOpacity>
      </GestureRecognizer>
    );
  }
}

NotificationBar.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  vibrate: PropTypes.bool,
  isOpen: PropTypes.bool,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
};

NotificationBar.defaultProps = {
  title: 'Notification',
  message: 'This is a test notification',
  vibrate: true,
  isOpen: false,
  onPress: () => null,
  onClose: () => null,
};

export default NotificationBar;

import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity, View, Text, Vibration,
} from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

const styles = {
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 60,
    height: 70,
    marginTop: 5,
    marginLeft: 10,
  },
  icon: {
    resizeMode: 'contain',
    width: 60,
    height: 70,
  },
  textContainer: {
    alignSelf: 'center',
    marginLeft: 20,
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
  },
  message: {
    color: '#000',
    marginTop: 5,
  },
};

class DefaultNotificationBody extends React.Component {
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

DefaultNotificationBody.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  vibrate: PropTypes.bool,
  isOpen: PropTypes.bool,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
};

DefaultNotificationBody.defaultProps = {
  title: 'Notification',
  message: 'This is a test notification',
  vibrate: true,
  isOpen: false,
  onPress: () => null,
  onClose: () => null,
};

export default DefaultNotificationBody;

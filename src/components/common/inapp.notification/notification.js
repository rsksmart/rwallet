import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Image } from 'react-native';

// eslint-disable-next-line import/no-unresolved
import DefaultNotificationBody from './DefaultNotificationBody';
import screenHelper from '../../../common/screenHelper';
import color from '../../../assets/styles/color.ts';

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    width: '100%',
  },
});

class Notification extends Component {
  constructor() {
    super();
    this.heightOffset = screenHelper.topHeight;
    this.state = {
      animatedValue: new Animated.Value(0),
      isOpen: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isVisiable, notification, resetInAppNotification } = nextProps;
    const { isVisiable: lastIsVisiable } = this.props;
    if (isVisiable !== lastIsVisiable && isVisiable) {
      // Received a new notification
      this.notification = notification;
      const { title, body: message } = notification;
      this.show({ title, message });
      resetInAppNotification();
    }
  }

  show = (
    {
      title, message, icon, vibrate, additionalProps,
    } = {
      title: '',
      message: '',
      icon: null,
      vibrate: true,
      additionalProps: {},
    },
  ) => {
    const { closeInterval } = this.props;
    const { isOpen } = this.state;

    // Clear any currently showing notification timeouts so the new one doesn't get prematurely
    // closed
    clearTimeout(this.currentNotificationInterval);

    // If notification bar is opened,
    // close old notification bar, show new notification bar

    const showNotificationWithStateChanges = () => {
      this.setState({
        isOpen: true,
        title,
        message,
        icon,
        vibrate,
        additionalProps,
      },
      () => this.showNotification(() => {
        this.currentNotificationInterval = setTimeout(() => {
          this.setState({
            isOpen: false,
            title: '',
            message: '',
            icon: null,
            vibrate: true,
            additionalProps,
          },
          this.closeNotification);
        }, closeInterval);
      }));
    };

    if (isOpen) {
      this.setState({ isOpen: false }, () => {
        this.closeNotification(showNotificationWithStateChanges);
      });
    } else {
      showNotificationWithStateChanges();
    }
  }

  showNotification = (done) => {
    const { animatedValue } = this.state;
    const { openCloseDuration } = this.props;
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: openCloseDuration,
    }).start(done);
  }

  closeNotification = (done) => {
    const { animatedValue } = this.state;
    const { openCloseDuration } = this.props;
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: openCloseDuration,
    }).start(done);
  }

  render() {
    const {
      height: baseHeight, topOffset, backgroundColour, iconApp, notificationBodyComponent: NotificationBody,
    } = this.props;
    const { notification } = this;

    const {
      animatedValue, title, message, isOpen, icon, vibrate, additionalProps,
    } = this.state;

    const height = baseHeight + this.heightOffset;
    const onPress = notification && notification.onPress ? notification.onPress : null;

    return (
      <Animated.View
        style={[
          styles.notification,
          { height, backgroundColor: backgroundColour },
          {
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-height + topOffset, 0],
                }),
              },
            ],
          },
        ]}
      >
        <NotificationBody
          title={title}
          message={message}
          onPress={onPress}
          isOpen={isOpen}
          iconApp={iconApp}
          icon={icon}
          vibrate={vibrate}
          onClose={() => this.setState({ isOpen: false }, this.closeNotification)}
          additionalProps={additionalProps}
        />
      </Animated.View>
    );
  }
}

Notification.propTypes = {
  closeInterval: PropTypes.number,
  openCloseDuration: PropTypes.number,
  height: PropTypes.number,
  topOffset: PropTypes.number,
  backgroundColour: PropTypes.string,
  notificationBodyComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  iconApp: Image.propTypes.source,
  isVisiable: PropTypes.bool,
  notification: PropTypes.shape({
    onPress: PropTypes.func,
    title: PropTypes.string,
    body: PropTypes.string,
  }),
  resetInAppNotification: PropTypes.func.isRequired,
};

Notification.defaultProps = {
  closeInterval: 4000,
  openCloseDuration: 200,
  height: 80,
  topOffset: 0,
  backgroundColour: color.white,
  notificationBodyComponent: DefaultNotificationBody,
  iconApp: null,
  isVisiable: false,
  notification: undefined,
};

export default Notification;

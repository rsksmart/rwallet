import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Image } from 'react-native';

import NotificationBar from './notification.bar';
import screenHelper from '../../../common/screenHelper';
import color from '../../../assets/styles/color.ts';
import { DEVICE } from '../../../common/info';

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    width: '100%',
  },
});

export const createErrorInAppNotification = (title, body) => ({ type: 'error', title, body });

class Notification extends Component {
  constructor() {
    super();
    this.heightOffset = 0;
    if (DEVICE.ios) {
      this.heightOffset = DEVICE.isIphoneX ? screenHelper.iphoneXTopHeight + 7 : 15;
    }
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
      const { title, body: message, type } = notification;
      this.show({ title, message, type });
      resetInAppNotification();
    }
  }

  show = (
    {
      title, message, type, icon, vibrate, additionalProps,
    } = {
      title: '',
      message: '',
      type: undefined,
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
        type,
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
            type: undefined,
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


  onPressed = () => {
    const { processNotification } = this.props;
    const { notification } = this;
    processNotification(notification);
  }

  render() {
    const {
      height: baseHeight, topOffset, backgroundColour, iconApp, notificationBodyComponent: NotificationBody,
    } = this.props;

    const {
      animatedValue, title, message, type, isOpen, icon, vibrate, additionalProps,
    } = this.state;

    const height = baseHeight + this.heightOffset;

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
          type={type}
          onPress={this.onPressed}
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
    title: PropTypes.string,
    body: PropTypes.string,
    type: PropTypes.string,
  }),
  resetInAppNotification: PropTypes.func.isRequired,
  processNotification: PropTypes.func.isRequired,
};

Notification.defaultProps = {
  closeInterval: 4000,
  openCloseDuration: 200,
  height: 69,
  topOffset: 0,
  backgroundColour: color.white,
  notificationBodyComponent: NotificationBar,
  iconApp: null,
  isVisiable: false,
  notification: undefined,
};

export default Notification;

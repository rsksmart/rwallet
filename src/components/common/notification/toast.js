import React, { Component } from 'react';
import {
  View, Text, Animated, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  animatedToastViewContainer: {
    width: '100%',
    zIndex: 9999,
    position: 'absolute',
  },

  animatedToastView: {
    marginHorizontal: 30,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },

  toastText: {
    fontSize: 15,
    alignSelf: 'stretch',
    textAlign: 'center',
    backgroundColor: color.transparent,
  },
});

class Toast extends Component {
  constructor() {
    super();

    this.animateTranslate = new Animated.Value(-10);
    this.animateOpacity = new Animated.Value(0);
    this.state = { renderToast: false };
    this.isShownToast = false;
    this.message = '';
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearTimeout(this.timerID);
    }
  }

  hideToast(duration) {
    this.timerID = setTimeout(() => {
      Animated.parallel([
        Animated.timing(
          this.animateTranslate,
          {
            toValue: 10,
            duration: 350,
          },
        ),

        Animated.timing(
          this.animateOpacity,
          {
            toValue: 0,
            duration: 350,
          },
        ),
      ]).start(() => {
        this.setState({ renderToast: false });
        this.animateTranslate.setValue(-10);
        this.isShownToast = false;
        clearTimeout(this.timerID);
      });
    }, duration);
  }

  showToast(message = 'Custom Toast...', duration = 1000) {
    if (this.isShownToast === false) {
      this.message = message;

      this.isShownToast = true;

      this.setState({ renderToast: true }, () => {
        Animated.parallel([
          Animated.timing(
            this.animateTranslate,
            {
              toValue: 0,
              duration: 350,
            },
          ),

          Animated.timing(
            this.animateOpacity,
            {
              toValue: 1,
              duration: 350,
            },
          ),
        ]).start(this.hideToast(duration));
      });
    }
  }

  render() {
    const {
      position, backgroundColor, textColor, orientation,
    } = this.props;
    const { renderToast } = this.state;
    if (renderToast) {
      return (
        <Animated.View
          style={[
            styles.animatedToastViewContainer,
            {
              top: (position === 'top') ? '10%' : '80%',
              transform: [orientation === 'yAxis' ? {
                translateY: this.animateTranslate,
              } : {
                translateX: this.animateTranslate,
              }],
              opacity: this.animateOpacity,
            }]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.animatedToastView,
              { backgroundColor },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[styles.toastText, { color: textColor }]}
            >
              { this.message }
            </Text>
          </View>
        </Animated.View>
      );
    }

    return null;
  }
}

Toast.propTypes = {
  backgroundColor: PropTypes.string,
  position: PropTypes.oneOf([
    'top',
    'bottom',
  ]),
  textColor: PropTypes.string,
  orientation: PropTypes.string,
};

Toast.defaultProps = {
  backgroundColor: color.doveGray,
  textColor: 'white',
  orientation: 'xAxis',
  position: 'top',
};

module.exports = Toast;

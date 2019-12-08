/* eslint-disable */
import React, { Component } from 'react';
import {
  View, PanResponder, Animated, NativeModules,
} from 'react-native';
import PropTypes from 'prop-types';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental
&& UIManager.setLayoutAnimationEnabledExperimental(true);

class ConfirmSlider extends Component { // eslint-disable-line no-unused-expressions
  constructor(props) {
    super(props);

    this.reset = this.reset.bind(this);

    this.state = {
      drag: new Animated.ValueXY(),
      buttonOpacity: new Animated.Value(1),
      confirm: false,
      percent: 0,
      dimensions: { width: 0, height: 0 },
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // eslint-disable-next-line no-underscore-dangle
        const positionXY = this.state.drag.__getValue();
        this.state.drag.setOffset(positionXY);
        this.state.drag.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: this.state.drag.x }], {
        // limit sliding out of box
        listener: (event, gestureState) => {
          const { buttonSize } = this.props;

          const {
            drag,
            confirm,
            dimensions: { width },
          } = this.state;
          const maxMoving = width - buttonSize;

          let toX = gestureState.dx;

          if (toX < 0) toX = 0;
          if (toX > maxMoving) toX = maxMoving;
          const percent = ((toX * 100) / maxMoving).toFixed();
          this.setState({ percent });

          if (confirm) {
            drag.setValue({ x: 0, y: 0 });
            return;
          }
          drag.setValue({ x: toX, y: 0 });
        },
      }),
      onPanResponderRelease: () => {
        if (this.state.confirm) return;
        if (this.state.percent >= 100) {
          this.setState({ confirm: true });
          this.props.onConfirmed(); // communicate that the verification was successful

          const { visible, duration } = this.props.okButton;
          if (!visible) {
            this.toggleShowAnimation(false, duration);
          }
        } else if (!this.state.confirm) {
          this.reset();
        }
      },
      onPanResponderTerminate: () => {
      },
    });
  }

  reset() {
    this.state.drag.setOffset({ x: 0, y: 0 });
    Animated.timing(this.state.drag, {
      toValue: { x: 0, y: 0 },
      duration: 800,
    }).start();
    this.toggleShowAnimation(true, this.props.okButton.duration);
    this.toggleShowAnimation(true, this.props.okButton.duration);
    this.setState({ confirm: false, percent: 0 });
  }

  toggleShowAnimation(visible, duration) {
    Animated.timing(
        // Animate over time
        this.state.buttonOpacity, // The animated value to drive
        {
          toValue: visible ? 1 : 0, // Animate to opacity: 1 (opaque)
          duration, // Make it take a while
        },
    ).start();
  }

  render() {
    const {
      buttonColor,
      buttonSize,
      borderColor,
      backgroundColor,
      icon,
      borderRadius,
      children,
    } = this.props;
    const { buttonOpacity } = this.state;

    const position = { transform: this.state.drag.getTranslateTransform() };

    return (
        <View style={{
          borderColor,
          borderWidth: 2,
          borderRadius: borderRadius + 5,
          padding: 2,
          flex: 1,
          height: buttonSize + 10,
        }}
        >
          <View
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                this.setState({
                  dimensions: { width, height },
                });
              }}
              style={{
                backgroundColor,
                height: buttonSize,
                borderRadius,
                justifyContent: 'center',
              }}
          >
            {children && (
                <View style={[{ position: 'absolute', alignSelf: 'center' }]}>
                  {children}
                </View>
            )}

            // eslint-disable-next-line jsx-props-no-spreading
            <Animated.View
                {...this.panResponder.panHandlers}
                style={[position, {
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius,
                  backgroundColor: buttonColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: buttonOpacity,
                }]}
            >
              {icon}
            </Animated.View>
          </View>
        </View>
    );
  }
}

ConfirmSlider.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
};

export default ConfirmSlider;
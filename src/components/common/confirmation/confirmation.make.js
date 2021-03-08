import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Animated,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import color from '../../../assets/styles/color';

const ICON_SQUARE_SIZE = 100;
const ANIMATION_DURATION_MS = 150;
const CONFIRMATION_HEIGHT = 100;

const styles = StyleSheet.create({
  mainContainer: {
    width: 270,
    height: '100%',
    padding: 10,
    overflow: 'hidden',
    borderRadius: 7,
    shadowColor: color.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    elevation: 10,
  },
  icon: {
    position: 'absolute',
    right: -ICON_SQUARE_SIZE / 5,
    bottom: -ICON_SQUARE_SIZE / 5,
    opacity: 0.2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    fontSize: 15,
  },
});

const makeConfirmation = (iconName, colorPrimary, colorAccent) => {
  function ConfirmationBase(props) {
    const { title, message, onClosePress } = props;
    const [animated] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
      Animated.timing(animated, {
        toValue: 1,
        duration: ANIMATION_DURATION_MS,
      }).start();
    }, []);

    return (
      <TouchableOpacity
        onPress={() => {
          if (onClosePress) {
            Animated.timing(animated, {
              toValue: 0,
              duration: ANIMATION_DURATION_MS,
            }).start(onClosePress);
          }
        }}
      >
        <Animated.View
          style={[
            {
              opacity: animated,
              height: animated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, CONFIRMATION_HEIGHT],
                extrapolate: 'clamp',
              }),
              transform: [
                {
                  translateX: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[styles.mainContainer, { backgroundColor: colorPrimary }]}
          >
            <FontAwesome
              style={styles.icon}
              name={iconName}
              size={ICON_SQUARE_SIZE}
              color={colorAccent}
            />
            <Text style={[styles.title, { color: colorAccent }]}>{title}</Text>
            <Text style={[styles.message, { color: colorAccent }]}>
              {message}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  ConfirmationBase.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onClosePress: PropTypes.func.isRequired,
  };

  return ConfirmationBase;
};

export default makeConfirmation;

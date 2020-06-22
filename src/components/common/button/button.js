import React from 'react';
import {
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color.ts';
import Loc from '../misc/loc';

const styles = StyleSheet.create({
  button: {
    width: 260,
    backgroundColor: color.component.button.backgroundColor,
    borderRadius: 27,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    color: color.component.button.color,
    fontSize: 16,
    fontFamily: 'Avenir-Black',
    fontWeight: '900',
  },
});

export default function Button({
  text, onPress, disabled, style,
}) {
  return (
    <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
      <View style={disabled ? [styles.button, styles.btnDisabled] : styles.button}>
        <Loc style={[styles.buttonText]} text={text} />
      </View>
    </TouchableOpacity>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Button.defaultProps = {
  disabled: false,
  style: null,
  onPress: () => null,
};

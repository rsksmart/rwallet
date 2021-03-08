import React from 'react';
import {
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color';
import fontFamily from '../../../assets/styles/font.family';
import Loc from '../misc/loc';

const styles = StyleSheet.create({
  button: {
    width: 260,
    backgroundColor: color.component.button.backgroundColor,
    borderRadius: 27,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    color: color.component.button.color,
    fontSize: 16,
    fontFamily: fontFamily.AvenirBlack,
    fontWeight: '900',
  },
  cancelButton: {
    backgroundColor: color.white,
    borderWidth: 2,
    padding: 13,
    borderColor: color.component.button.backgroundColor,
  },
  cancelText: {
    color: color.component.button.backgroundColor,
  },
});

export default function Button({
  text, onPress, disabled, style, type,
}) {
  const buttonStyles = [styles.button];
  if (disabled) {
    buttonStyles.push(styles.btnDisabled);
  }
  if (type === 'cancel') {
    buttonStyles.push(styles.cancelButton);
  }
  return (
    <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
      <View style={buttonStyles}>
        <Loc style={[styles.buttonText, type === 'cancel' ? styles.cancelText : null]} text={text} />
      </View>
    </TouchableOpacity>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  type: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  style: null,
  type: null,
  onPress: () => null,
};

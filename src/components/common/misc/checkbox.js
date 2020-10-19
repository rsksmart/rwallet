import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color';
import fontFamily from '../../../assets/styles/font.family';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: color.app.theme,
    fontFamily: fontFamily.AvenirBook,
    marginLeft: 5,
    fontSize: 14,
  },
  box: {
    color: color.app.theme,
  },
});

export default function Checkbox({
  isChecked, text, onValueChanged, style,
}) {
  const icon = isChecked ? 'check-square' : 'square';
  return (
    <TouchableOpacity style={[styles.row, style]} onPress={() => onValueChanged(!isChecked)}>
      <Feather style={styles.box} name={icon} size={20} />
      <Text style={[styles.text]}>{text}</Text>
    </TouchableOpacity>
  );
}

Checkbox.propTypes = {
  isChecked: PropTypes.bool,
  text: PropTypes.string,
  onValueChanged: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Checkbox.defaultProps = {
  isChecked: false,
  text: undefined,
  onValueChanged: () => null,
  style: undefined,
};

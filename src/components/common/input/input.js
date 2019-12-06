import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color.ts';

const styles = StyleSheet.create({
  textInput: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10,
  },
});

export default function Input({
  style, placeholder, onChangeText, onSubmitEditing, value, editable,
}) {
  return (
    <TextInput
      style={[styles.textInput, style]}
      onChangeText={onChangeText}
      placeholder={placeholder}
      onSubmitEditing={onSubmitEditing}
      value={value}
      editable={editable}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}

Input.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.arrayOf(PropTypes.shape({})),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  editable: PropTypes.bool,
};

Input.defaultProps = {
  style: null,
  placeholder: null,
  value: null,
  onSubmitEditing: null,
  onChangeText: null,
  editable: true,
};

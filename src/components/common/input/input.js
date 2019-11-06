import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import color from '../../../assets/styles/color';

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

export default function Input({ style, placeholder, onChangeText, onSubmitEditing, value }) {
  return (
    <TextInput
      style={[styles.textInput, style]} onChangeText={onChangeText}
      placeholder={placeholder} onSubmitEditing={onSubmitEditing} value={value}
    />
  );
}

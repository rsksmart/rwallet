import React from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  button: {
    width: 260,
    alignItems: 'center',
    backgroundColor: color.component.button.backgroundColor,
    borderRadius: 27,
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: color.component.button.color,
    fontSize: 16,
    fontFamily: 'Avenir Black',
    fontWeight: '900',
  },
});

export default function Button({ text, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

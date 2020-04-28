import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color.ts';
import DashLine from './dashLine';

export const wordFieldWidth = 163;

const styles = StyleSheet.create({
  frame: {
    borderColor: '#00B520',
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    width: wordFieldWidth,
    height: 107,
  },
  textView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dashView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingTop: 40,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: '70%',
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    fontSize: 21,
    color: color.word,
  },
});

export default function WordField({ text }) {
  return (
    <View style={styles.frame}>
      <View style={styles.dashView}>
        <DashLine />
      </View>
      <View style={styles.textView}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

WordField.propTypes = {
  text: PropTypes.string.isRequired,
};

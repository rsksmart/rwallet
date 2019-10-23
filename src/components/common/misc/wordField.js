import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import color from '../../../assets/styles/color';
import DashLine from './dashLine';

const styles = StyleSheet.create({
  frame: {
    borderColor: '#00B520',
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    width: 163,
    height: 107,
  },
  textView: {
    flex: 1,
    flexDirection: 'row',
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
    paddingTop: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: '70%',
    textAlign: 'center',
  },
});

export default function WordField({ text }) {
  return (
    <View style={styles.frame}>
      <View style={styles.dashView}>
        <DashLine width={100} />
      </View>
      <View style={styles.textView}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

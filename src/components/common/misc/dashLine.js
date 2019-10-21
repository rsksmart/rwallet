import React from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  dashLine: {
    flexDirection: 'row',
  },
  dashItem: {
    height: 1,
    width: 2,
    marginRight: 2,
    backgroundColor: color.component.dashLine.backgroundColor,
  },
});

export default function DashLine({ width }) {
  const len = Math.ceil(width / 4);
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push(i);
  }
  return (
    <View>
      <View style={styles.dashLine}>
        {arr.map(() => <Text style={styles.dashItem} key={Math.random()}> </Text>)}
      </View>
    </View>
  );
}

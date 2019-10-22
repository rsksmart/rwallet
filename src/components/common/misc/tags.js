import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    backgroundColor: color.component.tags.backgroundColor,
    marginLeft: 10,
    padding: 5,
    color: color.component.tags.color,
    borderRadius: 2,
    marginTop: 10,
  },
});

export default function Tags({ data }) {
  const { length } = data;
  const res = [];
  for (let i = 0; i < length; i += 1) {
    res.push(
      <Text style={styles.item} key={i}>
        {i + 1}
)
        {' '}
        {data[i]}
      </Text>,
    );
  }
  return (
    <View style={styles.tags}>
      {res}
    </View>
  );
}

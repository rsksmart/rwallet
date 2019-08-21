import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';

const styles = StyleSheet.create({
  border: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
});

const borderView = () => (
  <View style={styles.border} />
);

export default borderView;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  tag: {
    width: 60,
    height: 23,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.vividBlue,
  },
  tagText: {
    color: color.white,
    fontSize: 12,
  },
  testnet: {
    backgroundColor: color.dustyGray,
  },
});

const TypeTag = ({ type }) => (
  <View style={[styles.tag, type === 'Testnet' ? styles.testnet : null]}>
    <Text style={styles.tagText}>{type}</Text>
  </View>
);

TypeTag.propTypes = {
  type: PropTypes.string,
};

TypeTag.defaultProps = {
  type: 'Mainnet',
};

export default TypeTag;

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'native-base';
import { PropTypes } from 'prop-types';

const styles = StyleSheet.create({
  text: {
    color: '#7D7C7F',
    padding: 5,
    fontSize: 12,
  },
});

const label = props => (
  <Text style={styles.text}>{props.children}</Text>
);

label.propTypes = {
  children: PropTypes.string,
};

label.defaultProps = {
  children: '',
};

export default label;

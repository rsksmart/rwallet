import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
  },
});

const LoadingBar = ({ color, percent, height }) => {
  const style = {
    backgroundColor: color,
    width: `${percent * 100}%`,
    height,
  };
  return <View style={[styles.container, style]} />;
};

LoadingBar.propTypes = {
  color: PropTypes.string,
  percent: PropTypes.number,
  height: PropTypes.number,
};


LoadingBar.defaultProps = {
  color: undefined,
  percent: undefined,
  height: undefined,
};


export default LoadingBar;

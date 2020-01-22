import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import screenHelper from '../../../common/screenHelper';
import flex from '../../../assets/styles/layout.flex';

const styles = StyleSheet.create({
  view: {
    paddingTop: screenHelper.TopHeight,
    paddingBottom: screenHelper.bottomHeight,
  },
});

const SafeAreaView = ({ children, style }) => (
  <View style={[flex.flex1, styles.view]}>
    <View style={[flex.flex1, style]}>{children}</View>
  </View>
);

SafeAreaView.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

SafeAreaView.defaultProps = {
  children: null,
  style: null,
};

export default SafeAreaView;

import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { DEVICE } from './info';

const screenHelper = {
  iphoneXExtendedHeight: 24,
  headerHeight: 350,
};

screenHelper.headerMarginTop = DEVICE.isIphoneX ? -150 + screenHelper.iphoneXExtendedHeight : -150;
screenHelper.bodyMarginTop = screenHelper.headerHeight + screenHelper.headerMarginTop;
screenHelper.styles = StyleSheet.create({
  body: {
    marginTop: screenHelper.bodyMarginTop,
  },
});

screenHelper.Body = (props) => {
  const { children } = props;
  return (
    <View style={screenHelper.styles.body}>
      {children}
    </View>
  );
};

screenHelper.Body.propTypes = {
  children: PropTypes.element,
};

screenHelper.Body.defaultProps = {
  children: null,
};

export default screenHelper;

import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { DEVICE } from './info';

const screenHelper = {
  iphoneXTopHeight: 24,
  iphoneXBottomHeight: 22,
  headerHeight: 350,
};

screenHelper.headerMarginTop = DEVICE.isIphoneX ? -150 + screenHelper.iphoneXTopHeight : -150;
screenHelper.bodyMarginTop = screenHelper.headerHeight + screenHelper.headerMarginTop;
screenHelper.bottomHeight = DEVICE.isIphoneX ? screenHelper.iphoneXBottomHeight : 0;
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

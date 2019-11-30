import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { DEVICE } from './info';

const o = {
  headerHeight: 350,
  headerMarginTop: DEVICE.isIphoneX ? -150 + 24 : -150,
};

o.bodyMarginTop = o.headerHeight + o.headerMarginTop;
o.styles = StyleSheet.create({
  body: {
    marginTop: o.bodyMarginTop,
  },
});

o.Body = (props) => {
  const { children } = props;
  return (
    <View style={o.styles.body}>
      {children}
    </View>
  );
};

o.Body.propTypes = {
  children: PropTypes.element,
};

o.Body.defaultProps = {
  children: null,
};

export default o;

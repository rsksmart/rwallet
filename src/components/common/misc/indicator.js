import React from 'react';
import PropTypes from 'prop-types';
import { UIActivityIndicator } from 'react-native-indicators';

const Indicator = ({ visible, style }) => {
  if (!visible) {
    return null;
  }
  return <UIActivityIndicator style={style} size={30} />;
};

Indicator.propTypes = {
  visible: PropTypes.bool.isRequired,
  style: PropTypes.arrayOf(PropTypes.shape({})),
};

Indicator.defaultProps = {
  style: [],
};

export default Indicator;

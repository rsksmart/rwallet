import React from 'react';
import PropTypes from 'prop-types';
import { UIActivityIndicator } from 'react-native-indicators';

const Indicator = ({ visible }) => {
  if (!visible) {
    return null;
  }
  return <UIActivityIndicator color="black" />;
};

Indicator.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default Indicator;

import React from 'react';
import {
  Switch as RNSwitch, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color.ts';

export default function Switch({
  value, onValueChange, style, disabled,
}) {
  return (
    <RNSwitch
      trackColor={Platform.OS === 'ios' ? { false: 'gray', true: color.app.theme } : {}}
      value={value}
      onValueChange={onValueChange}
      style={style}
      disabled={disabled}
    />
  );
}

Switch.propTypes = {
  value: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabled: PropTypes.bool,
};

Switch.defaultProps = {
  style: null,
  disabled: false,
};

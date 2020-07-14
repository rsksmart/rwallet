import React from 'react';
import {
  Switch as RNSwitch, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color.ts';

export default function Switch(props) {
  const {
    style, value, onValueChange, disabled,
  } = props;
  return (
    <RNSwitch
      trackColor={Platform.OS === 'ios' ? { false: 'gray', true: color.app.theme } : {}}
      style={style}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    />
  );
}

Switch.propTypes = {
  style: PropTypes.shape({}),
  value: PropTypes.bool,
  onValueChange: PropTypes.func,
  disabled: PropTypes.bool,
};

Switch.defaultProps = {
  style: undefined,
  value: false,
  onValueChange: () => {},
  disabled: false,
};

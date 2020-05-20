import React from 'react';
import {
  Switch as RNSwitch, Platform,
} from 'react-native';
import color from '../../../assets/styles/color.ts';

export default function Switch(props) {
  return (
    <RNSwitch
      trackColor={Platform.OS === 'ios' ? { false: 'gray', true: color.app.theme } : {}}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

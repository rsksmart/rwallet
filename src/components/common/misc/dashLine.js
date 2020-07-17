import React from 'react';
import Dash from 'react-native-dash';
import color from '../../../assets/styles/color';

export default function DashLine() {
  return (
    <Dash
      style={{ width: 100 }}
      dashColor={color.component.dashLine.backgroundColor}
      dashGap={5}
      dashLength={10}
      dashThickness={1}
    />
  );
}

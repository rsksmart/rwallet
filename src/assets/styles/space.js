import { StyleSheet } from 'react-native';
import { screen } from '../../common/info';

export function fWidthPer(iPerValue) {
  return (screen.width * iPerValue) / 100;
}

export function fHeightPer(iPerValue) {
  return (screen.height * iPerValue) / 100;
}

function styleScript() {
  const style = {};
  const items = [
    'width', 'height',
    'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginStart', 'marginEnd', 'marginHorizontal', 'marginVertical',
    'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingStart', 'paddingEnd', 'paddingHorizontal', 'paddingVertical',
    'left', 'right', 'top', 'bottom',
  ];

  for (let i = 0; i < 500; i += 1) {
    items.forEach((value) => {
      const styleItem = {};
      styleItem[value] = i;
      style[`${value}_${i}`] = styleItem;
    });
  }
  return style;
}

const space = StyleSheet.create({

  width_0: {},
  height_0: {},
  margin_0: {},
  marginTop_0: {},
  marginBottom_0: {},
  marginLeft_0: {},
  marginRight_0: {},
  marginStart_0: {},
  marginEnd_0: {},
  marginHorizontal_0: {},
  marginVertical_0: {},
  padding_0: {},
  paddingTop_0: {},
  paddingBottom_0: {},
  paddingLeft_0: {},
  paddingRight_0: {},
  paddingStart_0: {},
  paddingEnd_0: {},
  paddingHorizontal_0: {},
  paddingVertical_0: {},
  left_0: {},
  right_0: {},
  top_0: {},
  bottom_0: {},
  TLRB_0: {
    left: 0, top: 0, bottom: 0, right: 0,
  },
  // end
  width_height_15: {
    width: 15,
    height: 15,
  },
  width_height_21: {
    width: 21,
    height: 21,
  },
  width_height_24: {
    width: 24,
    height: 24,
  },
  width_height_32: {
    width: 32,
    height: 32,
  },
  width_height_37: {
    width: 37,
    height: 37,
  },
  width_height_49: {
    width: 49,
    height: 49,
  },

  ...styleScript(),
});

export default space;

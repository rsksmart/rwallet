import { StyleSheet } from 'react-native';

import color from './color';

const style = StyleSheet.create({
  border: {
    borderStyle: 'solid',
    borderColor: color.black,
    borderWidth: 1,
  },
  borderRadiusFull: {
    borderRadius: 9999,
  },
  topLine: {
    borderStyle: 'solid',
    borderColor: color.app.naviLine,
    borderTopWidth: 1,
  },
  underLine: {
    borderStyle: 'solid',
    borderColor: color.app.naviLine,
    borderBottomWidth: 1,
  },
  underLineLG: { // light gray
    borderStyle: 'solid',
    borderColor: color.app.inputBg,
    borderBottomWidth: 1,
  },
  leftLine: {
    borderStyle: 'solid',
    borderColor: color.app.naviLine,
    borderLeftWidth: 1,
  },
  rightLine: {
    borderStyle: 'solid',
    borderColor: color.app.naviLine,
    borderRightWidth: 1,
  },
  overHidden: {
    overflow: 'hidden',
  },
  card: {
    borderStyle: 'solid',
    borderColor: color.alto,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: color.white,
  },
  textInput: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    color: 'black',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10,
  },
  lastBlockMarginBottom: {
    marginBottom: 15,
  },
  rskIcon: {
    width: 75,
    height: 47,
    marginLeft: -5,
    marginTop: -2,
  },
  listItemIndicator: {
    color: color.component.listItemIndicator.color,
  },
  board: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.alto,
    borderBottomWidth: 0,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: color.white,
  },
  noBottomBorder: {
    borderBottomColor: color.transparent,
  },
});

export default style;

import { StyleSheet } from 'react-native';

import color from './color';

const styles = StyleSheet.create({
  tag: {
    height: 23,
    borderRadius: 2,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.vividBlue,
    marginRight: 8,
  },
  tagText: {
    color: color.white,
    fontSize: 12,
  },
  testnet: {
    backgroundColor: color.dustyGray,
  },
});

export default styles;

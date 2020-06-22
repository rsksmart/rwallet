import { StyleSheet } from 'react-native';

import color from './color.ts';

const styles = StyleSheet.create({
  tag: {
    height: 23,
    borderRadius: 2,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#028CFF',
    marginRight: 8,
  },
  tagText: {
    color: color.white,
    fontSize: 12,
  },
  testnet: {
    backgroundColor: '#9b9b9b',
  },
});

export default styles;

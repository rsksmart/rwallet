import { StyleSheet } from 'react-native';
import color from './color';
import fontFamily from './font.family';

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  lineTitle: {
    color: color.black,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
  },
  lineValue: {
    color: color.dustyGray,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
    width: '60%',
    textAlign: 'right',
  },
  toAddressLink: {
    width: '60%',
    alignSelf: 'flex-end',
  },
  addressLineValue: {
    width: '100%',
    color: color.app.theme,
    fontSize: 13,
  },
});

export default styles;

import { StyleSheet } from 'react-native';
import color from './color';
import fontFamily from './font.family';

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.blackA50,
    justifyContent: 'center',
    flex: 1,
  },
  panel: {
    backgroundColor: color.white,
    borderRadius: 5,
    marginHorizontal: 25,
    maxHeight: '99%',
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  title: {
    fontSize: 17,
    color: color.black,
    fontFamily: fontFamily.AvenirHeavy,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: color.black,
    fontFamily: fontFamily.AvenirBook,
  },
  link: {
    fontSize: 14,
    color: color.app.theme,
    fontFamily: fontFamily.AvenirBook,
  },
  recommendButton: {
    justifyContent: 'center',
    height: 45,
    backgroundColor: color.app.theme,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
  },
  normalButton: {
    justifyContent: 'center',
    height: 45,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    borderColor: color.vividBlue,
    borderWidth: 1,
  },
  recommendButtonText: {
    color: color.concrete,
  },
  normalButtonText: {
    fontFamily: fontFamily.AvenirHeavy,
    color: color.vividBlue,
    fontSize: 16,
  },
  disabledButton: {
    borderColor: color.gray91,
  },
  disabledButtonText: {
    color: color.gray91,
  },
  buttonsView: {
    marginTop: 23,
    alignItems: 'center',
  },
});

export default styles;

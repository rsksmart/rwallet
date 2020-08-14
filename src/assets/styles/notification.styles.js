import { StyleSheet } from 'react-native';
import color from './color';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: color.black,
    marginTop: 22,
  },
  text: {
    color: color.codGray,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 30,
  },
  line: {
    borderBottomColor: color.gainsboro,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 15,
  },
  button: {
    color: color.app.theme,
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 15,
  },
  errorButtonText: {
    color: color.warningText,
  },
  backgroundBoard: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: color.blackA50,
  },
  frontBoard: {
    marginHorizontal: 25,
    backgroundColor: color.white,
    borderRadius: 5,
  },
});

export default styles;

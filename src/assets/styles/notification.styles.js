import { StyleSheet } from 'react-native';
import color from './color.ts';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginTop: 22,
  },
  text: {
    color: '#0B0B0B',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 30,
  },
  line: {
    borderBottomColor: '#DCDCDC',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  frontBoard: {
    marginHorizontal: 25,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

export default styles;

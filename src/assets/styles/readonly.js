import { StyleSheet } from 'react-native';
import color from './color';

const styles = StyleSheet.create({
  title: {
    color: color.black,
    fontSize: 15,
    letterSpacing: 0.25,
    fontFamily: 'Avenir-Heavy',
    marginRight: 7,
  },
  titleRow: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 15,
  },
  noteRow: {
    marginBottom: 15,
  },
  questionRow: {
    marginTop: 5,
    marginBottom: 15,
    flexDirection: 'row',
  },
  buttonView: {
    alignSelf: 'center',
    paddingVertical: 15,
  },
  name: {
    marginTop: 17,
  },
  notice: {
    marginTop: 5,
    fontSize: 12,
    color: color.warningText,
    marginHorizontal: 5,
  },
  body: {
    marginHorizontal: 25,
  },
  questionIcon: {
    fontSize: 17,
  },
  addressText: {
    color: color.vividBlue,
    fontFamily: 'Avenir-Book',
    fontSize: 14,
  },
  chainType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
  },
  addCustomTokenView: {
    backgroundColor: color.whiteA50,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 24,
    flex: 1,
  },
  switchTitle: {
    flex: 1,
    marginBottom: 0,
  },
  errorText: {
    color: color.cinnabar,
    fontFamily: 'Avenir-Book',
    fontSize: 14,
  },
  addressInput: {
    height: 'auto',
    minHeight: 16,
    textAlignVertical: 'top',
    paddingBottom: 10,
    paddingTop: 10,
  },
});

export default styles;

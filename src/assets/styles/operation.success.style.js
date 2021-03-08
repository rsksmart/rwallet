import { StyleSheet, Dimensions } from 'react-native';

import { headerVisibleHeight } from '../../components/headers/header';

const bottomHeight = 70;
const contentHeight = Dimensions.get('window').height - headerVisibleHeight - bottomHeight;

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  check: {
    marginBottom: contentHeight * 0.068,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  centerView: {
    alignItems: 'center',
    marginTop: contentHeight * 0.14,
    width: '100%',
  },
  button: {
    marginBottom: contentHeight * 0.037,
  },
});

export default styles;

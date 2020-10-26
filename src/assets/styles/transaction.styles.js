import { StyleSheet } from 'react-native';
import color from './color';

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 25,
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: color.black,
    marginBottom: 10,
  },
  amount: {
    flex: 1,
  },
});

export default styles;

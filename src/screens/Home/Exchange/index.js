import { createStackNavigator } from 'react-navigation';
import ExchangeScreen from './ExchangeScreen';

export default createStackNavigator(
  {
    Exchange: ExchangeScreen,
  },
  {
    headerMode: 'none',
  },
);

import { createStackNavigator } from 'react-navigation-stack';
import ExchangeScreen from './ExchangeScreen';

export default createStackNavigator(
  {
    Exchange: ExchangeScreen,
  },
  {
    headerMode: 'none',
  },
);

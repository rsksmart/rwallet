import { createStackNavigator } from 'react-navigation';
import PortfolioScreen from './PortfolioScreen';

export default createStackNavigator(
  {
    Portfolio: PortfolioScreen,
  },
  {
    headerMode: 'none',
  },
);

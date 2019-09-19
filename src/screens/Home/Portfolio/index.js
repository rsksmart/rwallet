import { createStackNavigator } from 'react-navigation-stack';

import PortfolioScreen from './PortfolioScreen';

export default createStackNavigator(
  {
    Portfolio: PortfolioScreen,
  },
  {
    headerMode: 'none',
  },
);

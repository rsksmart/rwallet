import { createStackNavigator } from 'react-navigation-stack';

import SendScreen from './SendScreen';
import ConfirmationScreen from './ConfirmationScreen';

export default createStackNavigator(
  {
    Send: SendScreen,
    Confirmation: ConfirmationScreen,
  },
  {
    headerMode: 'none',
  },
);

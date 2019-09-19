import { createStackNavigator } from 'react-navigation-stack';
import CreatePinScreen from './CreatePinScreen';
import ConfirmPinScreen from './ConfirmPinScreen';


export default createStackNavigator(
  {
    CreatePinScreen,
    ConfirmPinScreen,
  },
  {
    headerMode: 'none',
  },
);

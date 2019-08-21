import { createStackNavigator } from 'react-navigation';
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

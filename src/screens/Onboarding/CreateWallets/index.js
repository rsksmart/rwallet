import { createStackNavigator } from 'react-navigation';
import SelectAssetScreen from './SelectAssetScreen';

export default createStackNavigator(
  {
    SelectAssetScreen,
  },
  {
    headerMode: 'none',
  },
);

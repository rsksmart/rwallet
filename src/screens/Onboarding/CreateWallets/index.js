import { createStackNavigator } from 'react-navigation-stack';
import SelectAssetScreen from './SelectAssetScreen';

export default createStackNavigator(
  {
    SelectAssetScreen,
  },
  {
    headerMode: 'none',
  },
);

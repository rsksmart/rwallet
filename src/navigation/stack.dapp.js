import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { defaultNavigationOptions, routeConfigMaps } from '../common/navigation.config';

const StackNavigator = createStackNavigator(
  { ...routeConfigMaps },
  {
    initialRouteName: 'DAppIndex',
    defaultNavigationOptions: defaultNavigationOptions(),
  },
);

const Container = createAppContainer(StackNavigator);

Container.navigationOptions = (props) => {
  let tabBarVisible = true;
  if (props.navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export default Container;

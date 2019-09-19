import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { View } from 'react-native';
import FabButton from 'mellowallet/src/components/FabButton';

import ExchangeNavigator from './Exchange';
import MainFooter from './MainFooter';
import PortfolioNavigator from './Portfolio';
import WalletsScreen from './Wallets/WalletsScreen';
import HistoryScreen from './History/HistoryScreen';
import SettingsScreen from './Settings/SettingsScreen';

const Navigator = createBottomTabNavigator(
  {
    Wallets: WalletsScreen,
    Exchange: ExchangeNavigator,
    Portfolio: PortfolioNavigator,
    History: HistoryScreen,
    Settings: SettingsScreen,
  },
  {
    animationEnabled: true,
    tabBarComponent: ({ screenProps, ...props }) => (
      <MainFooter navigation={props.navigation} />
    ),
  },
);

class MainNavigator extends React.Component {
  static router = Navigator.router;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Navigator navigation={this.props.navigation} />
        <FabButton />
      </View>
    );
  }
}

export default MainNavigator;

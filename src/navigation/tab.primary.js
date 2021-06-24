import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeStackNavigator from './stack.home';
import MineStackNavigator from './stack.mine';
import DAppStackNavigator from './stack.dapp';
import TabBar from './components/bottom.tab';
import color from '../assets/styles/color';

import homeLight from '../assets/images/root/tab/wallet.l.png';
import MineLight from '../assets/images/root/tab/mine.l.png';
import spendLight from '../assets/images/root/tab/spend.l.png';
import dappLight from '../assets/images/root/tab/dapp.l.png';

const styles = StyleSheet.create({
  tabBarView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const PrimaryTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStackNavigator,
      path: 'home',
      navigationOptions: {
        title: 'root.Wallet',
      },
    },
    DApp: {
      screen: DAppStackNavigator,
      path: 'dapp',
      navigationOptions: {
        title: 'root.DApp',
      },
    },
    Mine: {
      screen: MineStackNavigator,
      path: 'mine',
      navigationOptions: {
        title: 'root.Me',
      },
    },
  },
  {
    tabBarComponent: (properties) => {
      const {
        renderIcon, getLabelText, activeTintColor, inactiveTintColor,
        onTabPress, onTabLongPress, getAccessibilityLabel, navigation,
      } = properties;
      return (
        <View style={styles.tabBarView}>
          <TabBar
            renderIcon={renderIcon}
            getLabelText={getLabelText}
            activeTintColor={activeTintColor}
            inactiveTintColor={inactiveTintColor}
            onTabPress={onTabPress}
            onTabLongPress={onTabLongPress}
            getAccessibilityLabel={getAccessibilityLabel}
            navigation={navigation}
          />
        </View>
      );
    },
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: (properties) => {
        const { focused } = properties;
        let img = null;
        let width = 18;
        let height = 18;
        switch (navigation.state.routeName) {
          case 'Home':
            img = homeLight;
            break;
          case 'Mine':
            width = 22;
            height = 22;
            img = MineLight;
            break;
          case 'Exchange':
            img = spendLight;
            break;
          case 'DApp':
            img = dappLight;
            break;
          default:
            console.error(`unexpected tab：${navigation.state.routeName}`);
        }
        let opacity = 1;
        if (!focused) {
          opacity = 0.6;
        }

        return (
          <View>
            <Image
              source={img}
              style={{
                width, height, opacity, marginBottom: 7,
              }}
            />
          </View>
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: color.ceriseRed,
      inactiveTintColor: color.gray,
    },
  },
);

export default PrimaryTabNavigator;

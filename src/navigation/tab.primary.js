import React from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import HomeStackNavigator from './stack.home';
import MineStackNavigator from './stack.mine';
import ExchangeStackNavigator from './stack.exchange';
import DAppStackNavigator from './stack.dapp';
import TabBar from './components/bottom.tab';
import color from '../assets/styles/color';

import homeLight from '../assets/images/root/tab/wallet.l.png';
import MineLight from '../assets/images/root/tab/mine.l.png';
import spendLight from '../assets/images/root/tab/spend.l.png';
import dappLight from '../assets/images/root/tab/dapp.l.png';

const PrimaryTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStackNavigator,
      path: 'home',
      navigationOptions: {
        title: 'root.Wallet',
      },
    },
    Exchange: {
      screen: ExchangeStackNavigator,
      path: 'exchange',
      navigationOptions: {
        title: 'root.Exchange',
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
    tabBarComponent: (props) => (
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
      }}
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <TabBar {...props} />
      </View>
    ),
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
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
      activeTintColor: color.ceriseRed, // 激活颜色
      inactiveTintColor: color.gray, // 未激活颜色,
    },
  },
);

export default PrimaryTabNavigator;

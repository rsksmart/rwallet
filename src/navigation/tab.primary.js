import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import HomeStackNavigator from './stack.home';
import MineStackNavigator from './stack.mine';
import ExchangeStackNavigator from './stack.exchange';
import DAppStackNavigator from './stack.dapp';
import topNavigator from './top.navigator';
import flex from '../assets/styles/layout.flex';
import TabBar from './components/bottom.tab';

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
      activeTintColor: '#df394d', // 激活颜色
      inactiveTintColor: 'gray', // 未激活颜色,
    },
  },
);

const PrimaryTabNavigatorContainer = createAppContainer(PrimaryTabNavigator);

export default class PrimaryTabNavigatorComp extends Component {
  static router = null;

  render() {
    return (
      <View style={[flex.flex1]}>
        <PrimaryTabNavigatorContainer
          ref={(navigatorRef) => {
            topNavigator.setTopLevelNavigator(navigatorRef);
          }}
        />
      </View>
    );
  }
}

PrimaryTabNavigatorComp.router = PrimaryTabNavigatorContainer.router;

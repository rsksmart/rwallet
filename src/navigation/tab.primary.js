import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import HomeStackNavigator from './stack.home';
import MineStackNavigator from './stack.mine';
import SpendStackNavigator from './stack.spend';
import EarnStackNavigator from './stack.earn';
import topNavigator from './top.navigator';
import flex from '../assets/styles/layout.flex';
import { strings } from '../common/i18n';
import TabBar from './components/bottom.tab';

import homeLight from '../assets/images/root/tab/wallet.l.png';
import MineLight from '../assets/images/root/tab/mine.l.png';
import spendLight from '../assets/images/root/tab/spend.l.png';
import earnLight from '../assets/images/root/tab/earn.l.png';

const PrimaryTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStackNavigator,
      path: 'home',
      navigationOptions: {
        title: strings('root.Wallet'),
      },
    },
    Send: {
      screen: SpendStackNavigator,
      path: 'spend',
      navigationOptions: {
        title: strings('root.Spend'),
      },
    },
    Receive: {
      screen: EarnStackNavigator,
      path: 'earn',
      navigationOptions: {
        title: strings('root.Earn'),
      },
    },
    Mine: {
      screen: MineStackNavigator,
      path: 'mine',
      navigationOptions: {
        title: strings('root.Me'),
      },
    },
  },
  {
    tabBarComponent: TabBar,
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
          case 'Send':
            img = spendLight;
            break;
          case 'Receive':
            width = 21;
            height = 21;
            img = earnLight;
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
      inactiveTintColor: 'gray', // 未激活颜色
    },
  },
);

const PrimaryTabNavigatorContainer = createAppContainer(PrimaryTabNavigator);

export default class PrimaryTabNavigatorComp extends Component {
  componentDidMount() {
  }

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

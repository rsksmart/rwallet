import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import HomeStackNavigator from './stack.home';
import MineStackNavigator from './stack.mine';
import topNavigator from './top.navigator';
import flex from '../assets/styles/layout.flex';
import { strings } from '../common/i18n';
import TabBar from './components/bottom.tab';

import homeLight from '../assets/images/root/tab/home.png';
import homeGray from '../assets/images/root/tab/home.unselected.png';
import MineLight from '../assets/images/root/tab/mine.png';
import MineGray from '../assets/images/root/tab/mine.unselected.png';

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
      screen: HomeStackNavigator,
      path: 'home',
      navigationOptions: {
        title: strings('root.Spend'),
      },
    },
    Receive: {
      screen: MineStackNavigator,
      path: 'mine',
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
        if (focused) {
          // 激活图标
          switch (navigation.state.routeName) {
            case 'Home':
              img = homeLight;
              break;
            case 'Mine':
              img = MineLight;
              break;
            case 'Send':
              img = homeLight;
              break;
            case 'Receive':
              img = MineLight;
              break;
            default:
              console.error(`unexpected tab：${navigation.state.routeName}`);
          }
        } else {
          // 未激活图标
          switch (navigation.state.routeName) {
            case 'Home':
              img = homeGray;
              break;
            case 'Mine':
              img = MineGray;
              break;
            case 'Send':
              img = homeGray;
              break;
            case 'Receive':
              img = MineGray;
              break;
            default:
              console.error(`unexpected tab：${navigation.state.routeName}`);
          }
        }
        return (
          <View>
            <Image source={img} style={{ width: 21, height: 21 }} />
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

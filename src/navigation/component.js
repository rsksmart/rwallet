import React from 'react';
import { View, Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Provider } from '@ant-design/react-native';
import { Root } from 'native-base';

import UpdateModal from '../components/update/update.modal';
// import Start from '../pages/root/start';
import Start from '../pages/start/start';
import TermsPage from '../pages/start/terms';
import PrimaryTabNavigatorComp from './tab.primary';
import flex from '../assets/styles/layout.flex';

const SwitchNavi = createAppContainer(createSwitchNavigator(
  {
    Start: {
      screen: Start,
      path: 'start',
    },
    TermsPage: {
      screen: TermsPage,
      path: 'terms',
    },
    PrimaryTabNavigator: {
      screen: PrimaryTabNavigatorComp,
      path: 'tab',
    },
  },
  {
    initialRouteName: 'Start',
  },
));

const uriPrefix = Platform.OS === 'android' ? 'rwallet://rwallet/' : 'rwallet://rwallet/';

function RootComponent() {
  return (
    <View style={[flex.flex1]}>
      <Provider>
        <Root>
          <SwitchNavi uriPrefix={uriPrefix} />
          {false && <UpdateModal showUpdate mandatory={false} />}
        </Root>
      </Provider>
    </View>
  );
}

export default RootComponent;

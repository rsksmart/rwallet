import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import 'ethers/dist/shims';
import RootSwitchNavigator from './src/navigation/container';
import store from './src/redux/store';
import common from './src/common/common';
import color from './src/assets/styles/color';

// Fix cut-off text on some android device
common.setDefaultFontFamily();

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor={color.app.theme} />
      <RootSwitchNavigator />
    </Provider>
  );
}

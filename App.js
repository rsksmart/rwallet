import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import 'ethers/dist/shims';
import './shim'; // Provide global node types(global.Buffer, global.process) for node_modules packages(bitcoinjs-lib, bip32)
import RootSwitchNavigator from './src/navigation/container';
import store from './src/redux/store';
import common from './src/common/common';
import color from './src/assets/styles/color.ts';

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

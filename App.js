import React from 'react';
import { Provider } from 'react-redux';
import './shim'; // Provide global node types(global.Buffer, global.process) for node_modules packages(bitcoinjs-lib, bip32)
import RootSwitchNavigator from './src/navigation/container';
import store from './src/redux/store';
import common from './src/common/common';

// Fix cut-off text on some android device
common.setDefaultFontFamily();

export default function App() {
  return (
    <Provider store={store}>
      <RootSwitchNavigator />
    </Provider>
  );
}

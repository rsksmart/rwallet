import './shim';
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import RootSwitchNavigator from './src/navigation/container';
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

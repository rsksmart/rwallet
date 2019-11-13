import './shim';
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import RootSwitchNavigator from './src/navigation/container';
import appContext from './src/common/appContext';
import walletManager from './src/common/wallet/walletManager';

export default function App() {
  return (
    <Provider store={store}>
      <RootSwitchNavigator />
    </Provider>
  );
}

appContext.init(walletManager);

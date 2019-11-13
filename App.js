import './shim';
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider } from 'react-redux';
import Parse from 'parse/react-native';
import store from './src/redux/store';
import RootSwitchNavigator from './src/navigation/container';
import config from './config';
import appContext from './src/common/appContext';
import walletManager from './src/common/wallet/walletManager';

export default function App() {
  return (
    <Provider store={store}>
      <RootSwitchNavigator />
    </Provider>
  );
}

Parse.initialize(config.appId, config.javascriptKey, config.masterKey);
Parse.serverURL = config.serverURL;
Parse.masterKey = config.masterKey;
Parse.setAsyncStorage(AsyncStorage);

appContext.init(walletManager);

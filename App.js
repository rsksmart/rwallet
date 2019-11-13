import './shim';
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider } from 'react-redux';
import Parse from 'parse/react-native';
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

const parseConfig = {
  appId: 'rwallet',
  javascriptKey: '',
  masterKey: '5a269cfebfde46a9acec7b3273bf6c245a269cfebfde46a9acec7b3273bf6c24',
  serverURL: 'http://10.10.1.172:1338/parse',
};
Parse.initialize(parseConfig.appId, parseConfig.javascriptKey, parseConfig.masterKey);
Parse.serverURL = parseConfig.serverURL;
Parse.masterKey = parseConfig.masterKey;
Parse.setAsyncStorage(AsyncStorage);

appContext.init(walletManager);

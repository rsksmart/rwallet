import './shim';
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import RootSwitchNavigator from './src/navigation/container';
import Application from './src/common/application';

export default function App() {
  return (
    <Provider store={store}>
      <RootSwitchNavigator />
    </Provider>
  );
}

Application.init();

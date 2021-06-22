/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import RootSwitchNavigator from './src/navigation/container';
import store from './src/redux/store';
import common from './src/common/common';
import color from './src/assets/styles/color';

// Fix cut-off text on some android device
common.setDefaultFontFamily();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Provider store={store}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={color.app.theme} />
      <RootSwitchNavigator />
    </Provider>
  );
}

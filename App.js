import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { AppLoading, Font } from 'expo';
import { Root, StyleProvider, View } from 'native-base';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import LibraryApplication from 'mellowallet/lib/Application';


import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import i18n from './src/i18n';

import Navigator from './src/screens';
import store from './src/store';

const robotoFont = require('native-base/Fonts/Roboto.ttf');
const robotoMediumFont = require('native-base/Fonts/Roboto_medium.ttf');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
    };
  }

  loadResourcesAsync = async () => Promise.all([
    Font.loadAsync({
      Roboto: robotoFont,
      Roboto_medium: robotoMediumFont,
    }),
    i18n.init(),
    LibraryApplication(async () => {
      // This is to be sure that the library singleton is once at app start.
      return Promise.resolve();
    }),
  ]);

  handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    const { isLoadingComplete } = this.state;
    const { skipLoadingScreen } = this.props;
    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }

    return (
      <Root>
        <StyleProvider style={getTheme(material)}>
          <Provider store={store}>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
              <Navigator/>
            </View>
          </Provider>
        </StyleProvider>
      </Root>
    );
  }
}

App.propTypes = {
  skipLoadingScreen: PropTypes.bool,
};

App.defaultProps = {
  skipLoadingScreen: false,
};

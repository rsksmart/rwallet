import * as SecureStore from 'expo-secure-store'
import React from 'react';
import { StyleSheet, AppState } from 'react-native';
import { View } from 'native-base';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import EnterPinModal from './Pin/EnterPinModal';
import { conf } from '../utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      showPinModal: false,
    };
    const { navigation } = this.props;
    const showPinModal = navigation.getParam('showPinModal', true);
    if (showPinModal) {
      this.checkPin();
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    AppState.addEventListener('change', this.handleAppStateChange);
    navigation.navigate('Home');
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  checkPin = async () => {
    const pin = await SecureStore.getItemAsync(AsyncStorageEnum.PIN);
    if (conf('showPin') && pin) {
      this.showPinModal();
    }
  };

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.checkPin();
    }
    this.setState({ appState: nextAppState });
  };

  onSuccessPin = () => {
    this.setState({ showPinModal: false });
  };

  showPinModal = () => {
    this.setState({ showPinModal: true });
  };

  render() {
    const { showPinModal } = this.state;
    return (
      <View style={styles.container}>
        <EnterPinModal
          isVisible={showPinModal}
          onSuccessPin={this.onSuccessPin}
        />
      </View>
    );
  }
}

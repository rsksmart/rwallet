import React, { PureComponent } from 'react';
import { StyleSheet, Keyboard, BackHandler } from 'react-native';
import {
  Content,
  Container,
  View,
  Text,
  Button,
} from 'native-base';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import { t } from 'mellowallet/src/i18n';
import InputPin from 'mellowallet/src/components/InputPin';
import RemovableView from 'mellowallet/src/components/RemovableView';
import * as SecureStore from 'expo-secure-store'
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import { printError } from 'mellowallet/src/utils';

const styles = StyleSheet.create({
  pinInputView: {
    padding: 10,
    paddingTop: 20,
  },
  okViewButton: {
    alignSelf: 'center',
    marginTop: 40,
  },
  okViewButtonText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
});


class ChangePinScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      oldPin: '',
      newPin: '',
      newPinRepeat: '',
      newPinAvailable: false,
      newPinRepeatAvailable: false,
      formValid: false,
    };
    this.pinStored = '';
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
    SecureStore.getItemAsync(AsyncStorageEnum.PIN)
      .then((pin) => { this.pinStored = pin; })
      .catch(error => printError(error));
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  goBack = () => this.props.navigation.goBack()

  onOldPinChange = (oldPin) => {
    this.setState({
      oldPin, newPinAvailable: false, newPinRepeatAvailable: false, formValid: false,
    });
  }

  onOldPinFulFill = (pin) => {
    if (pin !== this.pinStored) {
      this.oldPinInput.shake()
        .then(() => {
          this.setState({ oldPin: '' });
          this.oldPinInput.focus();
        });
      return;
    }

    this.setState({ newPinAvailable: true, newPin: '' });
  }

  onNewPinChange = (newPin) => {
    this.setState({ newPin, newPinRepeatAvailable: false, formValid: false });
  }

  onNewPinFulFill = () => {
    this.setState({ newPinRepeatAvailable: true, newPinRepeat: '' });
  }

  onNewPinRepeatChange = (newPinRepeat) => {
    this.setState({ newPinRepeat, formValid: false });
  }

  onNewPinRepeatFulFill = (pin) => {
    const { newPin } = this.state;
    if (pin !== newPin) {
      this.newPinRepeatInput.shake()
        .then(() => {
          this.setState({ newPinRepeat: '' });
          this.newPinRepeatInput.focus();
        });
      return;
    }

    this.setState({ formValid: true });
    Keyboard.dismiss();
  }

  onCompletePress = () => {
    const { newPin } = this.state;
    SecureStore.setItemAsync(AsyncStorageEnum.PIN, newPin)
      .then(() => { this.goBack(); })
      .catch(error => printError(error));
  }

  render() {
    const {
      oldPin,
      newPin,
      formValid,
      newPinAvailable,
      newPinRepeatAvailable,
      newPinRepeat,
    } = this.state;
    return (
      <Container>

        <ActionHeader
          backAction={this.goBack}
          title={t('Change PIN')}
        />

        <Content padder>

          <View style={styles.pinInputView}>
            <InputPin
              reference={(c) => { this.oldPinInput = c; }}
              label={t('Type your 5 digits PIN')}
              value={oldPin}
              onTextChange={this.onOldPinChange}
              onFulfill={this.onOldPinFulFill}
            />

          </View>

          <RemovableView hidden={!newPinAvailable}>
            <View style={styles.pinInputView}>
              <InputPin
                label={t('Type your new PIN')}
                value={newPin}
                onTextChange={this.onNewPinChange}
                onFulfill={this.onNewPinFulFill}
              />
            </View>
          </RemovableView>

          <RemovableView hidden={!newPinRepeatAvailable}>
            <View style={styles.pinInputView}>
              <InputPin
                reference={(c) => { this.newPinRepeatInput = c; }}
                label={t('Re-type your new PIN')}
                value={newPinRepeat}
                onTextChange={this.onNewPinRepeatChange}
                onFulfill={this.onNewPinRepeatFulFill}
              />
            </View>
          </RemovableView>

          <Button
            style={styles.okViewButton}
            onPress={this.onCompletePress}
            disabled={!formValid}
          >
            <Text>Ready to go</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default ChangePinScreen;

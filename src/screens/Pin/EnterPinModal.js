import { SecureStore } from 'expo';
import React from 'react';
import {
  Modal,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  H1,
  View,
} from 'native-base';
import { PropTypes } from 'prop-types';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import InputPin from 'mellowallet/src/components/InputPin';
import { t } from 'mellowallet/src/i18n';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  viewWrapped: {
    margin: 10,
    marginTop: 30,
    flex: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  label: {
    color: 'red',
    textAlign: 'center',
  },
});

class EnterPinModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pin: '',
      error: false,
    };
  }

  onPinChange = (pin) => {
    this.setState({ pin, error: false });
  }

  onPinFulFill = async (confirmPin) => {
    const currentPin = await this.getCurrentPin();
    const { onSuccessPin } = this.props;
    if (confirmPin !== currentPin) {
      this.pinInput.shake()
        .then(() => this.setState({ pin: '', error: true }))
        .then(() => this.pinInput.focus());
      return;
    }
    await this.setState({ pin: '' });
    onSuccessPin();
  }

  getCurrentPin = () => SecureStore.getItemAsync(AsyncStorageEnum.PIN)

  render() {
    const { isVisible } = this.props;
    const { error } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisible}
        onRequestClose={() => null}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalBackground}>
            <View style={styles.viewWrapped}>
              <H1>{t('Enter your PIN')}</H1>
              <InputPin
                label={error ? t('Wrong PIN') : ''}
                labelStyle={styles.label}
                reference={(c) => { this.pinInput = c; }}
                onFulfill={this.onPinFulFill}
                value={this.state.pin}
                onTextChange={this.onPinChange}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

EnterPinModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onSuccessPin: PropTypes.func.isRequired,
};

export default EnterPinModal;

import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, Image, TouchableOpacity, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import * as Animatable from 'react-native-animatable';
import color from '../../../assets/styles/color.ts';
import Loc from '../misc/loc';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: color.component.touchSensorModal.backgroundColor,
  },
  panel: {
    marginHorizontal: 25,
    alignItems: 'center',
    backgroundColor: color.component.touchSensorModal.panel.backgroundColor,
    borderRadius: 5,
    paddingTop: 30,
    paddingBottom: 55,
  },
  scanView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: color.component.touchSensorModal.color,
    fontFamily: 'Avenir-Book',
    fontSize: 30,
  },
  finger: {
    marginTop: 20,
    marginBottom: 10,
  },
  touchToVerify: {
    fontFamily: 'Avenir-Heavy',
    color: '#000000',
    marginBottom: 17,
  },
  passcode: {},
  passcodeText: {
    color: color.text.warning,
    fontFamily: 'Avenir-Heavy',
    fontSize: 17,
  },
  errView: {
    paddingHorizontal: 20,
  },
  errText: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
    lineHeight: 20,
  },
  cancelView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  cancelText: {
    fontFamily: 'Avenir-Heavy',
    color: color.text.link,
    fontSize: 17,
  },
});

const finger = require('../../../assets/images/misc/finger.png');

export default class TouchSensorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'fade',
      transparent: true,
      errorMessage: null,
    };
    this.onCancelPress = this.onCancelPress.bind(this);
    this.onUsePasscodePress = this.onUsePasscodePress.bind(this);
    this.onIconPress = this.onIconPress.bind(this);
    this.requestScan = this.requestScan.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isShowFingerprintModal } = nextProps;
    const { isShowFingerprintModal: isShowFingerprintModalLast } = this.props;
    if (isShowFingerprintModal && !isShowFingerprintModalLast) {
      this.onShowFingerprintModal();
    }
  }

  onIconPress() {
    this.setState({ errorMessage: null });
    this.requestScan();
  }

  onShowFingerprintModal() {
    this.setState({ errorMessage: null });
    this.requestScan();
  }

  onUsePasscodePress() {
    const {
      hideFingerprintModal, fingerprintUsePasscode, fingerprintCallback, fingerprintFallback,
    } = this.props;
    if (fingerprintUsePasscode) {
      fingerprintUsePasscode(fingerprintCallback, fingerprintFallback);
      hideFingerprintModal();
    }
  }

  onCancelPress() {
    const { hideFingerprintModal, fingerprintFallback } = this.props;
    if (fingerprintFallback) {
      fingerprintFallback();
      hideFingerprintModal();
    }
  }

  startShow = () => {}

  requestScan() {
    const { hideFingerprintModal, fingerprintCallback } = this.props;
    const onAttempt = (error) => {
      console.log(`onAttempt: ${error}`);
      this.setState({ errorMessage: 'modal.touchSensor.fingerprintNotMatch' }, () => this.errView.shake(800));
    };
    const params = {
      onAttempt,
      description: 'modal.touchSensor.nativeNote',
      fallbackEnabled: false,
    };
    FingerprintScanner.authenticate(params).then(() => {
      this.setState({ errorMessage: null });
      if (fingerprintCallback) {
        fingerprintCallback();
      }
      hideFingerprintModal();
    }).catch((error) => {
      console.log(`FingerprintScanner, error, name: ${error.name}, message: ${error.message}, biometric: ${error.biometric}`);
      // If error.name is UserCancel, errorMessage is null
      // If error.name is AuthenticationFailed or FingerprintScannerNotSupported,
      // user have tried five times, system have stoped fingerprint verification.
      // We should let user use passcode.
      // If error.name is others, let user try again.
      switch (error.name) {
        case 'UserCancel':
          this.setState({ errorMessage: null });
          break;
        case 'AuthenticationFailed':
        case 'FingerprintScannerNotSupported':
          this.setState({ errorMessage: 'modal.touchSensor.failedAndTryPasscode' }, () => this.errView.shake(800));
          break;
        default:
          this.setState({ errorMessage: 'modal.touchSensor.failedAndTryAgain' }, () => this.errView.shake(800));
      }
    });
  }

  renderModal() {
    const { fingerprintFallback } = this.props;
    const { animationType, transparent, errorMessage } = this.state;
    return (
      <Modal
        animationType={animationType}
        transparent={transparent}
        onShow={this.startShow}
      >
        <View style={styles.container}>
          <View style={styles.panel}>
            <Loc style={[styles.title]} text="modal.touchSensor.title" />
            <Animatable.View ref={(ref) => { this.errView = ref; }} useNativeDriver style={styles.errView}>
              { errorMessage && (
                <Loc style={[styles.errText]} text={errorMessage} />
              )}
            </Animatable.View>
            <TouchableOpacity
              style={styles.finger}
              onPress={this.onIconPress}
              disabled={!(Platform.OS === 'ios')}
            >
              <Image source={finger} />
            </TouchableOpacity>
            { Platform.OS === 'ios' && (
              <Loc style={[styles.touchToVerify]} text="modal.touchSensor.touchToVerify" />
            )}
            <TouchableOpacity
              style={styles.passcode}
              onPress={this.onUsePasscodePress}
            >
              <Loc style={[styles.passcodeText]} text="modal.touchSensor.usePasscode" />
            </TouchableOpacity>
            {
              fingerprintFallback && (
                <TouchableOpacity style={[styles.cancelView]} onPress={this.onCancelPress}>
                  <Loc style={[styles.cancelText]} text="button.Cancel" />
                </TouchableOpacity>
              )
            }
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    // render only if isShowFingerprintModal is true.
    const { isShowFingerprintModal } = this.props;
    return isShowFingerprintModal ? this.renderModal() : null;
  }
}

TouchSensorModal.propTypes = {
  isShowFingerprintModal: PropTypes.bool.isRequired,
  hideFingerprintModal: PropTypes.func.isRequired,
  fingerprintCallback: PropTypes.func,
  fingerprintFallback: PropTypes.func,
  fingerprintUsePasscode: PropTypes.func,
};

TouchSensorModal.defaultProps = {
  fingerprintCallback: null,
  fingerprintFallback: null,
  fingerprintUsePasscode: null,
};

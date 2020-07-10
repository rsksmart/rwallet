import React, { Component } from 'react';
import {
  View, StyleSheet, Image, TouchableOpacity, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import * as Animatable from 'react-native-animatable';
import color from '../../../assets/styles/color.ts';
import Loc from '../misc/loc';
import { strings } from '../../../common/i18n';
import common from '../../../common/common';
import CONSTANTS from '../../../common/constants.json';

const { BIOMETRY_TYPES } = CONSTANTS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
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
    this.onCancelPress = this.onCancelPress.bind(this);
    this.onUsePasscodePress = this.onUsePasscodePress.bind(this);
    this.onIconPressed = this.onIconPressed.bind(this);
    this.requestScan = this.requestScan.bind(this);
    this.state = { errorMessage: null, biometryType: null };
  }

  async componentDidMount() {
    const biometryType = await common.getBiometryType();
    this.setState({ biometryType });
    this.requestScan();
  }

  componentWillUnmount = () => {
    FingerprintScanner.release();
  }

  onIconPressed() {
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
    const { biometryType } = this.state;
    const { hideFingerprintModal, fingerprintCallback } = this.props;
    const onAttempt = (error) => {
      console.log(`onAttempt: ${error}`);
      const errorMessage = biometryType === BIOMETRY_TYPES.FACE_ID ? 'modal.touchSensor.faceID.notMatch' : 'modal.touchSensor.fingerprint.notMatch';
      this.setState({ errorMessage }, () => this.errView.shake(800));
    };
    const params = {
      onAttempt,
      description: biometryType === BIOMETRY_TYPES.FACE_ID ? strings('modal.touchSensor.faceID.nativeNote') : strings('modal.touchSensor.fingerprint.nativeNote'),
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
    const { fingerprintPasscodeDisabled, fingerprintFallback } = this.props;
    const { errorMessage, biometryType } = this.state;
    const titleText = biometryType === BIOMETRY_TYPES.FACE_ID ? 'modal.touchSensor.faceID.title' : 'modal.touchSensor.fingerprint.title';
    const touchToVerifyText = biometryType === BIOMETRY_TYPES.FACE_ID ? 'modal.touchSensor.faceID.touchToVerify' : 'modal.touchSensor.fingerprint.touchToVerify';
    return (
      <View style={styles.container}>
        <View style={styles.panel}>
          <Loc style={[styles.title]} text={titleText} />
          <Animatable.View ref={(ref) => { this.errView = ref; }} useNativeDriver style={styles.errView}>
            { errorMessage && (
              <Loc style={[styles.errText]} text={errorMessage} />
            )}
          </Animatable.View>
          <TouchableOpacity
            style={styles.finger}
            onPress={this.onIconPressed}
            disabled={!(Platform.OS === 'ios')}
          >
            <Image source={finger} />
          </TouchableOpacity>
          { Platform.OS === 'ios' && (
            <Loc style={[styles.touchToVerify]} text={touchToVerifyText} />
          )}

          {
            !fingerprintPasscodeDisabled && (
              <TouchableOpacity
                style={styles.passcode}
                onPress={this.onUsePasscodePress}
              >
                <Loc style={[styles.passcodeText]} text="modal.touchSensor.usePasscode" />
              </TouchableOpacity>
            )
          }
          {
            fingerprintFallback && (
              <TouchableOpacity style={[styles.cancelView]} onPress={this.onCancelPress}>
                <Loc style={[styles.cancelText]} text="button.cancel" />
              </TouchableOpacity>
            )
          }
        </View>
      </View>
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
  fingerprintPasscodeDisabled: PropTypes.bool,
  fingerprintCallback: PropTypes.func,
  fingerprintFallback: PropTypes.func,
  fingerprintUsePasscode: PropTypes.func,
};

TouchSensorModal.defaultProps = {
  fingerprintPasscodeDisabled: false,
  fingerprintCallback: null,
  fingerprintFallback: null,
  fingerprintUsePasscode: null,
};

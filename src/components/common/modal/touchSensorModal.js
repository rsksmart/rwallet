import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, Image, TouchableOpacity, Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import FingerprintScanner from 'react-native-fingerprint-scanner';
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
    paddingBottom: 60,
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
    marginTop: 30,
  },
  finger: {
    marginTop: 25,
    marginBottom: 10,
  },
  passcode: {},
  passcodeText: {
    color: '#000000',
  },
  errView: {
    marginTop: 5,
    color: 'red',
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
  }

  componentWillReceiveProps(nextProps) {
    const { isShowFingerprintModal } = nextProps;
    const { isShowFingerprintModal: isShowFingerprintModalLast } = this.props;
    this.setState({ errorMessage: nextProps.errorMessage });
    if (isShowFingerprintModal && !isShowFingerprintModalLast) {
      this.onShowFingerprintModal();
    }
  }

  onIconPress() {
    this.requestScan();
  }

  onShowFingerprintModal() {
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
      this.setState({ errorMessage: 'No match' });
    };
    const params = {
      onAttempt,
      description: 'Scan your fingerprint on the device scanner to continue',
    };
    FingerprintScanner.authenticate(params).then(() => {
      if (fingerprintCallback) {
        fingerprintCallback();
      }
      hideFingerprintModal();
    }).catch((error) => {
      console.log('FingerprintScanner, error: ', error.message);
    });
  }

  render() {
    const { isShowFingerprintModal, fingerprintFallback } = this.props;
    const { animationType, transparent } = this.state;

    let errView = null;
    const { errorMessage } = this.state;
    if (errorMessage && errorMessage !== '') {
      errView = (
        <Loc style={[styles.errView]} text={errorMessage} />
      );
    }

    let noteView = null;
    if (Platform.OS === 'ios') {
      noteView = (<Loc style={[styles.passcodeText]} text="Touch to fingerprint validation" />);
    }

    return (
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible={isShowFingerprintModal}
        onShow={this.startShow}
      >
        <View style={styles.container}>
          <View style={styles.panel}>
            <Loc style={[styles.title]} text="Touch Sensor" />
            {errView}
            <TouchableOpacity
              style={styles.finger}
              onPress={this.onIconPress}
              disabled={!Platform.OS === 'ios'}
            >
              <Image source={finger} />
            </TouchableOpacity>
            {noteView}
            <TouchableOpacity
              style={styles.passcode}
              onPress={this.onUsePasscodePress}
            >
              <Loc style={[styles.passcodeText]} text="Use passcode" />
            </TouchableOpacity>
            {
              fingerprintFallback && (
                <TouchableOpacity onPress={this.onCancelPress}>
                  <Loc style={[styles.passcodeText]} text="Cancel" />
                </TouchableOpacity>
              )
            }
          </View>
        </View>
      </Modal>
    );
  }
}

TouchSensorModal.propTypes = {
  errorMessage: PropTypes.string,
  isShowFingerprintModal: PropTypes.bool.isRequired,
  hideFingerprintModal: PropTypes.func.isRequired,
  fingerprintCallback: PropTypes.func,
  fingerprintFallback: PropTypes.func,
  fingerprintUsePasscode: PropTypes.func,
};

TouchSensorModal.defaultProps = {
  errorMessage: null,
  fingerprintCallback: null,
  fingerprintFallback: null,
  fingerprintUsePasscode: null,
};

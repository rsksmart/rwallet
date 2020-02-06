import React, { Component } from 'react';
import {
  Modal, View, StyleSheet, Image, TouchableOpacity, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import color from '../../../assets/styles/color.ts';
import Loc from '../misc/loc';
import appActions from '../../../redux/app/actions';


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
    fontSize: 30,
    fontWeight: '900',
    color: color.component.touchSensorModal.color,
    marginTop: 30,
  },
  finger: {
    marginTop: 45,
    marginBottom: 30,
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

class TouchSensorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'fade',
      transparent: true,
      errorMessage: null,
    };
    this.onCancelPress = this.onCancelPress.bind(this);
    this.onUsePasscodePress = this.onUsePasscodePress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { isShowFingerprintModal } = this.props;
    this.setState({ errorMessage: nextProps.errorMessage });
    if (nextProps.isShowFingerprintModal !== isShowFingerprintModal) {
      if (nextProps.isShowFingerprintModal) {
        this.onShowFingerprintModal();
      }
    }
  }

  onShowFingerprintModal() {
    this.requestScan();
  }

  onUsePasscodePress() {
    const { hideFingerprintModal, onUsePasscodePress } = this.props;
    if (onUsePasscodePress) {
      hideFingerprintModal();
      onUsePasscodePress();
    }
  }

  onCancelPress() {
    const { hideFingerprintModal, fingerprintFallback } = this.props;
    if (fingerprintFallback) {
      hideFingerprintModal();
      fingerprintFallback();
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
            <TouchableOpacity
              style={styles.finger}
              onPress={() => (Platform.OS === 'ios' ? this.requestScan() : {})}
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
            {errView}
          </View>
        </View>
      </Modal>
    );
  }
}

TouchSensorModal.propTypes = {
  onUsePasscodePress: PropTypes.func,
  errorMessage: PropTypes.string,
  isShowFingerprintModal: PropTypes.bool.isRequired,
  hideFingerprintModal: PropTypes.func.isRequired,
  fingerprintCallback: PropTypes.func,
  fingerprintFallback: PropTypes.func,
};

TouchSensorModal.defaultProps = {
  onUsePasscodePress: null,
  errorMessage: null,
  fingerprintCallback: null,
  fingerprintFallback: null,
};

const mapStateToProps = (state) => ({
  isShowFingerprintModal: state.App.get('isShowFingerprintModal'),
  fingerprintCallback: state.App.get('fingerprintCallback'),
  fingerprintFallback: state.App.get('fingerprintFallback'),
});

const mapDispatchToProps = (dispatch) => ({
  hideFingerprintModal: () => dispatch(appActions.hideFingerprintModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TouchSensorModal);

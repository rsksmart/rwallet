import React, { Component } from 'react';
import {
  View, Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import FingerprintScanner from 'react-native-fingerprint-scanner';
import Header from '../../components/headers/header';

import flex from '../../assets/styles/layout.flex';
import TouchSensorModal from '../../components/common/modal/touchSensorModal';

export default class VerifyFingerprint extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        errorMessage: '',
      };
    }

    componentDidMount() {
      const { navigation } = this.props;
      this.touchSensor.setModalVisible(true);
      const onAttempt = (error) => {
        console.log(`onAttempt: ${error}`);
        this.setState({ errorMessage: 'No match' });
      };
      const params = {
        onAttempt,
        description: 'Scan your fingerprint on the device scanner to continue',
      };
      FingerprintScanner
        .authenticate(params)
        .then(() => {
          this.touchSensor.setModalVisible(false);
          // navigation.state.params.verified();
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error.message);
          Alert.alert('try again.');
        });
    }

    componentWillUnmount() {
      FingerprintScanner.release();
    }

    render() {
      const { navigation } = this.props;
      const { errorMessage } = this.state;
      return (
        <View style={[flex.flex1]}>
          <Header title="Verify Fingerprint" onBackButtonPress={() => navigation.goBack()} />
          <TouchSensorModal
            ref={(ref) => { this.touchSensor = ref; }}
            onUsePasscodePress={() => {
              // navigation.goBack();
              // navigation.navigate('VerifyPasscode');
            }}
            onUserCancel={() => { navigation.goBack(); }}
            errorMessage={errorMessage}
          />
        </View>
      );
    }
}

VerifyFingerprint.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

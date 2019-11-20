import React, { Component } from 'react';
import {
  View, Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import FingerprintScanner from 'react-native-fingerprint-scanner';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
import TouchSensorModal from '../../components/common/modal/touchSensorModal';

export default class VerifyFingerprint extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    componentDidMount() {
      const { navigation } = this.props;
      this.touchSensor.setModalVisible(true);
      FingerprintScanner
        .authenticate({ description: 'Scan your fingerprint on the device scanner to continue' })
        .then(() => {
          this.touchSensor.setModalVisible(false);
          navigation.state.params.verified();
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error.message);
          Alert.alert('try again.');
        });
    }

    render() {
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header title="Verify Fingerprint" goBack={navigation.goBack} />
          <TouchSensorModal
            ref={(ref) => { this.touchSensor = ref; }}
            onUsePasscodePress={() => {
              navigation.goBack();
              navigation.navigate('VerifyPasscode', { verified: navigation.state.params.verified });
            }}
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

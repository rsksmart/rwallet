import React, { Component } from 'react';
import {
  View, AlertIOS,
} from 'react-native';
import PropTypes from 'prop-types';

import FingerprintScanner from 'react-native-fingerprint-scanner';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
import TouchSensorModal from '../../components/common/modal/touchSensorModal';

export default class ResetFingerprint extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    componentDidMount() {
      // this.touchSensor.setModalVisible(true);
      FingerprintScanner
        .authenticate({ description: 'Scan your fingerprint on the device scanner to continue' })
        .then(() => {
          AlertIOS.alert('Authenticated successfully');
        })
        .catch((error) => {
          AlertIOS.alert(error.message);
        });
    }

    render() {
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header title="Reset Passcode" goBack={navigation.goBack} />
          <TouchSensorModal
            ref={(ref) => { this.touchSensor = ref; }}
            onPress={() => {
              navigation.navigate('ResetFingerprintSuccess');
            }}
          />
        </View>
      );
    }
}

ResetFingerprint.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

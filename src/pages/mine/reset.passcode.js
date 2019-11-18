import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
import PasscodeModal from '../../components/common/modal/passcodeModal';
import appContext from '../../common/appContext';

export default class ResetPasscode extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    componentDidMount() {
      this.passcodeModal.setModalVisible(true);
    }

    render() {
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header title="Reset Passcode" goBack={navigation.goBack} />
          <PasscodeModal
            ref={(ref) => { this.passcodeModal = ref; }}
            onPress={() => {
              navigation.goBack();
            }}
            onFill={(passcode) => {
              appContext.secureSet('pin', passcode);
              navigation.navigate('ResetPasscodeSuccess');
            }}
          />
        </View>
      );
    }
}

ResetPasscode.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

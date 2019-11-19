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

    constructor(props) {
      super(props);
      this.state = {
        flow: 'oldPasscode',
        newPasscode: null,
      };
    }

    componentDidMount() {
      appContext.secureGet('passcode', (value) => {
        if (!value) {
          this.setState({ flow: 'newPasscode' });
        } else {
          this.setState({ flow: 'oldPasscode' });
        }
      });
      this.passcodeModal.setModalVisible(true);
    }

    render() {
      const { navigation } = this.props;
      const { flow, newPasscode } = this.state;
      let title = 'Enter Old Passcode';
      if (flow === 'newPasscode') {
        title = 'Enter New Passcode';
      } else if (flow === 'confirmPasscode') {
        title = 'Confirm Passcode';
      }
      return (
        <View style={[flex.flex1]}>
          <Header title="Reset Passcode" goBack={navigation.goBack} />
          <PasscodeModal
            title={title}
            ref={(ref) => { this.passcodeModal = ref; }}
            onPress={() => {
              navigation.goBack();
            }}
            onFill={(passcode) => {
              if (flow === 'oldPasscode') {
                appContext.secureGet('passcode', (value) => {
                  if (passcode === value) {
                    this.setState({ flow: 'newPasscode' });
                  }
                  this.passcodeModal.setModalVisible(true);
                });
              } else if (flow === 'newPasscode') {
                this.passcodeModal.setModalVisible(true);
                this.setState({ flow: 'confirmPasscode', newPasscode: passcode });
              } else if (flow === 'confirmPasscode') {
                if (passcode === newPasscode) {
                  appContext.secureSet('passcode', newPasscode);
                  navigation.navigate('ResetPasscodeSuccess', navigation.state.params);
                } else {
                  this.passcodeModal.setModalVisible(true);
                }
              }
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

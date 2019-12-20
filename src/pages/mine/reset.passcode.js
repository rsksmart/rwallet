import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
import PasscodeModal from '../../components/common/modal/passcodeModal';
import appContext from '../../common/appContext';
import appActions from '../../redux/app/actions';
import { createInfoNotification } from '../../common/notification.controller';

class ResetPasscode extends Component {
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

    async componentDidMount() {
      this.passcodeModal.setModalVisible(true);
      const value = await appContext.secureGet('passcode');
      if (!value) {
        this.setState({ flow: 'newPasscode' });
      } else {
        this.setState({ flow: 'oldPasscode' });
      }
    }

    render() {
      const { navigation, addNotification } = this.props;
      const { flow, newPasscode } = this.state;
      let title = 'Enter Old Passcode';
      if (flow === 'newPasscode') {
        title = 'Enter New Passcode';
      } else if (flow === 'confirmPasscode') {
        title = 'Confirm Passcode';
      }
      return (
        <View style={[flex.flex1]}>
          <Header title="Reset Passcode" goBack={() => { navigation.goBack(); }} />
          <PasscodeModal
            title={title}
            ref={(ref) => { this.passcodeModal = ref; }}
            onPress={() => { navigation.goBack(); }}
            onFill={async (passcode) => {
              if (flow === 'oldPasscode') {
                this.passcodeModal.setModalVisible(true);
                const value = await appContext.secureGet('passcode');
                if (value === passcode) {
                  this.setState({ flow: 'newPasscode' });
                } else {
                  const notification = createInfoNotification(
                    'Old Password',
                    'Old Password is wrong',
                  );
                  addNotification(notification);
                }
              } else if (flow === 'newPasscode') {
                this.passcodeModal.setModalVisible(true);
                this.setState({ flow: 'confirmPasscode', newPasscode: passcode });
              } else if (flow === 'confirmPasscode') {
                if (passcode === newPasscode) {
                  await appContext.secureSet('passcode', newPasscode);
                  navigation.navigate('ResetPasscodeSuccess', navigation.state.params);
                } else {
                  this.passcodeModal.setModalVisible(true);
                  const notification = createInfoNotification(
                    'Passcode Mismatch',
                    'Passcode Mismatch Body',
                    'RETRY',
                  );
                  addNotification(notification);
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
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasscode);

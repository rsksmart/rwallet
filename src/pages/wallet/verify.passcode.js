import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Header from '../../components/common/misc/header';
import flex from '../../assets/styles/layout.flex';
// import PasscodeModalMake from '../../components/common/passcode/passcodeModal';

export default class VerifyPasscode extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    componentDidMount() {
    }

    render() {
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <Header title="Verify Passcode" goBack={() => { navigation.goBack(); }} />
          {/* <PasscodeModalMake */}
          {/*  ref={(ref) => { this.passcodeModal = ref; }} */}
          {/*  onPress={() => { navigation.goBack(); }} */}
          {/*  onFill={async (passcode) => { */}
          {/*    const value = await appContext.secureGet('passcode'); */}
          {/*    if (passcode === value) { */}
          {/*      navigation.state.params.verified(); */}
          {/*      navigation.goBack(); */}
          {/*    } */}
          {/*  }} */}
          {/* /> */}
        </View>
      );
    }
}

VerifyPasscode.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

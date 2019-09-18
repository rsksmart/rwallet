import React from 'react';
import * as SecureStore from 'expo-secure-store'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {
  Container,
  Content,
} from 'native-base';
import { PropTypes } from 'prop-types';

import { t } from 'mellowallet/src/i18n';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import InputPin from 'mellowallet/src/components/InputPin';
import { onStepCompleted } from 'mellowallet/src/store/actions/onBoarding';
import { printError } from 'mellowallet/src/utils';
import onBoardingStepEnum from 'mellowallet/src/utils/onBoardingStepEnum';

const mapDispatchToProps = dispatch => ({
  onStepCompleted: () => dispatch(onStepCompleted(onBoardingStepEnum.PIN_CREATED)),
});

class ConfirmPin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPin: '',
    };
    const { navigation } = this.props;
    this.pin = navigation.getParam('pin');
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.dispatch(NavigationActions.back());
  }

  onPinChange = (confirmPin) => {
    this.setState({ confirmPin });
  }

  onPinFulFill = (confirmPin) => {
    if (confirmPin !== this.pin) {
      this.pinInput.shake()
        .then(() => this.setState({ confirmPin: '' }))
        .then(() => this.pinInput.focus());
      return;
    }

    SecureStore.setItemAsync(AsyncStorageEnum.PIN, confirmPin)
      .then(() => this.props.onStepCompleted())
      .catch(error => printError(error));
  }

  render() {
    const { confirmPin } = this.state;
    return (
      <Container>
        <ActionHeader
          title={t('Create your PIN')}
          backAction={this.goBack}
        />
        <Content padder>
          <InputPin
            reference={(c) => { this.pinInput = c; }}
            label={t('Re-Type your 5 digits PIN')}
            value={confirmPin}
            onFulfill={this.onPinFulFill}
            onTextChange={this.onPinChange}
            onSubmitEditing={this.onPinFulFill}
          />
        </Content>

      </Container>
    );
  }
}

ConfirmPin.propTypes = {
  onStepCompleted: PropTypes.func.isRequired,
};

const ConfirmPinScreen = connect(null, mapDispatchToProps)(ConfirmPin);

export default ConfirmPinScreen;

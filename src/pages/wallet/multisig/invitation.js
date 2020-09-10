import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../../redux/app/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import Button from '../../../components/common/button/button';

class MultisigAddressInvitation extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = { isLoading: false, canSubmit: true };
    }

    onCreateButtonPressed = () => {
      console.log('onCreateButtonPressed');
    }

    render() {
      const { isLoading, canSubmit } = this.state;
      const { navigation } = this.props;
      const customButton = (<Button text="button.create" onPress={this.onCreateButtonPressed} disabled={!canSubmit} />);
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.joinMultisigAddress.title" />}
          customBottomButton={customButton}
        >
          <View />
        </BasePageGereral>
      );
    }
}

MultisigAddressInvitation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array,
    findToken: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultisigAddressInvitation);

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../../redux/app/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';

class MultisigAddressInvitation extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    onCreateButtonPressed = () => {
      console.log('onCreateButtonPressed');
    }

    render() {
      const { navigation } = this.props;
      return (
        <BasePageGereral
          isSafeView
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.multisigInvitation.title" />}
        >
          <View>
            <Text>Wallet Invitation</Text>
            <Text>Share this address with the devices joining this account. each copayer has their own recovery phrase. To recover funds stored in a Share Wallet you will need to the recovery phrase from each copayer.</Text>
            <Text>Waiting for authorized copayers to join</Text>
            <Text>Me</Text>
            <Text>Waiting</Text>
          </View>
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

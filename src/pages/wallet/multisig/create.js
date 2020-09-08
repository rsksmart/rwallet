import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../../redux/app/actions';
// import BasePageGereral from '../../base/base.page.general';

class CreateMultisigToken extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    render() {
      return (
        <View />
      );
    }
}

CreateMultisigToken.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateMultisigToken);

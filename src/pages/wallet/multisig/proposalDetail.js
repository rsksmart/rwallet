import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import Transaction from '../../../common/transaction';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';
import parseHelper from '../../../common/parse';

class MultisigProposalDetail extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { token, proposal } = props.navigation.state.params;
      this.token = token;
      this.proposal = proposal;
    }

    approve = async () => {
      try {
        const transaction = new Transaction(this.token, null, null, {});
        transaction.rawTransaction = this.proposal.get('rawTransaction');
        transaction.proposalId = this.proposal.id;
        await transaction.signTransaction();
        await transaction.processSignedTransaction();
      } catch (error) {
        console.log('approve, error: ', error);
      }
    }

    reject = async () => {
      try {
        const result = await CancelablePromiseUtil.makeCancelable(parseHelper.rejectMultisigTransaction(this.proposal.id));
        console.log('reject, result: ', result);
      } catch (error) {
        console.log('reject, error: ', error);
      }
    }

    render() {
      const { navigation } = this.props;
      return (
        <BasePageGereral
          isSafeView
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.multisigInvitation.title" />}
        >
          <TouchableOpacity onPress={this.approve}><Text>Approve</Text></TouchableOpacity>
          <TouchableOpacity onPress={this.reject}><Text>Reject</Text></TouchableOpacity>
        </BasePageGereral>
      );
    }
}

MultisigProposalDetail.propTypes = {
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
  setMultisigBTCAddress: (invitationCode, address) => dispatch(walletActions.setMultisigBTCAddress(invitationCode, address)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultisigProposalDetail);

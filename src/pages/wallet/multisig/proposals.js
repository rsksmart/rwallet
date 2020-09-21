import React, { Component } from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import parseHelper from '../../../common/parse';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';


class MultisigProposals extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { token } = props.navigation.state.params;
      this.token = token;
      this.state = {
        proposals: [],
      };
    }

    async componentWillMount() {
      const proposals = await CancelablePromiseUtil.makeCancelable(parseHelper.fetchProposals(this.token.address));
      this.setState({ proposals });
    }

    gotoProposalDetail = (proposal) => {
      const { navigation } = this.props;
      navigation.navigate('MultisigProposalDetail', { proposal, token: this.token });
    }


    render() {
      const { navigation } = this.props;
      const { proposals } = this.state;
      return (
        <BasePageGereral
          isSafeView
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.multisigInvitation.title" />}
        >
          <FlatList
            data={proposals}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                this.gotoProposalDetail(item);
              }}
              >
                <Text>{item.id}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </BasePageGereral>
      );
    }
}

MultisigProposals.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MultisigProposals);

import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import parseHelper from '../../../common/parse';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';


class MultisigAddressInvitation extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { coin } = props.navigation.state.params;
      this.coin = coin;
      this.state = {
        copayers: [],
        copayerNumber: undefined,
        signatureNumber: undefined,
        generatedAddress: undefined,
      };
    }

    async componentWillMount() {
      const { setMultisigBTCAddress } = this.props;
      const result = await CancelablePromiseUtil.makeCancelable(parseHelper.fetchMultisigInvitation(this.coin.invitationCode));
      const copayerMembers = result.get('copayerMembers');
      const copayerNumber = result.get('copayerNumber');
      const signatureNumber = result.get('signatureNumber');
      const generatedAddress = result.get('generatedAddress');

      // 如果已经产生了地址，则赋值给本地相应的token
      if (!_.isEmpty(generatedAddress)) {
        setMultisigBTCAddress(this.coin, generatedAddress);
      }

      const copayers = _.map(copayerMembers, (member) => member.name);
      this.setState({
        copayers,
        copayerNumber,
        signatureNumber,
        generatedAddress,
      });
    }


    render() {
      const { navigation } = this.props;
      const {
        copayers, copayerNumber, signatureNumber, generatedAddress,
      } = this.state;
      return (
        <BasePageGereral
          isSafeView
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.multisigInvitation.title" />}
        >
          <View>
            <Text>{`${signatureNumber}/${copayerNumber}`}</Text>
            <Text>Wallet Invitation</Text>
            <Text>Share this address with the devices joining this account. each copayer has their own recovery phrase. To recover funds stored in a Share Wallet you will need to the recovery phrase from each copayer.</Text>
            <Text>{this.coin.invitationCode}</Text>
            { generatedAddress ? (<Text>Waiting for authorized copayers to join</Text>) : (
              <FlatList
                data={copayers}
                renderItem={({ item }) => (<Text>{item}</Text>)}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
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
  setMultisigBTCAddress: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  setMultisigBTCAddress: (token, address) => dispatch(walletActions.setMultisigBTCAddress(token, address)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultisigAddressInvitation);

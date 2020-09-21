import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import Button from '../../../components/common/button/button';
import Loc from '../../../components/common/misc/loc';
import presetStyle from '../../../assets/styles/style';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';
import parseHelper from '../../../common/parse';

const styles = StyleSheet.create({
  body: {
    marginHorizontal: 25,
  },
});

class JoinMultisigAddress extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        canSubmit: true,
        userName: null,
        invitationCode: null,
      };
    }

    onJoinButtonPressed = async () => {
      console.log('onJoinButtonPressed');
      const { userName, invitationCode } = this.state;

      // Fetch invitation, and get type
      const invitation = await CancelablePromiseUtil.makeCancelable(parseHelper.fetchMultisigInvitation(invitationCode));
      const type = invitation.get('type');

      const { walletManager, addMultisigBTC, navigation } = this.props;
      const wallet = walletManager.wallets[0];
      const { derivations } = wallet;
      const derivation = _.find(derivations, { symbol: 'BTC', type });
      const { publicKey } = derivation;
      const result = await CancelablePromiseUtil.makeCancelable(parseHelper.joinMultisigAddress({
        invitationCode, publicKey, name: userName,
      }));
      console.log('result: ', result);

      addMultisigBTC(walletManager, wallet, invitationCode, type);
      navigation.navigate('MultisigAddressInvitation', { invitationCode });
    }

    onInvitationCodeChanged = (text) => {
      this.setState({ invitationCode: text });
    }

    onUserNameChanged = (text) => {
      this.setState({ userName: text });
    }

    render() {
      const {
        isLoading, canSubmit, userName, invitationCode,
      } = this.state;
      const { navigation } = this.props;
      const customButton = (<Button text="button.join" onPress={this.onJoinButtonPressed} disabled={!canSubmit} />);
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.joinMultisigAddress.title" />}
          customBottomButton={customButton}
        >
          <View style={styles.body}>
            <View>
              <Loc text="page.wallet.joinMultisigAddress.userName" />
              <TextInput
                style={[presetStyle.textInput]}
                value={userName}
                onChangeText={this.onUserNameChanged}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>
            <View>
              <Loc text="page.wallet.joinMultisigAddress.invitationCode" />
              <TextInput
                style={[presetStyle.textInput]}
                value={invitationCode}
                onChangeText={this.onInvitationCodeChanged}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>
          </View>
        </BasePageGereral>
      );
    }
}

JoinMultisigAddress.propTypes = {
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
  addMultisigBTC: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  addMultisigBTC: (walletManager, wallet, invitationCode, type) => dispatch(walletActions.addMultisigBTC(walletManager, wallet, invitationCode, type)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinMultisigAddress);

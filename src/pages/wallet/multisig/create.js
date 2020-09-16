import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput, Switch,
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

class CreateMultisigAddress extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        canSubmit: true,
        walletName: 'Multisig Wallet',
        userName: 'cxy',
        signatures: '2',
        copayers: '2',
        isMainnet: true,
      };
    }

    componentWillUnmount() {
      CancelablePromiseUtil.cancel(this);
    }

    onCreateButtonPressed = async () => {
      console.log('onCreateButtonPressed');
      const {
        userName, signatures, copayers, isMainnet,
      } = this.state;
      // const { navigation } = this.props;
      const type = isMainnet ? 'Mainnet' : 'Testnet';
      const { walletManager } = this.props;
      const wallet = walletManager.wallets[0];
      const { derivations } = wallet;
      const derivation = _.find(derivations, { symbol: 'BTC', type });
      const { publicKey } = derivation;
      const signatureNumber = parseInt(signatures, 10);
      const copayerNumber = parseInt(copayers, 10);

      console.log('onCreateButtonPressed, derivation: ', derivation);
      const params = {
        signatureNumber, copayerNumber, publicKey, type, name: userName,
      };
      console.log('onCreateButtonPressed, params: ', params);
      const result = await CancelablePromiseUtil.makeCancelable(parseHelper.createMultisigAddress(params));
      console.log('result: ', result);
      // navigation.navigate('JoinMultisigAddress');
    }

    onWalletNameChanged = (text) => {
      this.setState({ walletName: text });
    }

    onUserNameChanged = (text) => {
      this.setState({ userName: text });
    }

    onSwitchValueChanged = (value) => {
      this.setState({ isMainnet: value });
    }

    onSignaturesChanged = (text) => {
      this.setState({ signatures: text });
    }

    onCopayersChanged = (text) => {
      this.setState({ copayers: text });
    }

    render() {
      const {
        isLoading, canSubmit, walletName, userName, isMainnet, signatures, copayers,
      } = this.state;
      const { navigation } = this.props;
      const customButton = (<Button text="button.create" onPress={this.onCreateButtonPressed} disabled={!canSubmit} />);
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.createMultisigAddress.title" />}
          customBottomButton={customButton}
        >
          <View style={styles.body}>
            <View>
              <Loc text="page.wallet.createMultisigAddress.walletName" />
              <TextInput
                style={[presetStyle.textInput]}
                value={walletName}
                onChangeText={this.onWalletNameChanged}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>
            <View>
              <Loc text="page.wallet.createMultisigAddress.userName" />
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
              <Loc text="page.wallet.createMultisigAddress.signatures" />
              <TextInput
                style={[presetStyle.textInput]}
                value={signatures}
                onChangeText={this.onSignaturesChanged}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>
            <View>
              <Loc text="page.wallet.createMultisigAddress.copayers" />
              <TextInput
                style={[presetStyle.textInput]}
                value={copayers}
                onChangeText={this.onCopayersChanged}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
              />
            </View>
            <View>
              <Loc text="page.wallet.addCustomToken.mainnet" />
              <Switch value={isMainnet} onValueChange={this.onSwitchValueChanged} />
            </View>
          </View>
        </BasePageGereral>
      );
    }
}

CreateMultisigAddress.propTypes = {
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
  addToken: (walletManager, wallet, token) => dispatch(walletActions.addToken(walletManager, wallet, token)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateMultisigAddress);

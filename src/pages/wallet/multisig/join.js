import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput, TouchableOpacity, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import Button from '../../../components/common/button/button';
import Loc from '../../../components/common/misc/loc';
import presetStyle from '../../../assets/styles/style';
import references from '../../../assets/references';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  body: {
    marginHorizontal: 25,
  },
  textInputView: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputIcon: {
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 15,
  },
  textInput: {
    color: color.black,
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 0,
    marginLeft: 5,
    marginVertical: 10,
    flex: 1,
    borderWidth: 0,
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
      const { navigation } = this.props;
      const multisigParams = { userName, invitationCode };
      const navigateParams = {
        shouldCreatePhrase: true, shouldVerifyPhrase: true, isJoiningMultisig: true, multisigParams,
      };
      navigation.navigate('RecoveryPhrase', navigateParams);
    }

    onInvitationCodeChanged = (text) => {
      this.setState({ invitationCode: text });
    }

    onUserNameChanged = (text) => {
      this.setState({ userName: text });
    }

    onQrcodeScanPress = () => {
      console.log('onQrcodeScanPress');
      const { navigation } = this.props;
      navigation.navigate('Scan', {
        coin: this.coin,
        onDetectedAction: 'backToTransfer',
        onQrcodeDetected: (address) => {
          console.log('onQrcodeDetected, address: ', address);
          // Fill in the address and call onToInputBlur to check the content
          // this.setState({ to: address }, () => {
          //   this.onToInputBlur();
          // });
        },
      });
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
              <View style={styles.textInputView}>
                <TextInput
                  style={[styles.textInput]}
                  value={invitationCode}
                  onChangeText={this.onInvitationCodeChanged}
                  autoCapitalize="none"
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <TouchableOpacity style={styles.textInputIcon} onPress={this.onQrcodeScanPress}>
                  <Image source={references.images.scanAddress} />
                </TouchableOpacity>
              </View>
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

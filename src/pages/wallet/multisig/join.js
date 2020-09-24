import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput, TouchableOpacity, Image,
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
import references from '../../../assets/references';
import color from '../../../assets/styles/color';
import space from '../../../assets/styles/space';
import { NAME_MAX_LENGTH } from '../../../common/constants';
import { createErrorNotification, getErrorNotification, getDefaultErrorNotification } from '../../../common/notification.controller';
import ParseHelper from '../../../common/parse';

const styles = StyleSheet.create({
  body: {
    marginHorizontal: 25,
    marginTop: 20,
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
    fontSize: 16,
    paddingVertical: 0,
    marginLeft: 10,
    marginVertical: 12,
    flex: 1,
    borderWidth: 0,
  },
  fieldName: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
  },
  note: {
    fontFamily: 'Avenir-Book',
    fontSize: 14,
    marginTop: 15,
  },
  fieldTitle: {
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
  },
  fieldView: {
    paddingBottom: 17,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.grayD8,
  },
});

class JoinMultisigAddress extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      let invitationCode = null;
      if (props.navigation.state.params) {
        invitationCode = props.navigation.state.params.invitationCode;
      }
      this.state = {
        isLoading: false,
        canSubmit: false,
        userName: null,
        invitationCode,
      };
    }

    onJoinButtonPressed = async () => {
      console.log('onJoinButtonPressed');
      const { userName, invitationCode } = this.state;
      const { navigation, addNotification } = this.props;
      this.setState({ isLoading: true });
      let invitation = null;
      try {
        invitation = await ParseHelper.fetchMultisigInvitation(invitationCode);
        if (!invitation) {
          const notification = createErrorNotification('modal.invalidWalletInvitation.title', 'modal.invalidWalletInvitation.body');
          addNotification(notification);
          return;
        }
      } catch (error) {
        const notification = getErrorNotification(error.code, 'button.retry') || getDefaultErrorNotification('button.retry');
        addNotification(notification);
        return;
      } finally {
        this.setState({ isLoading: false });
      }

      const type = invitation.get('type');
      const walletName = invitation.get('walletName');
      const signatureNumber = invitation.get('signatureNumber');
      const copayerNumber = invitation.get('copayerNumber');
      const multisigParams = {
        userName, invitationCode, type, walletName, signatureNumber, copayerNumber,
      };
      const navigateParams = {
        shouldCreatePhrase: true, shouldVerifyPhrase: true, isJoiningMultisig: true, multisigParams,
      };
      navigation.navigate('RecoveryPhrase', navigateParams);
    }

    checkIfCanSubmit = () => {
      const { userName, invitationCode } = this.state;
      const canSubmit = !_.isEmpty(userName) && !_.isEmpty(invitationCode);
      this.setState({ canSubmit });
    }

    onInvitationCodeChanged = (text) => {
      const invitationCode = text.trim();
      this.setState({ invitationCode }, this.checkIfCanSubmit);
    }

    onUserNameChanged = (text) => {
      const userName = text.trim();
      this.setState({ userName }, this.checkIfCanSubmit);
    }

    onQrcodeScanPress = () => {
      console.log('onQrcodeScanPress');
      const { navigation, addNotification } = this.props;
      navigation.navigate('Scan', {
        coin: this.coin,
        onDetectedAction: 'backToTransfer',
        onQrcodeDetected: (data) => {
          console.log('onQrcodeDetected, code: ', data);
          const prefix = 'ms:';
          const isInvitationCode = data.startsWith(prefix);
          if (!isInvitationCode) {
            const notification = createErrorNotification('modal.invalidWalletInvitation.title', 'modal.invalidWalletInvitation.body');
            addNotification(notification);
            return;
          }
          const invitationCode = data.substring(prefix.length, data.length);
          this.setState({ invitationCode });
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
            <View style={[styles.fieldView]}>
              <Loc style={styles.fieldName} text="page.wallet.joinMultisigAddress.userName" />
              <TextInput
                style={[presetStyle.textInput, space.marginTop_7]}
                value={userName}
                onChangeText={this.onUserNameChanged}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                maxLength={NAME_MAX_LENGTH}
              />
            </View>
            <View style={[styles.fieldView, space.marginTop_23]}>
              <Loc style={styles.fieldTitle} text="page.wallet.joinMultisigAddress.invitationCode" />
              <View style={[styles.textInputView, space.marginTop_9]}>
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
              <Loc style={styles.note} text="page.wallet.joinMultisigAddress.note" />
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
  addNotification: PropTypes.func.isRequired,
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

import React, { Component } from 'react';
import _ from 'lodash';
import {
  View, StyleSheet, TextInput, Switch, TouchableOpacity, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { CommonPicker } from '@yz1311/react-native-wheel-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import Button from '../../../components/common/button/button';
import Loc from '../../../components/common/misc/loc';
import presetStyle from '../../../assets/styles/style';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';
import { BtcAddressType } from '../../../common/constants';
import color from '../../../assets/styles/color';
import space from '../../../assets/styles/space';
import readOnlyStyles from '../../../assets/styles/readonly';
import { createInfoNotification } from '../../../common/notification.controller';

const MAX_COPAYERS = 7;
const MAX_SIGNATURES = 2;

const styles = StyleSheet.create({
  body: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  walletName: {
    color: color.black,
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
  },
  fieldView: {
    paddingBottom: 17,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.grayD8,
  },
  advancedOptions: {
    color: color.black,
    fontFamily: 'Avenir-Heavy',
    fontSize: 14,
    marginTop: 20,
  },
  pickerButton: {
    height: 46,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
  },
  rowAddress: {
    fontSize: 16,
    fontFamily: 'Avenir-Book',
    marginRight: 7,
    color: color.black,
    flex: 1,
  },
  rowChevron: {
    fontSize: 30,
    color: color.lightGray,
    right: 5,
  },
  picker: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
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
        canSubmit: false,
        walletName: null,
        userName: null,
        signatures: 2,
        copayers: 3,
        isMainnet: false,
        isLegacy: true,
        picker: null,
      };
    }

    componentWillUnmount() {
      CancelablePromiseUtil.cancel(this);
    }

    onCreateButtonPressed = async () => {
      const {
        walletName, userName, signatures, copayers, isMainnet, isLegacy,
      } = this.state;
      const type = isMainnet ? 'Mainnet' : 'Testnet';
      const signatureNumber = parseInt(signatures, 10);
      const copayerNumber = parseInt(copayers, 10);
      const { navigation } = this.props;
      const multisigParams = {
        walletName, userName, type, signatureNumber, copayerNumber,
      };
      const coins = [{ symbol: 'BTC', type, addressType: isLegacy ? BtcAddressType.legacy : BtcAddressType.segwit }];
      const navigateParams = {
        coins, shouldCreatePhrase: true, shouldVerifyPhrase: true, isCreatingMultisig: true, multisigParams,
      };
      navigation.navigate('RecoveryPhrase', navigateParams);
    }

    onWalletNameChanged = (text) => {
      this.setState({ walletName: text }, () => {
        this.checkIfCanSubmit();
      });
    }

    onUserNameChanged = (text) => {
      this.setState({ userName: text }, () => {
        this.checkIfCanSubmit();
      });
    }

    onSwitchValueChanged = (value) => {
      this.setState({ isMainnet: value });
    }

    onAddressTypeChanged = (value) => {
      this.setState({ isLegacy: value });
    }

    onNetworkQuestionPressed = () => {
      const { addNotification } = this.props;
      const notification = createInfoNotification(
        'modal.networkQuestion.title',
        'modal.networkQuestion.body',
      );
      addNotification(notification);
    }

    onAddressTypeQuestionPressed = () => {
      const { addNotification } = this.props;
      const notification = createInfoNotification(
        'modal.addressTypeQuestion.title',
        'modal.addressTypeQuestion.body',
      );
      addNotification(notification);
    }

    onSignaturesPressed = () => {
      const { signatures, copayers } = this.state;
      const data = [];

      const maxNumber = copayers || MAX_COPAYERS;
      for (let i = MAX_SIGNATURES; i <= maxNumber; i += 1) {
        data.push(i.toString());
      }

      const picker = {
        data,
        selectedValue: signatures ? signatures.toString() : null,
        onConfirm: (value) => {
          const newSignatures = parseInt(value, 10);
          this.setState({ picker: null, signatures: newSignatures });
        },
      };

      this.setState({ picker });
    }

    onCopayersPressed = () => {
      const { copayers } = this.state;
      const data = [];

      for (let i = MAX_SIGNATURES; i <= MAX_COPAYERS; i += 1) {
        data.push(i.toString());
      }

      const picker = {
        data,
        selectedValue: copayers ? copayers.toString() : null,
        onConfirm: (value) => {
          const { signatures } = this.state;
          const newCopayers = parseInt(value, 10);
          this.setState({ picker: null, copayers: newCopayers });
          if (signatures > newCopayers) {
            this.setState({ signatures: newCopayers });
          }
        },
      };

      this.setState({ picker });
    }

    checkIfCanSubmit = () => {
      const { walletName, userName } = this.state;
      const canSubmit = !_.isEmpty(walletName) && !_.isEmpty(userName);
      this.setState({ canSubmit });
    }

    onPickerCancel = () => {
      this.setState({ picker: null });
    }

    render() {
      const {
        isLoading, canSubmit, walletName, userName, isMainnet, isLegacy, copayers, signatures, picker,
      } = this.state;
      const { navigation } = this.props;
      const customButton = (<Button text="button.create" onPress={this.onCreateButtonPressed} disabled={!canSubmit} />);
      return (
        <View style={{ flex: 1 }}>
          <BasePageGereral
            isSafeView
            hasBottomBtn
            hasLoader
            isLoading={isLoading}
            headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.createMultisigAddress.title" />}
            customBottomButton={customButton}
          >
            <View style={styles.body}>
              <View style={styles.fieldView}>
                <Loc style={styles.walletName} text="page.wallet.createMultisigAddress.walletName" />
                <TextInput
                  style={[presetStyle.textInput, space.marginTop_7]}
                  value={walletName}
                  onChangeText={this.onWalletNameChanged}
                  autoCapitalize="none"
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
              </View>
              <View style={[styles.fieldView, space.marginTop_22]}>
                <Loc style={styles.fieldTitle} text="page.wallet.createMultisigAddress.userName" />
                <TextInput
                  style={[presetStyle.textInput, space.marginTop_10]}
                  value={userName}
                  onChangeText={this.onUserNameChanged}
                  autoCapitalize="none"
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
              </View>
              <View style={[styles.fieldView, space.marginTop_22]}>
                <Loc style={[styles.fieldTitle, space.marginBottom_10]} text="page.wallet.createMultisigAddress.signatures" />
                <TouchableOpacity style={styles.pickerButton} onPress={this.onSignaturesPressed}>
                  <Text style={[styles.rowAddress, space.marginLeft_8]}>{signatures}</Text>
                  <EvilIcons style={styles.rowChevron} name="chevron-down" />
                </TouchableOpacity>
              </View>
              <View style={[styles.fieldView, space.marginTop_22]}>
                <Loc style={[styles.fieldTitle, space.marginBottom_10]} text="page.wallet.createMultisigAddress.copayers" />
                <TouchableOpacity style={styles.pickerButton} onPress={this.onCopayersPressed}>
                  <Text style={[styles.rowAddress, space.marginLeft_8]}>{copayers}</Text>
                  <EvilIcons style={styles.rowChevron} name="chevron-down" />
                </TouchableOpacity>
              </View>
              <Loc style={styles.advancedOptions} text="page.wallet.createMultisigAddress.advancedOptions" />
              <View style={[styles.fieldView, space.marginTop_23, { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Loc style={[styles.fieldTitle]} text="page.wallet.addCustomToken.mainnet" />
                  <TouchableOpacity style={{ marginLeft: 5 }} onPress={this.onNetworkQuestionPressed}>
                    <AntDesign style={readOnlyStyles.questionIcon} name="questioncircleo" />
                  </TouchableOpacity>
                </View>
                <Switch style={{ alignSelf: 'flex-end' }} value={isMainnet} onValueChange={this.onSwitchValueChanged} />
              </View>
              <View style={[styles.fieldView, space.marginTop_23, { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Loc style={[styles.fieldTitle]} text="page.wallet.createMultisigAddress.legacy" />
                  <TouchableOpacity style={{ marginLeft: 5 }} onPress={this.onAddressTypeQuestionPressed}>
                    <AntDesign style={readOnlyStyles.questionIcon} name="questioncircleo" />
                  </TouchableOpacity>
                </View>
                <Switch value={isLegacy} onValueChange={this.onAddressTypeChanged} disabled />
              </View>
            </View>
          </BasePageGereral>
          { picker && (
            <CommonPicker
              style={styles.picker}
              pickerData={[picker.data]}
              selectedValue={[picker.selectedValue]}
              pickerCancelBtnText="Cancel"
              pickerConfirmBtnText="Confirm"
              onPickerCancel={this.onPickerCancel}
              onPickerConfirm={picker.onConfirm}
            />
          )}
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateMultisigAddress);

import React, { Component } from 'react';
import _ from 'lodash';
import {
  View, StyleSheet, TextInput, TouchableOpacity, Text, BackHandler,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Picker from 'react-native-picker';
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
import { createInfoNotification } from '../../../common/notification.controller';
import { strings } from '../../../common/i18n';
import SwitchRow from '../../../components/common/switch/switch.row';

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
      };
    }

    componentDidMount() {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        Picker.isPickerShow((status) => {
          if (status) {
            Picker.hide();
          }
        });
      });
    }

    componentWillUnmount() {
      CancelablePromiseUtil.cancel(this);
      this.backHandler.remove();
      Picker.hide();
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

    onSignaturesPressed = () => {
      const { copayers, signatures } = this.state;
      const data = [];

      const maxNumber = copayers || MAX_COPAYERS;
      for (let i = 2; i <= maxNumber; i += 1) {
        data.push(i);
      }

      Picker.init({
        pickerData: data,
        selectedValue: [signatures],
        onPickerConfirm: (value) => {
          this.setState({ signatures: parseInt(value, 10) }, () => {
            this.checkIfCanSubmit();
          });
        },
        pickerTitleText: '',
        pickerConfirmBtnText: strings('picker.confirm'),
        pickerCancelBtnText: strings('picker.cancel'),
      });
      Picker.show();
    }

    onCopayersPressed = () => {
      const { copayers } = this.state;
      const data = [];
      for (let i = MAX_SIGNATURES; i <= MAX_COPAYERS; i += 1) {
        data.push(i);
      }

      Picker.init({
        pickerData: data,
        selectedValue: [copayers],
        onPickerConfirm: (value) => {
          const { signatures } = this.state;
          let newSignatures = signatures;
          const newCopayers = parseInt(value, 10);
          // The number of Signatures must be less or equal to the number of copayers
          if (newSignatures && newSignatures > newCopayers) {
            newSignatures = newCopayers;
          }
          this.setState({ copayers: newCopayers, signatures: newSignatures }, () => {
            this.checkIfCanSubmit();
          });
        },
        pickerTitleText: '',
        pickerConfirmBtnText: strings('picker.confirm'),
        pickerCancelBtnText: strings('picker.cancel'),
      });
      Picker.show();
    }

    checkIfCanSubmit = () => {
      const { walletName, userName } = this.state;
      const canSubmit = !_.isEmpty(walletName) && !_.isEmpty(userName);
      this.setState({ canSubmit });
    }

    onBackButtonPressed = () => {
      const { navigation } = this.props;
      Picker.hide();
      navigation.goBack();
    }

    render() {
      const {
        isLoading, canSubmit, walletName, userName, isMainnet, isLegacy, copayers, signatures,
      } = this.state;
      const customButton = (<Button text="button.create" onPress={this.onCreateButtonPressed} disabled={!canSubmit} />);
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={this.onBackButtonPressed} title="page.wallet.createMultisigAddress.title" />}
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
            <View style={[styles.fieldView, space.marginTop_23]}>
              <SwitchRow
                text={strings('networkType.mainnet')}
                value={isMainnet}
                onValueChange={this.onSwitchValueChanged}
                questionNotification={createInfoNotification(
                  'modal.networkQuestion.title',
                  'modal.networkQuestion.body',
                )}
              />
            </View>
            <View style={[styles.fieldView, space.marginTop_23]}>
              <SwitchRow
                text={strings('page.wallet.createMultisigAddress.legacy')}
                value={isLegacy}
                onValueChange={this.onAddressTypeChanged}
                questionNotification={createInfoNotification(
                  'modal.addressTypeQuestion.title',
                  'modal.addressTypeQuestion.body',
                )}
                disabled
              />
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
  addMultisigBTC: (walletManager, wallet, invitationCode, type) => dispatch(walletActions.addMultisigBTC(walletManager, wallet, invitationCode, type)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateMultisigAddress);

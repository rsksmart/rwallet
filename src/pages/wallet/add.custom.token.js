import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Rsk3 from '@rsksmart/rsk3';
import Header from '../../components/headers/header';
import Switch from '../../components/common/switch/switch';
import Loc from '../../components/common/misc/loc';
import presetStyle from '../../assets/styles/style';
import BasePageGereral from '../base/base.page.general';
import color from '../../assets/styles/color';
import fontFamily from '../../assets/styles/font.family';
import parseHelper from '../../common/parse';
import appActions from '../../redux/app/actions';
import { getErrorNotification, getDefaultErrorNotification } from '../../common/notification.controller';
import Button from '../../components/common/button/button';
import CancelablePromiseUtil from '../../common/cancelable.promise.util';
import common from '../../common/common';
import { WalletType } from '../../common/constants';
import { InvalidAddressError } from '../../common/error';
import ConvertAddressConfirmation from '../../components/wallet/convert.address.confirmation';
import { strings } from '../../common/i18n';
import reportErrorToServer from '../../common/error/report.error';

const styles = StyleSheet.create({
  sectionContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.seporatorLineGrey,
    paddingBottom: 20,
  },
  title: {
    color: color.black,
    fontFamily: fontFamily.AvenirRoman,
    fontSize: 16,
    letterSpacing: 0.4,
    marginBottom: 10,
    marginTop: 17,
  },
  body: {
    marginHorizontal: 25,
    marginTop: 13,
  },
  switchView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.seporatorLineGrey,
    paddingBottom: 15,
    paddingTop: 15,
  },
  switchTitle: {
    flex: 1,
    marginBottom: 0,
  },
  addressInput: {
    height: 'auto',
    minHeight: 16,
    textAlignVertical: 'top',
    paddingBottom: 12,
    paddingTop: 12,
  },
});

class AddCustomToken extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        address: '',
        isMainnet: true,
        isCanConfirm: false,
        isShowConvertAddressModal: false,
      };
      this.wallet = props.navigation.state.params.wallet;
      this.type = this.wallet.walletType === WalletType.Readonly ? this.wallet.type : 'Mainnet';
      this.chain = 'Rootstock';
      this.contractAddress = null;
    }

    componentWillUnmount() {
      this.setState({ isLoading: false });
      CancelablePromiseUtil.cancel(this);
    }

    onSwitchValueChanged = (value) => {
      this.setState({ isMainnet: value });
      this.type = value ? 'Mainnet' : 'Testnet';
    }

    onAddressInputChanged = async (text) => {
      const address = text.trim();
      this.setState({ address, isCanConfirm: !_.isEmpty(address) });
    }

    onPressed = async () => {
      const { address } = this.state;
      const { type } = this;

      try {
        const isWalletAddress = common.isWalletAddress(address, 'RBTC', type);
        if (!isWalletAddress) {
          throw new InvalidAddressError();
        }

        // If address is not a checksum address, pop up convert address modal to covert it to checksum address.
        // Issue #560, Readonly address: if user input wrong checksum address, rwallet should alert and auto-convert the address
        const { networkId } = common.getCoinType('RBTC', type);
        const isChecksumAddress = Rsk3.utils.checkAddressChecksum(address, networkId);
        if (!isChecksumAddress) {
          this.setState({ isShowConvertAddressModal: true });
          return;
        }

        this.contractAddress = address;
        this.addToken();
      } catch (error) {
        const { addNotification } = this.props;
        const notification = getErrorNotification(error.code, 'button.retry') || getDefaultErrorNotification();

        if (!getErrorNotification(error.code)) {
          reportErrorToServer({
            developerComment: 'Add custom token, onPressed',
            additionalInfo: { address, type },
            errorObject: error,
          });
        }

        addNotification(notification);
      }
    }

    onConvertAddressConfirmed = () => {
      const { address } = this.state;
      const { type } = this;
      this.setState({ isShowConvertAddressModal: false });
      const { networkId } = common.getCoinType('RBTC', type);
      this.contractAddress = common.toChecksumAddress(address, networkId);
      this.addToken();
    }

    addToken = async () => {
      const { addNotification, navigation } = this.props;
      const { type, chain, contractAddress } = this;
      try {
        this.setState({ isLoading: true });
        const tokenInfo = await CancelablePromiseUtil.makeCancelable(parseHelper.getTokenBasicInfo(type, chain, contractAddress), this);
        const { name, symbol, decimals } = tokenInfo;
        navigation.navigate('AddCustomTokenConfirm', {
          address: contractAddress, symbol, precision: decimals, name, type, chain, ...navigation.state.params,
        });
      } catch (error) {
        console.log('getTokenBasicInfo, error: ', error);
        const notification = getErrorNotification(error.code, 'button.retry') || getDefaultErrorNotification();

        if (!getErrorNotification(error.code)) {
          reportErrorToServer({
            developerComment: 'Add custom token, addToken',
            additionalInfo: { contractAddress, chain, type },
            errorObject: error,
          });
        }

        addNotification(notification);
      } finally {
        this.setState({ isLoading: false });
      }
    }

    render() {
      const { navigation } = this.props;
      const {
        isLoading, address, isMainnet, isCanConfirm, isShowConvertAddressModal,
      } = this.state;
      const bottomButton = (<Button style={{ opacity: isCanConfirm ? 1 : 0.5 }} text="button.Next" onPress={this.onPressed} disabled={!isCanConfirm} />);
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn={false}
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.addCustomToken.title" />}
          customBottomButton={bottomButton}
        >
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title, styles.name]} text="page.wallet.addCustomToken.address" />
              <TextInput
                style={[presetStyle.textInput, styles.addressInput]}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                value={address}
                onChangeText={this.onAddressInputChanged}
              />
            </View>
            { this.wallet.walletType !== WalletType.Readonly && (
              <View style={[styles.switchView]}>
                <Loc style={[styles.switchTitle]} text="networkType.mainnet" />
                <Switch
                  value={isMainnet}
                  onValueChange={this.onSwitchValueChanged}
                />
              </View>
            ) }
          </View>
          { isShowConvertAddressModal
            && (
            <ConvertAddressConfirmation
              title={strings('modal.convertContractAddress.title')}
              body={strings('modal.convertContractAddress.body')}
              onConfirm={this.onConvertAddressConfirmed}
              onCancel={() => this.setState({ isShowConvertAddressModal: false })}
            />
            )}
        </BasePageGereral>
      );
    }
}

AddCustomToken.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  isWalletNameUpdated: state.Wallet.get('isWalletNameUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  removeNotification: () => dispatch(appActions.removeNotification()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomToken);

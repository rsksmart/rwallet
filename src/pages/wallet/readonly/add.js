import React, { Component } from 'react';
import {
  View, TextInput, Image, Text, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Rsk3 from '@rsksmart/rsk3';
import Header from '../../../components/headers/header';
import Loc from '../../../components/common/misc/loc';
import presetStyle from '../../../assets/styles/style';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import coinListItemStyles from '../../../assets/styles/coin.listitem.styles';
import Button from '../../../components/common/button/button';
import Switch from '../../../components/common/switch/switch';
import readOnlyStyles from '../../../assets/styles/readonly';
import common from '../../../common/common';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';
import parseHelper from '../../../common/parse';
import { defaultErrorNotification } from '../../../common/constants';
import { createErrorConfirmation } from '../../../common/confirmation.controller';
import { strings } from '../../../common/i18n';
import appActions from '../../../redux/app/actions';
import { createInfoNotification } from '../../../common/notification.controller';

class AddReadOnlyWallet extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        address: '',
        isMainnet: true,
        errorText: undefined,
        isLoading: false,
        canSubmit: false,
      };
      this.type = 'Mainnet';
    }

    componentDidMount() {
      const { isReadOnlyWalletIntroShowed, showReadOnlyWalletIntro, addNotification } = this.props;
      if (!isReadOnlyWalletIntroShowed) {
        const notification = createInfoNotification(
          'modal.readOnlyWallet.title',
          'modal.readOnlyWallet.body',
        );
        addNotification(notification);
        showReadOnlyWalletIntro();
      }
    }

    componentWillUnmount() {
      this.setState({ isLoading: false });
      CancelablePromiseUtil.cancel(this);
    }

    onSubmitEditing = () => {
      const { address } = this.state;
      const submitText = address.trim();
      this.setState({ address: submitText });
    }

    onChangeText = (text) => {
      const address = text.trim();
      this.setState({ address, errorText: '', canSubmit: true });
    }

    onSwitchValueChanged = (value) => {
      this.setState({ isMainnet: value, errorText: '', canSubmit: true });
      this.type = value ? 'Mainnet' : 'Testnet';
    }

    showReadOnlyNotification = () => {
      const { addNotification } = this.props;
      const notification = createInfoNotification(
        'modal.readOnlyWallet.title',
        'modal.readOnlyWallet.body',
      );
      addNotification(notification);
    }

    renderListItem = (item) => (
      <View style={coinListItemStyles.row} onPress={item.onPress}>
        <Image style={coinListItemStyles.icon} source={item.icon} />
        <View style={coinListItemStyles.rowRightView}>
          <View style={coinListItemStyles.rowTitleView}>
            <Text style={coinListItemStyles.title}>{item.symbol}</Text>
            <Text style={coinListItemStyles.text}>{item.name}</Text>
          </View>
          <View style={coinListItemStyles.rowAmountView}>
            <Text style={coinListItemStyles.worth}>{item.amount}</Text>
            <Text style={coinListItemStyles.amount}>{item.worth}</Text>
          </View>
        </View>
      </View>
    )

    onCheck = async () => {
      const { navigation, addConfirmation, walletManager } = this.props;
      const { address } = this.state;
      const { type } = this;
      let chain = null;
      // let coins = [{ symbol: 'BTC' }];
      let symbol = null;
      let newAddress = address;
      let subdomain = null;
      if (common.isValidRnsSubdomain(address)) {
        console.log(`toAddress[${address}] a rns subdomain.`);
        this.setState({ isLoading: true });
        try {
          const subdomainAddress = await CancelablePromiseUtil.makeCancelable(parseHelper.querySubdomain(address, type), this);
          if (subdomainAddress) {
            newAddress = subdomainAddress;
            subdomain = address;
          } else {
            this.setState({ errorText: strings('page.wallet.addReadOnlyWallet.rnsInvalid'), canSubmit: false });
            return;
          }
        } catch (error) {
          const confirmation = createErrorConfirmation(
            defaultErrorNotification.title,
            defaultErrorNotification.message,
            'button.retry',
            () => this.onCheck(),
            () => null,
          );
          addConfirmation(confirmation);
          return;
        } finally {
          this.setState({ isLoading: false });
        }
      }
      if (newAddress.startsWith('0x')) {
        chain = 'Rootstock';
        symbol = 'RBTC';
      } else {
        chain = 'Bitcoin';
        symbol = 'BTC';
      }

      const isWalletAddress = common.isWalletAddress(newAddress, symbol, type);
      const { networkId } = common.getCoinType(symbol, type);
      newAddress = Rsk3.utils.toChecksumAddress(address, networkId);
      if (!isWalletAddress) {
        this.setState({ errorText: strings('page.wallet.transfer.unavailableAddress'), canSubmit: false });
        return;
      }

      const token = walletManager.findToken(symbol, type, address);
      if (token) {
        this.setState({ errorText: strings('page.wallet.addReadOnlyWallet.duplicateAddress'), canSubmit: false });
        return;
      }

      navigation.navigate('AddReadOnlyWalletConfirmation', {
        chain, type, address: newAddress, subdomain,
      });
    }

    render() {
      const { navigation } = this.props;
      const {
        address, isMainnet, errorText, isLoading, canSubmit,
      } = this.state;
      const customButton = (<Button text="button.check" onPress={this.onCheck} disabled={!canSubmit} />);
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn={false}
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.addReadOnlyWallet.title" />}
          customBottomButton={customButton}
        >
          <View style={readOnlyStyles.body}>
            <View style={readOnlyStyles.titleRow}>
              <Loc style={[readOnlyStyles.title]} text="page.wallet.addReadOnlyWallet.address" />
              <TouchableOpacity onPress={this.showReadOnlyNotification}>
                <AntDesign style={readOnlyStyles.questionIcon} name="questioncircleo" />
              </TouchableOpacity>
            </View>
            <View style={readOnlyStyles.noteRow}>
              <Loc text="page.wallet.addReadOnlyWallet.note" />
            </View>
            <TextInput
              style={[presetStyle.textInput, readOnlyStyles.addressInput]}
              value={address}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitEditing}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              multiline
            />
            <View style={readOnlyStyles.chainType}>
              <Loc style={[readOnlyStyles.switchTitle]} text="page.wallet.addCustomToken.mainnet" />
              <Switch value={isMainnet} onValueChange={this.onSwitchValueChanged} />
            </View>
            <View style={readOnlyStyles.addressRow}>
              <Text style={readOnlyStyles.errorText}>{errorText}</Text>
            </View>
          </View>
        </BasePageGereral>
      );
    }
}

AddReadOnlyWallet.propTypes = {
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
  addConfirmation: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  isReadOnlyWalletIntroShowed: PropTypes.bool.isRequired,
  showReadOnlyWalletIntro: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  isReadOnlyWalletIntroShowed: state.App.get('isReadOnlyWalletIntroShowed'),
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  createReadOnlyWallet: (chain, type, address, coins) => dispatch(walletActions.createReadOnlyWallet(chain, type, address, coins)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  showReadOnlyWalletIntro: () => dispatch(appActions.showReadOnlyWalletIntro()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddReadOnlyWallet);

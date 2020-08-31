import React, { Component } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';
import _ from 'lodash';
import Loc from '../../components/common/misc/loc';
import appActions from '../../redux/app/actions';
import walletActions from '../../redux/wallet/actions';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import { createInfoNotification } from '../../common/notification.controller';
import { createBTCAddressTypeConfirmation } from '../../common/confirmation.controller';
import config from '../../../config';
import coinType from '../../common/wallet/cointype';
import common from '../../common/common';
import Item from '../../components/wallet/coin.type.list.item';
import color from '../../assets/styles/color';
import { BtcAddressType } from '../../common/constants';
import Button from '../../components/common/button/button';

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: color.black,
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionContainer: {
    paddingHorizontal: 10,
    marginTop: 15,
  },
});

class WalletSelectCurrency extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.state = {
        isLoading: false,
        canSubmit: true,
      };
      this.phrase = navigation.state.params ? navigation.state.params.phrases : '';
      this.isImportWallet = !!this.phrase;
      this.mainnet = [];
      this.testnet = [];
      const { consts: { supportedTokens } } = config;
      // Generate mainnet and testnet list data
      _.each(supportedTokens, (token) => {
        const item = { title: token, symbol: token, icon: coinType[token].icon };
        item.selected = true;
        this.mainnet.push(item);
        const testnetItem = { title: common.getSymbolName(token, 'Testnet'), symbol: token, icon: coinType[`${token}Testnet`].icon };
        testnetItem.selected = false;
        this.testnet.push(testnetItem);
      });
    }

    componentWillReceiveProps(nextProps) {
      const { navigation, isWalletsUpdated } = nextProps;
      const { isLoading } = this.state;
      // isWalletsUpdated is true indicates wallet is added, the app will navigate to other page.
      if (isWalletsUpdated && isLoading) {
        this.setState({ isLoading: false });
        const stackActions = StackActions.popToTop();
        navigation.dispatch(stackActions);
      }
    }

    // call resetWalletsUpdated when componentWillUnmount is safe.
    componentWillUnmount() {
      const { isWalletsUpdated, resetWalletsUpdated } = this.props;
      if (isWalletsUpdated) {
        resetWalletsUpdated();
      }
    }

    createCoins = (addressType) => {
      // List of tokens to be created, [{symbol, type, addressType}]
      const coins = [];
      const addCoins = (items, type) => {
        _.each(items, (item) => {
          const { selected, symbol } = item;
          if (selected) {
            const coin = { symbol, type };
            // BTC needs to set the address type
            if (symbol === 'BTC') {
              coin.addressType = addressType;
            }
            coins.push(coin);
          }
        });
      };
      addCoins(this.mainnet, 'Mainnet');
      addCoins(this.testnet, 'Testnet');
      // Create these tokens
      this.createWalletWithCoins(coins);
    }

    onCreateButtonPress = async () => {
      const { addConfirmation } = this.props;
      const selectedMainnetBtc = _.find(this.mainnet, { symbol: 'BTC', selected: true });
      const selectedTestnetBtc = _.find(this.testnet, { symbol: 'BTC', selected: true });
      // If BTC is not selected, there is no need to ask the user for the address type of BTC.
      if (!selectedMainnetBtc && !selectedTestnetBtc) {
        this.createCoins();
        return;
      }
      // Ask users for BTC address type
      const notification = createBTCAddressTypeConfirmation(() => {
        this.createCoins(BtcAddressType.legacy);
      }, () => {
        this.createCoins(BtcAddressType.segwit);
      });
      addConfirmation(notification);
    }

    createWalletWithCoins = (coins) => {
      const { navigation } = this.props;
      if (this.isImportWallet) {
        this.requestCreateWallet(this.phrase, coins);
      } else {
        navigation.navigate('RecoveryPhrase', { coins, shouldCreatePhrase: true, shouldVerifyPhrase: true });
      }
    }

    onSwitchValueChanged = () => {
      const selectedMainnetItems = _.filter(this.mainnet, { selected: true });
      const selectedTestnetItems = _.filter(this.testnet, { selected: true });
      const selectedCount = selectedMainnetItems.length + selectedTestnetItems.length;
      this.setState({ canSubmit: selectedCount !== 0 });
    }

    requestCreateWallet(phrase, coins) {
      const { addNotification, showPasscode, passcode } = this.props;
      if (passcode) {
        this.createWallet(phrase, coins);
      } else {
        const notification = createInfoNotification(
          'modal.createPasscode.title',
          'modal.createPasscode.body',
          null,
          () => showPasscode('create', () => this.createWallet(phrase, coins)),
        );
        addNotification(notification);
      }
    }

    createWallet(phrase, coins) {
      // createKey cost time, it will block ui.
      // So we let run at next tick, loading ui can present first.
      const { navigation } = this.props;
      const { createKey, walletManager } = this.props;
      let derivationPaths = null;
      if (navigation.state.params && navigation.state.params.derivationPaths) {
        derivationPaths = navigation.state.params.derivationPaths;
      }
      this.setState({ isLoading: true }, () => {
        setTimeout(() => {
          createKey(null, phrase, coins, walletManager, derivationPaths);
        }, 0);
      });
    }

    renderList = (data) => (
      // Restrict the deletion of the last token
      <FlatList
        data={data}
        renderItem={({ item }) => <Item data={item} onValueChange={this.onSwitchValueChanged} />}
        keyExtractor={(item) => item.title}
      />
    )

    render() {
      const { isLoading, canSubmit } = this.state;
      const { navigation } = this.props;
      const bottomBtnText = this.isImportWallet ? 'button.IMPORT' : 'button.create';

      const bottomButton = (<Button text={bottomBtnText} onPress={this.onCreateButtonPress} disabled={!canSubmit} />);

      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn={false}
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.selectCurrency.title" />}
          customBottomButton={bottomButton}
        >
          <View style={[styles.sectionContainer]}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.selectCurrency.mainnet" />
            { this.renderList(this.mainnet) }
          </View>
          <View style={[styles.sectionContainer]}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.selectCurrency.testnet" />
            { this.renderList(this.testnet) }
          </View>
        </BasePageGereral>
      );
    }
}

WalletSelectCurrency.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({}),
  createKey: PropTypes.func.isRequired,
  resetWalletsUpdated: PropTypes.func.isRequired,
  isWalletsUpdated: PropTypes.bool.isRequired,
  addNotification: PropTypes.func.isRequired,
  addConfirmation: PropTypes.func.isRequired,
  showPasscode: PropTypes.func.isRequired,
  passcode: PropTypes.string,
};

WalletSelectCurrency.defaultProps = {
  walletManager: undefined,
  passcode: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  passcode: state.App.get('passcode'),
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (updateFields) => dispatch(appActions.updateUser(updateFields)),
  createKey: (name, phrases, coins, walletManager, derivationPaths) => dispatch(walletActions.createKey(name, phrases, coins, walletManager, derivationPaths)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  showPasscode: (category, callback) => dispatch(appActions.showPasscode(category, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectCurrency);

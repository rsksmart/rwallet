import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';
import _ from 'lodash';
import CoinTypeList from '../../components/wallet/coin.type.list';
import Loc from '../../components/common/misc/loc';
import appActions from '../../redux/app/actions';
import walletActions from '../../redux/wallet/actions';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import { createInfoNotification } from '../../common/notification.controller';
import config from '../../../config';
import coinType from '../../common/wallet/cointype';
import common from '../../common/common';

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
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
      this.state = { isLoading: false };
      this.phrase = navigation.state.params ? navigation.state.params.phrases : '';
      this.isImportWallet = !!this.phrase;
      this.onCreateButtonPress = this.onCreateButtonPress.bind(this);
      this.mainnet = [];
      this.testnet = [];
      const { consts: { supportedTokens } } = config;
      // Generate mainnet and testnet list data
      _.each(supportedTokens, (token) => {
        const item = { title: token, icon: coinType[token].icon };
        item.selected = true;
        this.mainnet.push(item);
        const testnetItem = { title: common.getSymbolName(token, 'Testnet'), icon: coinType[`${token}Testnet`].icon };
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
        const statckActions = StackActions.popToTop();
        navigation.dispatch(statckActions);
      }
    }

    // call resetWalletsUpdated when componentWillUnmount is safe.
    componentWillUnmount() {
      const { isWalletsUpdated, resetWalletsUpdated } = this.props;
      if (isWalletsUpdated) {
        resetWalletsUpdated();
      }
    }

    async onCreateButtonPress() {
      const { navigation } = this.props;
      const coins = [];
      for (let i = 0; i < this.mainnet.length; i += 1) {
        if (this.mainnet[i].selected) {
          coins.push({ symbol: this.mainnet[i].title, type: 'Mainnet' });
        }
      }
      for (let i = 0; i < this.testnet.length; i += 1) {
        if (this.testnet[i].selected) {
          coins.push({ symbol: this.mainnet[i].title, type: 'Testnet' });
        }
      }
      if (this.isImportWallet) {
        this.requestCreateWallet(this.phrase, coins);
      } else {
        navigation.navigate('RecoveryPhrase', { coins, shouldCreatePhrase: true, shouldVerifyPhrase: true });
      }
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

    render() {
      const { isLoading } = this.state;
      const { navigation } = this.props;
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          bottomBtnText="button.create"
          bottomBtnOnPress={this.onCreateButtonPress}
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.selectCurrency.title" />}
        >
          <View style={[styles.sectionContainer]}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.selectCurrency.mainnet" />
            <CoinTypeList data={this.mainnet} />
          </View>
          <View style={[styles.sectionContainer]}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.selectCurrency.testnet" />
            <CoinTypeList data={this.testnet} />
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
  showPasscode: (category, callback) => dispatch(appActions.showPasscode(category, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectCurrency);

import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StackActions } from 'react-navigation';
import CoinTypeList from '../../components/wallet/coin.type.list';
import Loc from '../../components/common/misc/loc';
import appActions from '../../redux/app/actions';
import walletActions from '../../redux/wallet/actions';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import { createInfoNotification } from '../../common/notification.controller';

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

const BTC = require('../../assets/images/icon/BTC.png');
const RBTC = require('../../assets/images/icon/RBTC.png');
const RIF = require('../../assets/images/icon/RIF.png');

class WalletSelectCurrency extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    mainnet = [
      {
        title: 'BTC',
        icon: BTC,
        selected: false,
      },
      {
        title: 'RBTC',
        icon: RBTC,
        selected: false,
      },
      {
        title: 'RIF',
        icon: RIF,
        selected: false,
      },
    ];

    testnet = [
      {
        title: 'BTC',
        icon: BTC,
        selected: true,
      },
      {
        title: 'RBTC',
        icon: RBTC,
        selected: true,
      },
      {
        title: 'RIF',
        icon: RIF,
        selected: true,
      },
    ];

    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.state = {
        isLoading: false,
      };
      this.isShowNotification = false;
      this.selectedCoins = null;
      this.phrase = navigation.state.params ? navigation.state.params.phrases : '';
      this.isImportWallet = !!this.phrase;
      this.onCreateButtonPress = this.onCreateButtonPress.bind(this);
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
          coins.push(this.mainnet[i].title);
        }
      }
      for (let i = 0; i < this.testnet.length; i += 1) {
        if (this.testnet[i].selected) {
          const coinId = `${this.mainnet[i].title}Testnet`;
          coins.push(coinId);
        }
      }
      this.selectedCoins = coins;
      if (this.isImportWallet) {
        this.requestCreateWallet(this.phrase, this.selectedCoins);
      } else {
        navigation.navigate('RecoveryPhrase', { coins: this.selectedCoins, shouldCreatePhrase: true, shouldCreateWallet: true });
      }
    }

    requestCreateWallet(phrase, coins) {
      const { addNotification, showPasscode } = this.props;
      if (global.passcode) {
        this.createWallet(phrase, coins);
      } else {
        const notification = createInfoNotification(
          'Please set a password',
          'Password can protect your funds if this device is stolen or compromised by malicious software.',
          null,
          () => showPasscode('create', () => this.createWallet(phrase, coins)),
        );
        addNotification(notification);
      }
    }

    createWallet(phrase, coins) {
      // createKey cost time, it will block ui.
      // So we let run at next tick, loading ui can present first.
      const { createKey, walletManager } = this.props;
      this.setState({ isLoading: true }, () => {
        setTimeout(() => {
          createKey(null, phrase, coins, walletManager);
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
};

WalletSelectCurrency.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  isShowNotification: state.App.get('showNotification'),
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (updateFields) => dispatch(appActions.updateUser(updateFields)),
  createKey: (name, phrases, coins, walletManager) => dispatch(walletActions.createKey(name, phrases, coins, walletManager)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  showPasscode: (category, callback) => dispatch(appActions.showPasscode(category, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectCurrency);

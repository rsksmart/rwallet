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
import createInfoConfirmation from '../../common/confirmation.controller';

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
      if (this.isImportWallet) {
        this.requestCreateWallet(this.phrase, coins);
      } else {
        navigation.navigate('RecoveryPhrase', { coins, shouldCreatePhrase: true, shouldCreateWallet: true });
      }
    }

    requestCreateWallet(phrase, coins) {
      const { addConfirmation, showPasscode } = this.props;
      if (global.passcode) {
        this.createWallet(phrase, coins);
      } else {
        const infoConfirmation = createInfoConfirmation(
          'Would you like to protect this wallet with a password?',
          'Encryption can protect your funds if this device is stolen or compromised by malicious software.',
          () => showPasscode('create', () => this.createWallet(phrase, coins)),
          () => this.createWallet(phrase, coins),
        );
        addConfirmation(infoConfirmation);
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
          bottomBtnText="CREATE"
          bottomBtnOnPress={this.onCreateButtonPress}
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="Select Wallet Currency" />}
        >
          <View style={[styles.sectionContainer]}>
            <Loc style={[styles.sectionTitle]} text="Mainnet" />
            <CoinTypeList data={this.mainnet} />
          </View>
          <View style={[styles.sectionContainer]}>
            <Loc style={[styles.sectionTitle]} text="Testnet" />
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
  addConfirmation: PropTypes.func.isRequired,
  showPasscode: PropTypes.func.isRequired,
};

WalletSelectCurrency.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (updateFields) => dispatch(appActions.updateUser(updateFields)),
  createKey: (name, phrases, coins, walletManager) => dispatch(walletActions.createKey(name, phrases, coins, walletManager)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  showPasscode: (category, callback) => dispatch(appActions.showPasscode(category, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectCurrency);

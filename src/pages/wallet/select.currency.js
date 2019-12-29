import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StackActions } from 'react-navigation';
import CoinTypeList from '../../components/wallet/coin.type.list';
import Button from '../../components/common/button/button';
import Loader from '../../components/common/misc/loader';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';
import walletActions from '../../redux/wallet/actions';
import flex from '../../assets/styles/layout.flex';

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
  },
  buttonView: {
    alignSelf: 'center',
    paddingVertical: 15,
  },
});

const BTC = require('../../assets/images/icon/BTC.png');
const RBTC = require('../../assets/images/icon/RBTC.png');
const RIF = require('../../assets/images/icon/RIF.png');

class WalletSelectCurrency extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    static async createWallet(phrases, coins, walletManager, createKey) {
      if (phrases) {
        createKey(null, phrases, coins, walletManager);
      } else {
        createKey(null, phrases, coins, walletManager);
      }
    }

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
      this.state = {
        loading: false,
      };
      this.onCreateButtonPress = this.onCreateButtonPress.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      const {
        navigation, wallets, isWalletsUpdated,
      } = nextProps;
      const phrases = navigation.state.params ? navigation.state.params.phrases : '';
      // isWalletsUpdated is true indicates wallet is added, the app will navigate to other page.
      if (isWalletsUpdated) {
        this.setState({ loading: false });
        // if phrases exsist, indicates the wallet is imported by phrase, the navigation pop to top
        // if phrases doesn't exsist, indicates the wallet is created by no phrase, navigate to 'RecoveryPhrase' page
        if (phrases) {
          const statckActions = StackActions.popToTop();
          navigation.dispatch(statckActions);
        } else {
          // the last wallet is created just now.
          const wallet = wallets[wallets.length - 1];
          navigation.navigate('RecoveryPhrase', { wallet });
        }
        // Don't resetWalletsUpdated here, it's too early, other pages will detected isWalletsUpdated is false.
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
      const {
        navigation, walletManager, createKey,
      } = this.props;
      const phrases = navigation.state.params ? navigation.state.params.phrases : '';
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
      this.setState({ loading: true });
      WalletSelectCurrency.createWallet(phrases, coins, walletManager, createKey);
    }


    render() {
      const { loading } = this.state;
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <ScrollView>
            <Header
              title="Select Wallet Currency"
              goBack={() => { navigation.goBack(); }}
            />
            <View style={[screenHelper.styles.body]}>
              <View style={[styles.sectionContainer, { marginTop: 15 }]}>
                <Loc style={[styles.sectionTitle]} text="Mainnet" />
                <CoinTypeList data={this.mainnet} />
              </View>
              <View style={[styles.sectionContainer, { marginTop: 15 }]}>
                <Loc style={[styles.sectionTitle]} text="Testnet" />
                <CoinTypeList data={this.testnet} />
              </View>
              <Loader loading={loading} />
            </View>
          </ScrollView>
          <View style={[styles.buttonView]}>
            <Button
              text="CREATE"
              onPress={this.onCreateButtonPress}
            />
          </View>
        </View>
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
  wallets: PropTypes.arrayOf(PropTypes.object),
  createKey: PropTypes.func.isRequired,
  resetWalletsUpdated: PropTypes.func.isRequired,
  isWalletsUpdated: PropTypes.bool.isRequired,
};

WalletSelectCurrency.defaultProps = {
  walletManager: undefined,
  wallets: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (updateFields) => dispatch(appActions.updateUser(updateFields)),
  createKey: (name, phrases, coins, walletManager) => dispatch(walletActions.createKey(name, phrases, coins, walletManager)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectCurrency);

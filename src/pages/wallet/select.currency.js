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
import SafeAreaView from '../../components/common/misc/safe.area.view';

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
      const {
        navigation, isWalletsUpdated,
      } = nextProps;
      // isWalletsUpdated is true indicates wallet is added, the app will navigate to other page.
      if (isWalletsUpdated) {
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
      const { navigation, createKey, walletManager } = this.props;
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
        this.setState({ isLoading: true });
        createKey(null, this.phrase, coins, walletManager);
      } else {
        navigation.navigate('RecoveryPhrase', { coins });
      }
    }


    render() {
      const { isLoading } = this.state;
      const { navigation } = this.props;
      return (
        <SafeAreaView style={[flex.flex1]}>
          <ScrollView>
            <Header title="Select Wallet Currency" goBack={() => navigation.goBack()} />
            <View style={[screenHelper.styles.body]}>
              <View style={[styles.sectionContainer, { marginTop: 15 }]}>
                <Loc style={[styles.sectionTitle]} text="Mainnet" />
                <CoinTypeList data={this.mainnet} />
              </View>
              <View style={[styles.sectionContainer, { marginTop: 15 }]}>
                <Loc style={[styles.sectionTitle]} text="Testnet" />
                <CoinTypeList data={this.testnet} />
              </View>
              <Loader loading={isLoading} />
            </View>
          </ScrollView>
          <View style={[styles.buttonView]}>
            <Button text="CREATE" onPress={this.onCreateButtonPress} />
          </View>
        </SafeAreaView>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectCurrency);

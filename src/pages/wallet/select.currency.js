import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StackActions, NavigationActions } from 'react-navigation';
import CoinTypeList from '../../components/wallet/coin.type.list';
import walletManager from '../../common/wallet/walletManager';
import Button from '../../components/common/button/button';
import Loader from '../../components/common/misc/loader';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';

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
    marginVertical: 20,
  },
});

const BTC = require('../../assets/images/icon/BTC.png');
const RBTC = require('../../assets/images/icon/RBTC.png');
const RIF = require('../../assets/images/icon/RIF.png');

class WalletSelectCurrency extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    static async createWallet(phrases, coins) {
      let wallet = null;
      if (phrases) {
        wallet = await walletManager.createWallet('imported', phrases, coins);
      } else {
        wallet = await walletManager.createWallet('randomName', phrases, coins);
      }
      return wallet;
    }

    mainnet = [
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

    async onCreateButtonPress() {
      const { navigation, updateUser } = this.props;
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
      const wallet = await WalletSelectCurrency.createWallet(phrases, coins);
      this.setState({ loading: false });
      updateUser();
      if (phrases) {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'WalletList' }),
          ],
        });
        navigation.dispatch(resetAction);
      } else {
        navigation.navigate('RecoveryPhrase', { wallet });
      }
    }


    render() {
      const { loading } = this.state;
      const { navigation } = this.props;
      return (
        <ScrollView>
          <Header
            title="Select Wallet Currency"
            goBack={navigation.goBack}
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
            <View style={styles.buttonView}>
              <Button
                text="CREATE"
                onPress={this.onCreateButtonPress}
              />
            </View>
            <Loader loading={loading} />
          </View>
        </ScrollView>
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
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  updateUser: () => dispatch(
    appActions.updateUser(),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectCurrency);

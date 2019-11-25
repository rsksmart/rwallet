import React, { Component } from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';


import { StackActions, NavigationActions } from 'react-navigation';
import flex from '../../assets/styles/layout.flex';
import CoinTypeList from '../../components/wallet/coin.type.list';
import Header from '../../components/common/misc/header';
import walletManager from '../../common/wallet/walletManager';
import Button from '../../components/common/button/button';
import Loader from '../../components/common/misc/loader';

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonView: {
    position: 'absolute',
    bottom: '10%',
  },
});

const BTC = require('../../assets/images/icon/BTC.png');
const RBTC = require('../../assets/images/icon/RBTC.png');
const RIF = require('../../assets/images/icon/RIF.png');

export default class WalletSelectCurrency extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    mainnet = [
      {
        id: '1',
        title: 'BTC',
        icon: BTC,
        selected: true,
      },
      {
        id: '2',
        title: 'RBTC',
        icon: RBTC,
        selected: true,
      },
      {
        id: '3',
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
    }

    render() {
      const { loading } = this.state;
      const { navigation } = this.props;
      const phrases = navigation.state.params ? navigation.state.params.phrases : '';
      return (
        <View style={[flex.flex1]}>
          <Header title="Select Wallet Currency" goBack={navigation.goBack} />
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Mainnet</Text>
            <CoinTypeList data={this.mainnet} />
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Loader loading={loading} />
            <View style={styles.buttonView}>
              <Button
                text="CREATE"
                onPress={async () => {
                  const coins = [];
                  for (let i = 0; i < this.mainnet.length; i += 1) {
                    if (this.mainnet[i].selected) {
                      coins.push(this.mainnet[i].title);
                    }
                  }
                  const wallet = walletManager.createWallet(phrases, null, coins);
                  if (phrases) {
                    this.setState({ loading: true });
                    await walletManager.addWallet(wallet);
                    this.setState({ loading: false });
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
                }}
              />
            </View>
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
};

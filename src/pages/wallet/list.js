import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { Card, CardItem, Body } from 'native-base';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Parse from 'parse/react-native';
import wm from '../../common/wallet/walletManager';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import flex from '../../assets/styles/layout.flex';

import walletActions from '../../redux/wallet/actions';
import config from '../../../config';

const { settings: { currency: currencySettings } } = config;

const header = require('../../assets/images/misc/header.png');

const DEFAULT_CURRENCY_SYMBOL = '$';

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 10,
  },
  sectionContainer: {
    paddingHorizontal: 10,
  },
  addAsset: {
    color: '#77869E',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addCircle: {
    marginLeft: 10,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 70,
  },
  headerView: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 200,
    left: 24,
    color: '#FFF',
  },
  headerBoard: {
    width: '85%',
    height: 165,
  },
  headerBoardView: {
    alignItems: 'center',
    marginTop: 115,
  },
  chevron: {
    color: '#FFF',
  },
  myAssetsTitle: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  myAssets: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000000',
    top: 40,
    left: 5,
  },
  myAssetsButtonsView: {
    position: 'absolute',
    top: 110,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ButtonView: {
    flexDirection: 'row',
    borderRightWidth: 1,
    borderColor: '#D1D1D1',
    marginLeft: 10,
    paddingRight: 10,
  },
  sendIcon: {
    color: '#6875B7',
  },
  receiveIcon: {
    color: '#6FC062',
  },
  swapIcon: {
    color: '#656667',
  },
  sendText: {
    color: '#6875B7',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  receiveText: {
    color: '#6FC062',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  swapText: {
    color: '#656667',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: 350,
    marginTop: -150,
  },
});

class WalletList extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.listData = [];
      this.state = {
        listData: this.listData,
        currencySymbols: {},
      };
      this.refreshData = this.refreshData.bind(this);
    }

    componentWillMount() {
      // Extract currency symbols from config
      // Generate {USD: '$', RMB: '￥', ARS: 'ARS$', KRW: '₩', JPY: '￥', GBP: '£',}
      const currencySymbols = _.reduce(currencySettings, (obj, row) => {
        const settingsObj = obj;
        settingsObj[row.name] = row.symbol;
        return settingsObj;
      }, {});

      this.setState({
        currencySymbols,
      });
    }

    componentDidMount() {
      const { getPrice } = this.props;
      getPrice(['BTC', 'RBTC', 'RIF']);
      this.refreshData();
    }

    componentWillReceiveProps(nextProps) {
      const { currency, wallets, prices } = nextProps;
      const { currency: oldCurrency } = this.props;
      const { getCurrencySymbol } = this;

      // Handle currency changed logic; get symbol string for the new currency
      if (currency !== oldCurrency) {
        getCurrencySymbol(currency);
      }

      console.log('wallets', wallets);
      console.log('prices', prices);
    }

    /**
           * Get currency symbol string for example '$' based on currency
           * @param {string} currency currency string such as 'USD'
           */
    getCurrencySymbol(currency) {
      const { currencySymbols } = this.state;

      if (currencySymbols[currency]) {
        return currencySymbols[currency];
      }

      return DEFAULT_CURRENCY_SYMBOL;
    }

    refreshData() {
      const { navigation } = this.props;
      this.wallets = wm.wallets;

      const updateValue = (item) => {
        if (item.price != null && item.amount !== '') {
          item.worth = `$${item.price * item.amount}`; // eslint-disable-line no-param-reassign
        }
      };

      const getBalance = (coin, item) => {
        const { queryKey } = coin;
        let { address } = coin;
        if (queryKey === 'TRSK' || queryKey === 'RSK' || queryKey === 'RIF' || queryKey === 'TRIF') {
          address = address.toLowerCase();
        }
        Parse.Cloud.run('getBalance', {
          name: queryKey,
          addr: address,
        }).then((result) => {
          console.log(result);
          item.amount = result; // eslint-disable-line no-param-reassign
          updateValue(item);
          this.setState({ listData: this.listData });
        }).catch((reason) => {
          console.log(reason);
        });
      };

      this.listData = [];
      this.wallets.forEach((wallet) => {
        const wal = { name: `Key ${wallet.id}`, coins: [] };
        wallet.coins.forEach((coin) => {
          const item = {
            key: `${Math.random()}`,
            title: coin.defaultName,
            text: coin.type,
            worth: '',
            amount: '',
            price: null,
            icon: coin.icon,
            r1Press: () => {
              navigation.navigate('Transfer');
            },
            r2Press: () => {
              navigation.navigate('WalletReceive', { address: coin.address, icon: coin.icon });
            },
            onPress: () => {
              navigation.navigate('WalletHistory', { address: coin.address });
            },
          };
          getBalance(coin, item);
          wal.coins.push(item);
        });
        this.listData.push(wal);
      });

      this.setState({
        listData: this.listData,
      });
    }

    render() {
      const { navigation } = this.props;
      const accounts = [];

      const { listData, currencySymbol } = this.state;

      for (let i = 0; i < listData.length; i += 1) {
        const item = listData[i];
        const section = (
          <View key={`${Math.random()}`}>
            <Text style={[styles.sectionTitle]}>{item.name}</Text>
            <SwipableButtonList data={item.coins} />
          </View>
        );
        accounts.push(section);
      }

      return (
        <View style={[flex.flex1]}>
          <ScrollView>
            <ImageBackground source={header} style={[styles.headerImage]}>
              <Text style={styles.headerTitle}>Your Wallet</Text>
            </ImageBackground>
            <View style={styles.headerBoardView}>
              <Card style={styles.headerBoard}>
                <CardItem>
                  <Body>
                    <Text style={styles.myAssetsTitle}>
My Assets (
                      {currencySymbol}
)
                    </Text>
                    <Text style={styles.myAssets}>173,586.3</Text>
                    <View style={styles.myAssetsButtonsView}>
                      <TouchableOpacity
                        style={styles.ButtonView}
                        onPress={() => {}}
                      >
                        <Entypo name="swap" size={20} style={styles.sendIcon} />
                        <Text style={styles.sendText}>Send</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.ButtonView}
                        onPress={() => {}}
                      >
                        <MaterialCommunityIcons name="arrow-down-bold-outline" size={20} style={styles.receiveIcon} />
                        <Text style={styles.receiveText}>Receive</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.ButtonView, { borderRightWidth: 0 }]}
                        onPress={() => {}}
                      >
                        <AntDesign name="switcher" size={20} style={styles.swapIcon} />
                        <Text style={styles.swapText}>Swap</Text>
                      </TouchableOpacity>
                    </View>
                  </Body>
                </CardItem>
              </Card>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={{
                color: '#000000', fontSize: 13, letterSpacing: 0.25, fontWeight: 'bold', marginLeft: 10, marginBottom: 10,
              }}
              >
                All Assets
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              {accounts}
            </View>
            <View style={styles.sectionContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('WalletAddIndex');
                }}
              >
                <View style={styles.addAsset}>
                  <Ionicons name="ios-add-circle-outline" size={35} style={styles.addCircle} />
                  <Text>Add Asset</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }
}

WalletList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  getPrice: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  wallets: PropTypes.arrayOf(PropTypes.object),
  prices: PropTypes.arrayOf(PropTypes.object),
};

WalletList.defaultProps = {
  wallets: [],
  prices: [],
};

const mapStateToProps = (state) => ({
  prices: state.App.get('prices'),
  currencies: state.App.get('currencies'),
});

const mapDispatchToProps = (dispatch) => ({
  getWallets: () => dispatch(walletActions.getWallets()),
  getPrice: (symbols, currencies) => dispatch(walletActions.getPrice(symbols, currencies)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);

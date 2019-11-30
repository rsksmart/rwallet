import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { Card, CardItem, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Parse from 'parse/react-native';
import { connect } from 'react-redux';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Loc from '../../components/common/misc/loc';
import flex from '../../assets/styles/layout.flex';

// import appActions from '../../redux/app/actions';
import { DEVICE } from '../../common/info';
import screenHelper from '../../common/screenHelper';
import walletActions from '../../redux/wallet/actions';
import config from '../../../config';

// currencySettings:
const { consts: { supportedTokens, currencies: currencySettings } } = config;

// import {createSuccessNotification, createInfoNotification, createWarningNotification, createErrorNotification} from '../../common/notification.controller'


const header = require('../../assets/images/misc/header.png');
const rsk = require('../../assets/images/mine/rsk.png');

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
    paddingHorizontal: 0,
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
    bottom: 120,
    left: 24,
    color: '#FFF',
  },
  headerBoard: {
    width: '85%',
    height: 110,
  },
  headerBoardView: {
    alignItems: 'center',
    marginTop: DEVICE.isIphoneX ? 115 + 24 : 115,
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
    height: screenHelper.headerHeight,
    marginTop: screenHelper.headerMarginTop,
  },
  assetsTitle: {
    color: '#000000', fontSize: 13, letterSpacing: 0.25, fontWeight: 'bold', marginLeft: 10, marginBottom: 10,
  },
  logoView: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  powerby: {
    color: '#727372',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 5,
  },
});

class WalletList extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    static calculateAssetTotalValue(wallets, currency, prices) {
      const assetTotalValue = _.reduce(wallets, (accumulator, item) => {
        const balance = item.balance || 0;
        const { coinType } = item;

        const match = _.find(prices, (price) => price.symbol === coinType);

        if (match) { // If found price value
          const priceValue = match[currency];
          const itemPrice = balance * priceValue;
          return accumulator + itemPrice;
        }

        return accumulator;
      }, 0);

      console.log('assetTotalValue', assetTotalValue);

      return assetTotalValue;
    }

    /**
     * Get currency symbol string for example '$' based on currency
     * @param {string} currency currency string such as 'USD'
     */
    static getCurrencySymbol(currency, currencySymbols) {
      if (currencySymbols[currency]) {
        return currencySymbols[currency];
      }

      return DEFAULT_CURRENCY_SYMBOL;
    }

    constructor(props) {
      super(props);
      this.listData = [];

      // Extract currency symbols from config
      // Generate {USD: '$', RMB: '￥', ARS: 'ARS$', KRW: '₩', JPY: '￥', GBP: '£',}
      this.currencySymbols = _.reduce(currencySettings, (obj, row) => {
        const settingsObj = obj;
        settingsObj[row.name] = row.symbol;
        return settingsObj;
      }, {});

      this.state = {
        listData: this.listData,
        currencySymbol: undefined,
        assetTotalValue: 0,
      };
      this.refreshData = this.refreshData.bind(this);
    }

    componentWillMount() {
      const {
        getPrice, currency, walletManager, prices,
      } = this.props;
      const { wallets } = walletManager;

      const currencyStrings = _.map(currencySettings, (item) => item.name);

      getPrice(supportedTokens, currencyStrings);

      const currencySymbol = WalletList.getCurrencySymbol(currency, this.currencySymbols);
      const assetTotalValue = WalletList.calculateAssetTotalValue(wallets, currency, prices);

      this.setState({
        currencySymbol,
        assetTotalValue,
      });
    }

    componentDidMount() {
      // this.refreshData();
    }

    componentWillReceiveProps(nextProps) {
      const { currency, prices, walletManager } = nextProps;
      // const { walletManager } = this.props;
      const { wallets } = walletManager;

      const newState = this.state;

      // Handle currency changed logic; get symbol string for the new currency
      newState.currencySymbol = WalletList.getCurrencySymbol(currency, this.currencySymbols);
      newState.assetTotalValue = WalletList.calculateAssetTotalValue(wallets, currency, prices);

      this.setState(newState);
    }


    refreshData() {
      const { navigation } = this.props;
      // this.wallets = wm.wallets;

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
              navigation.navigate('Transfer', { address: coin.address, coin: coin.type });
            },
            r2Press: () => {
              navigation.navigate('WalletReceive', { address: coin.address, icon: coin.icon, coin: coin.type });
            },
            onPress: () => {
              navigation.navigate('WalletHistory', {
                address: coin.address, coin: coin.type, name: coin.defaultName, network: 'Testnet',
              });
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

      const { listData, currencySymbol, assetTotalValue } = this.state;

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
          <ScrollView style={{ marginBottom: 45 }}>
            <ImageBackground source={header} style={[styles.headerImage]}>
              <Loc style={[styles.headerTitle]} text="Your Wallet" />
            </ImageBackground>
            <View style={styles.headerBoardView}>
              <Card style={styles.headerBoard}>
                <CardItem>
                  <Body>
                    <Text style={styles.myAssetsTitle}>
                      <Loc text="My Assets" />
                      {` (${currencySymbol})`}
                    </Text>
                    <Text style={styles.myAssets}>{assetTotalValue}</Text>
                  </Body>
                </CardItem>
              </Card>
            </View>
            <View style={{ width: '85%', alignSelf: 'center' }}>
              <View style={[styles.sectionContainer, { marginTop: 20 }]}>
                <Loc style={[styles.assetsTitle]} text="All Assets" />
              </View>
              <View style={styles.sectionContainer}>
                {accounts}
              </View>
              <View style={[styles.sectionContainer, { marginTop: 20 }]}>
                <TouchableOpacity
                  onPress={() => {
                  // addNotification(createSuccessNotification(
                  //     "Success",
                  //     "This message tells that everything goes fine."
                  // ));
                  // addNotification(createInfoNotification(
                  //     "Info",
                  //     "This message tells that something."
                  // ));
                  // addNotification(createWarningNotification(
                  //     "Warning",
                  //     "This message tells that alarm rising."
                  // ));
                  // addNotification(createErrorNotification(
                  //     "Error",
                  //     "This message tells that everything sucks."
                  // ));
                    navigation.navigate('WalletAddIndex');
                  }}
                >
                  <View style={styles.addAsset}>
                    <Ionicons name="ios-add-circle-outline" size={35} style={styles.addCircle} />
                    <Loc text="Add Asset" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <View style={styles.logoView}>
            <Text style={styles.powerby}>Powered by</Text>
            <Image source={rsk} />
          </View>
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
  // allCurrencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  wallets: PropTypes.arrayOf(PropTypes.object).isRequired,
  prices: PropTypes.arrayOf(PropTypes.object).isRequired,
  // addNotification: PropTypes.func.isRequired,
  walletManager: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

WalletList.defaultProps = {
};

const mapStateToProps = (state) => ({
  prices: state.App.get('prices'),
  currency: state.App.get('currency'),
  walletManager: state.App.get('walletManager'),
  // allCurrencies: state.App.get('allCurrencies'),
});

const mapDispatchToProps = (dispatch) => ({
  // getWallets: () => dispatch(walletActions.getWallets()),
  getPrice: (symbols, currencies) => dispatch(walletActions.getPrice(symbols, currencies)),
  // addNotification: (notification) => dispatch(
  //     appActions.addNotification(notification),
  // ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);

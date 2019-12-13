import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Image,
} from 'react-native';
import PropTypes from 'prop-types';
// import { Card, CardItem, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Loc from '../../components/common/misc/loc';
import flex from '../../assets/styles/layout.flex';

// import appActions from '../../redux/app/actions';
import { DEVICE } from '../../common/info';
import screenHelper from '../../common/screenHelper';
import walletActions from '../../redux/wallet/actions';
import config from '../../../config';
import ResponsiveText from '../../components/common/misc/responsive.text';

// currencySettings:
const { consts: { supportedTokens, currencies: currencySettings } } = config;

// import {createSuccessNotification, createInfoNotification, createWarningNotification, createErrorNotification} from '../../common/notification.controller'

const header = require('../../assets/images/misc/header.png');
const rsk = require('../../assets/images/mine/rsk.png');
const swap = require('../../assets/images/icon/swap.png');
const scan = require('../../assets/images/icon/scan.png');

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
    marginBottom: 20,
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
  scanView: {
    position: 'absolute',
    bottom: 120,
    right: 40,
  },
  scan: {
    width: 30,
    height: 30,
  },
  headerBoard: {
    width: '85%',
    height: 166,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '#FFF',
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
    top: 25,
    left: 30,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  myAssets: {
    marginTop: 63,
    marginHorizontal: 30,
  },
  myAssetsFontStyle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  myAssetsButtonsView: {
    position: 'absolute',
    bottom: 20,
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

/**
 * Formatting number with thousand separator.
 * @param  {number} num e.g. 1000000.65
 * @return {string}   "1,000,000.65"
 */
export function formatNumberThousands(num) {
  if (_.isUndefined(num)) {
    return num;
  }

  const numStr = num.toString();
  const parts = numStr.split('.');

  const decimalStr = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const period = _.isUndefined(parts[1]) ? '' : '.';
  const floatStr = _.isUndefined(parts[1]) ? '' : parts[1];

  return `${decimalStr}${period}${floatStr}`;
}

class WalletList extends Component {
    static navigationOptions = () => ({
      header: null,
    });

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

    /**
     * Transform from wallets to ListData for rendering
     */
    static createListData(wallets, currencySymbol, navigation) {
      console.log('list::createListData, wallets:', wallets);
      if (!_.isArray(wallets)) {
        return [];
      }

      const listData = [];
      wallets.forEach((wallet) => {
        const wal = { name: `Key ${wallet.id}`, coins: [] };
        wallet.coins.forEach((coin, index) => {
          const coinType = coin.id;
          let amountText = ' ';
          let valueText = ' ';
          console.log(`list::createListData, coin.symbol: ${coin.symbol}, coin.balance: ${coin.balance}`);
          if (coin.balance) {
            amountText = coin.balance.toString();
          }
          if (coin.balanceValue) {
            valueText = `${currencySymbol}${coin.balanceValue.decimalPlaces(2).toString()}`;
          }
          const item = {
            key: `${index}`,
            title: coin.defaultName,
            text: coinType,
            worth: valueText,
            amount: amountText,
            icon: coin.icon,
            r1Press: () => {
              navigation.navigate('Transfer', { wallet, coin });
            },
            r2Press: () => {
              navigation.navigate('WalletReceive', { address: coin.address, icon: coin.icon, coin: coinType });
            },
            onPress: () => {
              navigation.navigate('WalletHistory', { wallet, coin });
            },
          };
          wal.coins.push(item);
        });
        listData.push(wal);
      });

      return listData;
    }

    constructor(props) {
      super(props);

      // Extract currency symbols from config
      // Generate {USD: '$', RMB: '￥', ARS: 'ARS$', KRW: '₩', JPY: '￥', GBP: '£',}
      this.currencySymbols = _.reduce(currencySettings, (obj, row) => {
        const settingsObj = obj;
        settingsObj[row.name] = row.symbol;
        return settingsObj;
      }, {});

      this.state = {
        listData: [],
        currencySymbol: DEFAULT_CURRENCY_SYMBOL,
      };
    }

    componentWillMount() {
      const {
        getPrice, currency, wallets, navigation, fetchBalance, walletManager,
      } = this.props;

      console.log('list::componentWillMount, wallets:', wallets);

      // 1. Get balance of each token
      fetchBalance(walletManager);

      // 2. Get price of each token
      const currencyStrings = _.map(currencySettings, (item) => item.name);
      getPrice(supportedTokens, currencyStrings, currency);

      const currencySymbol = WalletList.getCurrencySymbol(currency, this.currencySymbols);
      const listData = WalletList.createListData(wallets, currencySymbol, navigation);

      this.setState({
        currencySymbol,
        listData,
      });
    }

    componentWillReceiveProps(nextProps) {
      const {
        currency, wallets, navigation, isBalanceUpdated, resetBalanceUpdated,
      } = nextProps;

      const newState = this.state;

      console.log('WalletList.componentWillReceiveProps: wallets,', wallets);

      // Handle currency changed logic; get symbol string for the new currency
      if (isBalanceUpdated) {
        newState.currencySymbol = WalletList.getCurrencySymbol(currency, this.currencySymbols);
        newState.listData = WalletList.createListData(wallets, newState.currencySymbol, navigation);
        resetBalanceUpdated();
      }
      this.setState(newState);
    }

    render() {
      const { navigation, totalAssetValue } = this.props;
      const { listData, currencySymbol } = this.state;
      const accounts = [];

      const totalAssetValueText = totalAssetValue.decimalPlaces(2).toString();

      for (let i = 0; i < listData.length; i += 1) {
        const item = listData[i];
        const section = (
          <View key={`${i}`}>
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
              <Loc style={[styles.headerTitle]} text="Your Wallet" />
              <TouchableOpacity
                style={styles.scanView}
                onPress={() => {
                  // TODO: transfer from first wallet
                  // navigation.navigate('Transfer', { address: coin.address, coin: coinType });
                  navigation.navigate('Scan', {
                    onQrcodeDetected: (data) => {
                      const parseUrl = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
                      const url = data;
                      const result = parseUrl.exec(url);
                      const host = result[3];
                      const [address2, coin2] = host.split('.');
                      console.log(`address2: ${address2}, coin: ${coin2},`);
                      // TODO: transfer from first wallet
                      // navigation.navigate('Transfer', { address: coin.address, coin: coinType });
                    },
                  });
                }}
              >
                <Image style={[styles.scan]} source={scan} />
              </TouchableOpacity>
            </ImageBackground>
            <View style={styles.headerBoardView}>
              <View style={styles.headerBoard}>
                <Text style={styles.myAssetsTitle}>
                  <Loc text="My Assets" />
                  {` (${currencySymbol})`}
                </Text>
                <ResponsiveText style={[styles.myAssets]} fontStyle={[styles.myAssetsFontStyle]} maxFontSize={35}>{`${totalAssetValueText}`}</ResponsiveText>
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
                    <Image source={swap} style={{ width: 17, height: 17 }} />
                    <Text style={styles.swapText}>Swap</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ width: '85%', alignSelf: 'center' }}>
              <View style={[styles.sectionContainer, { marginTop: 30 }]}>
                <Loc style={[styles.assetsTitle]} text="All Assets" />
              </View>
              <View style={styles.sectionContainer}>
                {accounts}
              </View>
              <View style={[styles.sectionContainer, { marginTop: 20 }]}>
                <TouchableOpacity
                  onPress={() => {
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
  wallets: PropTypes.arrayOf(PropTypes.object),
  totalAssetValue: PropTypes.shape({
    decimalPlaces: PropTypes.func.isRequired,
  }),
  fetchBalance: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  walletManager: PropTypes.object,
  // addNotification: PropTypes.func.isRequired,
  // allCurrencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  isBalanceUpdated: PropTypes.bool.isRequired,
  resetBalanceUpdated: PropTypes.func.isRequired,
};

WalletList.defaultProps = {
  wallets: undefined,
  totalAssetValue: new BigNumber(0),
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  totalAssetValue: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').assetValue,
  isBalanceUpdated: state.Wallet.get('isBalanceUpdated'),
  // allCurrencies: state.App.get('allCurrencies'),
});

const mapDispatchToProps = (dispatch) => ({
  // getWallets: () => dispatch(walletActions.getWallets()),
  getPrice: (symbols, currencies, currency) => dispatch(walletActions.getPrice(symbols, currencies, currency)),
  fetchBalance: (walletManager) => dispatch(walletActions.fetchBalance(walletManager)),
  resetBalanceUpdated: () => dispatch(walletActions.resetBalanceUpdated()),
  // addNotification: (notification) => dispatch(
  //     appActions.addNotification(notification),
  // ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);

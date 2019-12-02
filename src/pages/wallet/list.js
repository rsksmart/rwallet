import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { Card, CardItem, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
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
    height: 166,
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
    static createListData(wallets, navigation) {
      if (!_.isArray(wallets)) {
        return [];
      }

      const listData = [];
      wallets.forEach((wallet) => {
        const wal = { name: `Key ${wallet.id}`, coins: [] };
        wallet.coins.forEach((coin) => {
          const coinType = coin.id;

          const item = {
            key: `${Math.random()}`,
            title: coin.defaultName,
            text: coinType,
            worth: '',
            amount: '',
            price: null,
            icon: coin.icon,
            r1Press: () => {
              navigation.navigate('Transfer', { address: coin.address, coin: coinType });
            },
            r2Press: () => {
              navigation.navigate('WalletReceive', { address: coin.address, icon: coin.icon, coin: coinType });
            },
            onPress: () => {
              navigation.navigate('WalletHistory', {
                address: coin.address, coin: coinType, name: coin.defaultName, network: 'Testnet',
              });
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
        getPrice, currency, wallets, navigation,
      } = this.props;

      const currencyStrings = _.map(currencySettings, (item) => item.name);
      getPrice(supportedTokens, currencyStrings, currency);

      const currencySymbol = WalletList.getCurrencySymbol(currency, this.currencySymbols);
      const listData = WalletList.createListData(wallets, navigation);

      this.setState({
        currencySymbol,
        listData,
      });
    }

    componentWillReceiveProps(nextProps) {
      const {
        currency, wallets, prices, navigation,
      } = nextProps;

      const newState = this.state;

      console.log('WalletList.componentWillReceiveProps: wallets,', wallets);
      console.log('WalletList.componentWillReceiveProps: prices,', prices);

      // Handle currency changed logic; get symbol string for the new currency
      newState.currencySymbol = WalletList.getCurrencySymbol(currency, this.currencySymbols);
      newState.listData = WalletList.createListData(wallets, navigation);

      this.setState(newState);
    }

    render() {
      const { navigation, totalAssetValue } = this.props;
      const { listData, currencySymbol } = this.state;
      const accounts = [];

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
                    <Text style={styles.myAssets}>{formatNumberThousands(totalAssetValue)}</Text>
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
  totalAssetValue: PropTypes.number,
  prices: PropTypes.arrayOf(PropTypes.object),
  // addNotification: PropTypes.func.isRequired,
  // allCurrencies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

WalletList.defaultProps = {
  wallets: undefined,
  prices: [],
  totalAssetValue: 0,
};

const mapStateToProps = (state) => ({
  prices: state.App.get('prices'),
  currency: state.App.get('currency'),
  wallets: state.App.get('walletManager') && state.App.get('walletManager').wallets,
  totalAssetValue: state.App.get('walletManager') && state.App.get('walletManager').totalAssetValue,
  // allCurrencies: state.App.get('allCurrencies'),
});

const mapDispatchToProps = (dispatch) => ({
  // getWallets: () => dispatch(walletActions.getWallets()),
  getPrice: (symbols, currencies, currency) => dispatch(walletActions.getPrice(symbols, currencies, currency)),
  // addNotification: (notification) => dispatch(
  //     appActions.addNotification(notification),
  // ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);

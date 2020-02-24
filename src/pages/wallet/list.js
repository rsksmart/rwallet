import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';

import RSKad from '../../components/common/rsk.ad';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Loc from '../../components/common/misc/loc';
import ResponsiveText from '../../components/common/misc/responsive.text';
import common from '../../common/common';
import BasePageGereral from '../base/base.page.general';
import ListPageHeader from '../../components/headers/header.listpage';
import coinListItemStyles from '../../assets/styles/coin.listitem.styles';
import walletActions from '../../redux/wallet/actions';

const send = require('../../assets/images/icon/send.png');
const receive = require('../../assets/images/icon/receive.png');
const swap = require('../../assets/images/icon/swap.png');
const scan = require('../../assets/images/icon/scan.png');

const { getCurrencySymbol } = common;

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 0,
  },
  addAsset: {
    color: '#77869E',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 50,
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
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
    letterSpacing: 0.39,
    lineHeight: 28,
    position: 'absolute',
    bottom: 120,
    left: 24,
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
    marginTop: -95,
  },
  chevron: {
    color: '#FFF',
  },
  myAssetsTitle: {
    position: 'absolute',
    top: 25,
    left: 30,
    fontWeight: '500',
    fontSize: 15,
    color: '#000000',
  },
  myAssets: {
    marginTop: 57,
    marginHorizontal: 30,
  },
  myAssetsText: {
    color: '#000000',
    fontFamily: 'Avenir-Black',
    fontSize: 35,
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
    fontFamily: 'Avenir-Medium',
    fontSize: 13,
    letterSpacing: 0.25,
    marginLeft: 10,
  },
  receiveText: {
    color: '#6FC062',
    fontFamily: 'Avenir-Medium',
    fontSize: 13,
    letterSpacing: 0.25,
    marginLeft: 10,
  },
  swapText: {
    color: '#656667',
    fontFamily: 'Avenir-Medium',
    fontSize: 13,
    letterSpacing: 0.25,
    marginLeft: 10,
  },
  assetsTitle: {
    color: '#000000', fontSize: 13, letterSpacing: 0.25, fontWeight: 'bold', marginLeft: 10, marginBottom: 20,
  },
  logoView: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 50,
    width: '100%',
  },
  powerby: {
    color: '#727372',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 5,
  },
  spliteLine: {
    borderRightWidth: 1,
    borderColor: '#D1D1D1',
    height: 15,
    marginBottom: 2,
    marginLeft: 20,
    marginRight: 20,
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
   * Returns number string based on walletManager.assetValue; 0 as default value
   */
  static getTotalAssetValueText(walletManager) {
    let assetValue = new BigNumber(0);
    if (walletManager) {
      assetValue = walletManager && walletManager.assetValue;
    }

    return common.getAssetValueString(assetValue);
  }

  /**
   * Transform from wallets to ListData for rendering
   */

  static accountListView(listData) {
    return (
      <FlatList
        data={listData}
        renderItem={({ item }) => (
          <View style={coinListItemStyles.itemView}>
            <Text style={[coinListItemStyles.sectionTitle]}>{item.name}</Text>
            <SwipableButtonList data={item.coins} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      listData: [],
      currencySymbol: getCurrencySymbol(props.currency),
      totalAssetValueText: '',
    };
  }

  componentWillMount() {
    const {
      currency, walletManager, navigation,
    } = this.props;

    this.onSwapPress = this.onSwapPress.bind(this);

    const { wallets } = walletManager;

    const currencySymbol = getCurrencySymbol(currency);
    const listData = this.createListData(wallets, currencySymbol, navigation);
    const totalAssetValueText = WalletList.getTotalAssetValueText(walletManager);

    this.setState({
      currencySymbol,
      listData,
      totalAssetValueText,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      updateTimestamp, currency, navigation, walletManager,
    } = nextProps;

    const { wallets } = walletManager;
    const {
      updateTimestamp: lastUpdateTimeStamp,
    } = this.props;

    const newState = this.state;

    // Update currency symbol such as $
    newState.currencySymbol = getCurrencySymbol(currency);

    if (updateTimestamp !== lastUpdateTimeStamp) {
      newState.listData = this.createListData(wallets, newState.currencySymbol, navigation);
      newState.totalAssetValueText = WalletList.getTotalAssetValueText(walletManager);
    }

    this.setState(newState);
  }

  onSwapPress() {
    const { resetSwap, navigation } = this.props;
    resetSwap();
    navigation.navigate('SwapSelection', { selectionType: 'source', init: true });
  }

  createListData(wallets, currencySymbol, navigation) {
    const { resetSwap, setSwapSource } = this.props;
    if (!_.isArray(wallets)) {
      return [];
    }

    const listData = [];

    // Create element for each wallet (e.g. key 0)
    wallets.forEach((wallet) => {
      const wal = { name: wallet.name, coins: [] };
      // Create element for each Token (e.g. BTC, RBTC, RIF, DOC)
      wallet.coins.forEach((coin, index) => {
        const coinType = common.getSymbolFullName(coin.symbol, coin.type);
        const amountText = coin.balance ? common.getBalanceString(coin.symbol, coin.balance) : '';
        const worthText = coin.balanceValue ? `${currencySymbol}${common.getAssetValueString(coin.balanceValue)}` : currencySymbol;
        const item = {
          key: `${index}`,
          title: coin.defaultName,
          text: coinType,
          worth: worthText,
          amount: amountText,
          icon: coin.icon,
          onPress: () => {
            navigation.navigate('WalletHistory', { wallet, coin });
          },
          r1Press: () => {
            navigation.navigate('Transfer', { wallet, coin });
          },
          r2Press: () => {
            navigation.navigate('WalletReceive', { address: coin.address, icon: coin.icon, coin: coinType });
          },
          onSwapButtonPress: () => {
            resetSwap();
            setSwapSource(wallet.name, coin);
            navigation.navigate('Swap', { coin });
          },
        };
        wal.coins.push(item);
      });
      listData.push(wal);
    });

    return listData;
  }


  render() {
    const { navigation } = this.props;
    const {
      listData, currencySymbol, totalAssetValueText,
    } = this.state;
    const scanButton = (
      <TouchableOpacity style={styles.scanView} onPress={() => navigation.navigate('Scan')}>
        <Image style={[styles.scan]} source={scan} />
      </TouchableOpacity>
    );
    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        renderAccessory={() => <RSKad />}
        headerComponent={<ListPageHeader title="page.wallet.list.title" customRightButton={scanButton} />}
      >
        <View style={styles.headerBoardView}>
          <View style={styles.headerBoard}>
            <Text style={styles.myAssetsTitle}>
              <Loc text="page.wallet.list.myAssets" />
              {` (${currencySymbol})`}
            </Text>
            <ResponsiveText layoutStyle={styles.myAssets} fontStyle={styles.myAssetsText} maxFontSize={35}>{totalAssetValueText}</ResponsiveText>
            <View style={styles.myAssetsButtonsView}>
              <TouchableOpacity
                style={styles.ButtonView}
                onPress={() => navigation.navigate('SelectWallet', { operation: 'send' })}
              >
                <Image source={send} />
                <Loc style={[styles.sendText]} text="button.Send" />
              </TouchableOpacity>
              <View style={styles.spliteLine} />
              <TouchableOpacity
                style={styles.ButtonView}
                onPress={() => navigation.navigate('SelectWallet', { operation: 'receive' })}
              >
                <Image source={receive} />
                <Loc style={[styles.receiveText]} text="button.Receive" />
              </TouchableOpacity>
              <View style={styles.spliteLine} />
              <TouchableOpacity
                style={[styles.ButtonView, { borderRightWidth: 0 }]}
                onPress={this.onSwapPress}
              >
                <Image source={swap} />
                <Loc style={[styles.swapText]} text="button.Swap" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ width: '85%', alignSelf: 'center' }}>
          <View style={[styles.sectionContainer, { marginTop: 30 }]}>
            <Loc style={[styles.assetsTitle]} text="page.wallet.list.allAssets" />
          </View>
          <View style={styles.sectionContainer}>
            {WalletList.accountListView(listData)}
          </View>
          <View style={[styles.sectionContainer, { marginTop: -5 }]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('WalletAddIndex', { skipPasscode: true });
              }}
            >
              <View style={styles.addAsset}>
                <Ionicons name="ios-add-circle-outline" size={35} style={styles.addCircle} />
                <Loc text="page.wallet.list.addAsset" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BasePageGereral>
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
  currency: PropTypes.string.isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }),
  updateTimestamp: PropTypes.number.isRequired,
  resetSwap: PropTypes.func.isRequired,
  setSwapSource: PropTypes.func.isRequired,
};

WalletList.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
});

const mapDispatchToProps = (dispatch) => ({
  setSwapSource: (walletName, coin) => dispatch(walletActions.setSwapSource(walletName, coin)),
  resetSwap: () => dispatch(walletActions.resetSwap()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);

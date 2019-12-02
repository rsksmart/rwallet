import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Image,
} from 'react-native';
import PropTypes from 'prop-types';
// import { Card, CardItem, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Parse from 'parse/react-native';
import { connect } from 'react-redux';
import wm from '../../common/wallet/walletManager';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Loc from '../../components/common/misc/loc';
import flex from '../../assets/styles/layout.flex';
import appActions from '../../redux/app/actions';
import { DEVICE } from '../../common/info';
import screenHelper from '../../common/screenHelper';

// import {createSuccessNotification, createInfoNotification, createWarningNotification, createErrorNotification} from '../../common/notification.controller'

const header = require('../../assets/images/misc/header.png');
const rsk = require('../../assets/images/mine/rsk.png');
const swap = require('../../assets/images/icon/swap.png');
const scan = require('../../assets/images/icon/scan.png');


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
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000000',
    top: 63,
    left: 30,
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

class WalletList extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.listData = [];
      this.state = {
        listData: this.listData,
      };
      this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
      const { getPrice } = this.props;
      getPrice(['BTC', 'RBTC', 'RIF']);
      this.refreshData();
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
      const { navigation, currency } = this.props;
      // const { addNotification } = this.props;
      const accounts = [];
      const { listData } = this.state;
      const currencySymbols = {
        USD: '$', RMB: '￥', ARS: 'ARS$', KRW: '₩', JPY: '￥', GBP: '£',
      };
      const currencySymbol = currencySymbols[currency];
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
              <TouchableOpacity
                style={styles.scanView}
                onPress={() => {}}
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
  // addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  prices: state.App.get('prices'),
  currency: state.App.get('currency'),
});

const mapDispatchToProps = (dispatch) => ({
  getPrice: (symbols) => dispatch(
    appActions.getPrice(symbols),
  ),
  // addNotification: (notification) => dispatch(
  //     appActions.addNotification(notification),
  // ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);

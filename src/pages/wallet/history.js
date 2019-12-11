import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, FlatList, RefreshControl, ActivityIndicator, ImageBackground,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import BigNumber from 'bignumber.js';
import appActions from '../../redux/app/actions';
import Loc from '../../components/common/misc/loc';
import { DEVICE } from '../../common/info';
import screenHelper from '../../common/screenHelper';
import common from '../../common/common';

const header = require('../../assets/images/misc/header.png');
const sending = require('../../assets/images/icon/sending.png');


const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 10,
  },
  sectionContainer: {
    paddingHorizontal: 30,
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
    bottom: 101,
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
    left: 54,
    color: '#FFF',
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
  myAssets: {
    fontSize: 35,
    fontWeight: '900',
    letterSpacing: 2.92,
    color: '#000000',
    marginTop: 17,
    marginLeft: 25,
  },
  assetsValue: {
    marginTop: 10,
    marginLeft: 25,
    color: '#000000',
    fontSize: 15,
    letterSpacing: 0.94,
  },
  sending: {
    marginLeft: 5,
    color: '#000000',
    fontSize: 15,
    letterSpacing: 0.94,
  },
  myAssetsButtonsView: {
    marginTop: 13,
    marginLeft: 15,
    width: '100%',
    flexDirection: 'row',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    paddingBottom: 13,
    paddingTop: 10,
  },
  rowRightR1: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowRightR2: {
    position: 'absolute',
    right: 0,
  },
  title: {
    fontSize: 16,
    letterSpacing: 0.33,
    color: '#000000',
  },
  amount: {
    alignSelf: 'flex-end',
    color: '#000000',
    fontWeight: '900',
    letterSpacing: 1,
  },
  datetime: {
    color: '#939393',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: screenHelper.headerHeight,
    marginTop: screenHelper.headerMarginTop,
  },
  recent: {
    color: '#000000',
    fontSize: 13,
    letterSpacing: 0.25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sendingView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
    marginTop: 7,
  },
  sendingIcon: {
    width: 15,
    height: 15,
  },
  refreshControl: {
    zIndex: 10000,
  },
  footerIndicator: {
    marginVertical: 20,
  },
});

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y
    >= contentSize.height - paddingToBottom;
};

const getStateIcon = (state) => {
  let icon = null;
  if (state === 'Sent') {
    icon = <SimpleLineIcons name="arrow-up-circle" size={30} style={{ color: '#6875B7' }} />;
  } else if (state === 'Received') {
    icon = <SimpleLineIcons name="arrow-down-circle" size={30} style={{ color: '#6FC062' }} />;
  } else if (state === 'Sending') {
    icon = <Image source={sending} />;
  }
  return icon;
};

function Item({
  title, amount, datetime,
}) {
  const icon = getStateIcon(title);
  return (
    <View style={[styles.row]}>
      {icon}
      <View style={styles.rowRight}>
        <View style={[styles.rowRightR1]}>
          <Loc style={[styles.title]} text={title} />
        </View>
        <View style={[styles.rowRightR2]}>
          <Text style={styles.amount}>{amount}</Text>
          <Text style={styles.datetime}>{datetime}</Text>
        </View>
      </View>
    </View>
  );
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  datetime: PropTypes.string.isRequired,
};

class History extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  listData = [];

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { wallet, coin } = navigation.state.params;

    this.state = {
      sendingCoin: '0',
      sendingCoinValue: '0',
      isRefreshing: false,
      isLoadMore: false,
      symbol: coin.symbol,
      type: coin.type,
      balanceText: '',
      balanceValue: '',
      coinId: coin.id,
    };
    this.walletId = wallet.id;
    this.price = 0;
    this.address = coin.address;
    this.balance = coin.balance;
    this.allTransactions = [];
    this.listView = <ActivityIndicator size="small" color="#00ff00" />;
    this.page = 1;
    this.onRefresh = this.onRefresh.bind(this);
    this.refreshControl = this.refreshControl.bind(this);
    this.onSendButtonClick = this.onSendButtonClick.bind(this);
    this.onReceiveButtonClick = this.onReceiveButtonClick.bind(this);
    this.onbackClick = this.onbackClick.bind(this);
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
  }

  componentWillMount() {
    const { prices } = this.props;
    this.getPrice(prices);
    this.calcBalance();
    this.getTransactions(1);
  }

  componentWillReceiveProps(nextProps) {
    const {
      transactions, prices, wallets,
    } = nextProps;
    const { symbol } = this.state;
    const { transactions: curTransactions } = this.props;
    const curPrice = this.price;
    const { isLoadMore } = this.state;
    console.log('WalletList.componentWillReceiveProps: prices,', prices);
    console.log('WalletList.componentWillReceiveProps: wallets,', wallets);
    this.getPrice(prices);
    if (curPrice !== this.price) {
      this.calcBalance();
    }
    if (curPrice !== this.price || transactions !== curTransactions) {
      this.setState({ isRefreshing: false });
      if (transactions) {
        if (isLoadMore) {
          this.setState({ isLoadMore: false });
          if (transactions.length !== 0) {
            this.page += 1;
            this.allTransactions = this.allTransactions.concat(transactions);
          }
        } else if (transactions.length > 0) {
          this.allTransactions = transactions;
        }
        this.generateListView(this.allTransactions, symbol);
        this.calcSendingCoin(this.allTransactions);
      }
    }
    if (curPrice !== this.price) {
      this.calcSendingCoin(this.allTransactions);
    }
  }

  onRefresh() {
    this.page = 1;
    this.setState({ isRefreshing: true });
    this.getTransactions(1);
  }

  onEndReached() {
    console.log('history::onEndReached');
    const { isLoadMore } = this.state;
    if (isLoadMore) {
      return;
    }
    this.setState({ isLoadMore: true });
    this.getTransactions(this.page + 1);
  }

  onSendButtonClick() {
    const { navigation } = this.props;
    navigation.navigate('Transfer', navigation.state.params);
  }

  onReceiveButtonClick() {
    const { navigation } = this.props;
    navigation.navigate('WalletReceive', navigation.state.params);
  }

  static onScroll({ nativeEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      // console.log('ScrollView isCloseToBottom');
    }
  }

  onMomentumScrollEnd(e) {
    // console.log('ScrollView onMomentumScrollEnd');
    const offsetY = e.nativeEvent.contentOffset.y; // scroll distance
    const contentSizeHeight = e.nativeEvent.contentSize.height; // scrollView contentSize height
    const oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; // scrollView height
    if (offsetY + oriageScrollHeight >= contentSizeHeight) {
      this.onEndReached();
    }
  }

  onbackClick() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  getTransactions(page) {
    const { getTransactions } = this.props;
    const { symbol, type, address } = this.state;
    getTransactions(symbol, type, address, page);
  }

  getPrice(prices) {
    const { symbol } = this.state;
    if (!prices) {
      return;
    }
    let price = 0;
    const { currency } = this.props;
    for (let i = 0; i < prices.length; i += 1) {
      const item = prices[i];
      if (item.symbol === symbol) {
        price = item.price[currency];
        break;
      }
    }
    this.price = price;
  }

  calcBalance() {
    const { symbol } = this.state;
    const balanceHex = this.balance;
    const balance = common.convertHexToCoinAmount(symbol, balanceHex);
    const balanceText = balance.toString();
    const value = balance.times(this.price);
    const balanceValue = value.decimalPlaces(2).toString();
    this.setState({ balanceText, balanceValue });
  }

  calcSendingCoin(transactions) {
    const { price } = this;
    if (!transactions) {
      return;
    }
    let sendingCoin = new BigNumber(0);
    transactions.forEach((transaction) => {
      if (transaction.state === 'Sending') {
        sendingCoin = sendingCoin.plus(transaction.amount);
      }
    });
    const sendingCoinValue = sendingCoin.times(price).decimalPlaces(2).toString();
    this.setState({ sendingCoinValue });
    const state = { sendingCoin: sendingCoin.toString() };
    if (price) {
      state.sendingCoinValue = sendingCoin.times(price).decimalPlaces(2).toString();
    }
    this.setState(state);
  }

  generateListView(transactions, symbol) {
    if (!transactions) {
      return;
    }
    this.listView = (
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <Item
            title={item.state}
            icon={item.icon}
            amount={`${item.amount}${symbol}`}
            datetime={item.datetime}
            onPress={item.onPress}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  refreshControl() {
    const { isRefreshing } = this.state;
    return (
      <RefreshControl
        style={styles.refreshControl}
        refreshing={isRefreshing}
        onRefresh={this.onRefresh}
        title="Loading..."
      />
    );
  }

  renderfooter() {
    const { isLoadMore } = this.state;
    let footer = null;
    if (isLoadMore) {
      footer = <ActivityIndicator style={styles.footerIndicator} size="small" color="#00ff00" />;
    }
    return footer;
  }

  render() {
    const { currency } = this.props;

    const {
      sendingCoin, sendingCoinValue, balanceText, symbol, balanceValue, coinId,
    } = this.state;
    return (
      <ScrollView
        refreshControl={this.refreshControl()}
        onScroll={History.onScroll}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        scrollEventThrottle={400}
      >
        <ImageBackground source={header} style={[styles.headerImage]}>
          <Text style={[styles.headerTitle]}>{coinId}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={this.onbackClick}
          >
            <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
          </TouchableOpacity>
        </ImageBackground>
        <View style={styles.headerBoardView}>
          <View style={styles.headerBoard}>
            <Text style={styles.myAssets}>{`${balanceText} ${symbol}`}</Text>
            <Text style={styles.assetsValue}>{`${balanceValue} ${currency}`}</Text>
            <View style={styles.sendingView}>
              <Image style={styles.sendingIcon} source={sending} />
              <Text style={styles.sending}>{`${sendingCoin}${symbol} (${sendingCoinValue}${currency})`}</Text>
            </View>
            <View style={styles.myAssetsButtonsView}>
              <TouchableOpacity
                style={styles.ButtonView}
                onPress={this.onSendButtonClick}
              >
                <Entypo name="swap" size={20} style={styles.sendIcon} />
                <Loc style={[styles.sendText]} text="Send" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ButtonView, { borderRightWidth: 0 }]}
                onPress={this.onReceiveButtonClick}
              >
                <MaterialCommunityIcons name="arrow-down-bold-outline" size={20} style={styles.receiveIcon} />
                <Loc style={[styles.sendText]} text="Receive" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[styles.sectionContainer, { marginTop: 30 }]}>
          <Text style={styles.recent}>Recent</Text>
        </View>
        <View style={styles.sectionContainer}>
          {this.listView}
        </View>
        {this.renderfooter()}
      </ScrollView>
    );
  }
}

History.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  getTransactions: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  prices: PropTypes.arrayOf(PropTypes.shape({})),
  transactions: PropTypes.arrayOf(PropTypes.shape({})),
  wallets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

History.defaultProps = {
  transactions: null,
  prices: null,
};

const mapStateToProps = (state) => ({
  transactions: state.App.get('transactions'),
  currency: state.App.get('currency'),
  prices: state.Wallet.get('prices'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
});

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (symbol, type, address, page) => dispatch(
    appActions.getTransactions(symbol, type, address, page),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);

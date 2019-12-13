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
import moment from 'moment';
import walletActions from '../../redux/wallet/actions';
import Loc from '../../components/common/misc/loc';
import { DEVICE } from '../../common/info';
import screenHelper from '../../common/screenHelper';
import ResponsiveText from '../../components/common/misc/responsive.text';
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
    marginTop: 17,
    marginHorizontal: 25,
  },
  myAssetsFontStyle: {
    fontWeight: '900',
    color: '#000000',
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
  } else if (state === 'Receiving') {
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

  static createListData(transactions, symbol, address) {
    console.log('History::createListData');
    if (!transactions) {
      return [];
    }
    const items = [];
    transactions.forEach((transaction) => {
      const amount = common.convertHexToCoinAmount(symbol, transaction.value);
      const amountText = `${amount.toFixed()} ${symbol}`;
      let datetime = transaction.createdAt;
      let isComfirmed = true;
      let isSender = false;
      if (address === transaction.from) {
        isSender = true;
      }
      if (transaction.blockHeight === -1) {
        isComfirmed = false;
      }
      let state = '';
      if (isSender) {
        if (isComfirmed) {
          state = 'Sent';
        } else {
          state = 'Sending';
        }
      } else if (isComfirmed) {
        state = 'Received';
      } else {
        state = 'Receiving';
      }
      datetime = moment(datetime).format('MMM D. YYYY');
      items.push({ state, datetime, amount: amountText });
    });
    return items;
  }

  static listView(listData) {
    if (!listData) {
      return <ActivityIndicator size="small" color="#00ff00" />;
    }
    return (
      <FlatList
        data={listData}
        renderItem={({ item }) => (
          <Item
            title={item.state}
            amount={item.amount}
            datetime={item.datetime}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { coin } = navigation.state.params;

    this.state = {
      sendingCoin: '0',
      sendingCoinValue: '0',
      isRefreshing: false,
      isLoadMore: false,
      symbol: coin.symbol,
      balanceText: '',
      balanceValueText: '',
      coinId: coin.id,
      listData: null,
    };
    this.coin = coin;
    this.price = 0;
    this.page = 1;
    this.onRefresh = this.onRefresh.bind(this);
    this.refreshControl = this.refreshControl.bind(this);
    this.onSendButtonClick = this.onSendButtonClick.bind(this);
    this.onReceiveButtonClick = this.onReceiveButtonClick.bind(this);
    this.onbackClick = this.onbackClick.bind(this);
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
  }

  componentWillMount() {
    const { prices, fetchTransaction, walletManager } = this.props;
    this.getPrice(prices);
    fetchTransaction(walletManager);
    this.generateBalanceText();
  }

  componentWillReceiveProps(nextProps) {
    const {
      prices, wallets, isTransactionUpdated, resetTransactionUpdated,
    } = nextProps;
    const { symbol } = this.state;
    // const { transactions: curTransactions } = this.props;
    // const { isLoadMore } = this.state;
    console.log('History.componentWillReceiveProps: prices,', prices);
    console.log('History.componentWillReceiveProps: wallets,', wallets);
    console.log('History.componentWillReceiveProps: isTransactionUpdated,', isTransactionUpdated);
    this.generateBalanceText();
    const newState = this.state;
    if (isTransactionUpdated) {
      newState.listData = History.createListData(this.coin.transactions, symbol);
      resetTransactionUpdated();
    }
    this.setState(newState);
  }

  onRefresh() {
    this.page = 1;
    this.setState({ isRefreshing: true });
  }

  onEndReached() {
    console.log('history::onEndReached');
    const { isLoadMore } = this.state;
    if (isLoadMore) {
      return;
    }
    this.setState({ isLoadMore: true });
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

  generateBalanceText() {
    let balanceText = ' ';
    let balanceValueText = ' ';
    if (this.coin.balance) {
      balanceText = this.coin.balance.toFixed();
    }
    if (this.coin.balanceValue) {
      balanceValueText = this.coin.balanceValue.decimalPlaces(2).toFixed();
    }
    this.setState({ balanceText, balanceValueText });
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
      sendingCoin, sendingCoinValue, symbol, balanceText, balanceValueText, coinId, listData,
    } = this.state;

    return (
      <ScrollView>
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
            <ResponsiveText style={[styles.myAssets]} fontStyle={[styles.myAssetsFontStyle]} maxFontSize={35}>{`${balanceText} ${symbol}`}</ResponsiveText>
            <Text style={styles.assetsValue}>{`${balanceValueText} ${currency}`}</Text>
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
          {History.listView(listData)}
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
  currency: PropTypes.string.isRequired,
  prices: PropTypes.arrayOf(PropTypes.shape({})),
  wallets: PropTypes.arrayOf(PropTypes.object).isRequired,
  // isBalanceUpdated: PropTypes.bool.isRequired,
  // resetBalanceUpdated: PropTypes.func.isRequired,
  fetchTransaction: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  walletManager: PropTypes.object,
  isTransactionUpdated: PropTypes.bool.isRequired,
  resetTransactionUpdated: PropTypes.func.isRequired,
};

History.defaultProps = {
  prices: null,
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  prices: state.Wallet.get('prices'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  walletManager: state.Wallet.get('walletManager'),
  isBalanceUpdated: state.Wallet.get('isBalanceUpdated'),
  isTransactionUpdated: state.Wallet.get('isTransactionUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  resetBalanceUpdated: () => dispatch(walletActions.resetBalanceUpdated()),
  fetchTransaction: (walletManager) => dispatch(walletActions.fetchTransaction(walletManager)),
  resetTransactionUpdated: () => dispatch(walletActions.resetTransactionUpdated()),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);

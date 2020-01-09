import React, { Component } from 'react';
import _ from 'lodash';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, FlatList, RefreshControl, ActivityIndicator, ImageBackground,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import Loc from '../../components/common/misc/loc';
import { DEVICE } from '../../common/info';
import screenHelper from '../../common/screenHelper';
import ResponsiveText from '../../components/common/misc/responsive.text';
import common from '../../common/common';

const { getCurrencySymbol } = common;

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
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    left: 15,
    bottom: 15,
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
  noTransNotice: {
    textAlign: 'center',
  },
  stateIcon: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

const TRANSACTION_TIMEOUT_MINUTES = 15;

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y
    >= contentSize.height - paddingToBottom;
};

const getStateIcon = (state) => {
  let icon = null;
  if (state === 'Sent') {
    icon = <SimpleLineIcons name="arrow-up-circle" size={30} style={[{ color: '#6875B7' }]} />;
  } else if (state === 'Received') {
    icon = <SimpleLineIcons name="arrow-down-circle" size={30} style={[{ color: '#6FC062' }]} />;
  } else if (state === 'Receiving') {
    icon = <SimpleLineIcons name="arrow-down-circle" size={30} style={[{ color: '#6FC062' }]} />;
  } else if (state === 'Sending') {
    icon = <Image source={sending} />;
  } else if (state === 'Failed') {
    icon = <MaterialIcons name="error-outline" size={36} style={[{ color: '#E73934' }]} />;
  }
  const item = (
    <View style={[styles.stateIcon]}>{icon}</View>
  );
  return item;
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

const isFailedTransaction = (createdAt) => {
  const durationMinutes = moment.duration(moment().diff(createdAt)).asMinutes();
  return durationMinutes >= TRANSACTION_TIMEOUT_MINUTES;
};

class History extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  /**
  * Returns transactions, pendingBalance, pendingBalanceValue
  * @param {array} rawTransactions
  * @param {string} address
  * @param {string} symbol
  * @param {string} currency
  * @param {array} prices
  * @returns {object} { transactions, pendingBalance, pendingBalanceValue }
  */
  static processRawTransactions(rawTransactions, address, symbol, currency, prices) {
    if (_.isEmpty(rawTransactions)) {
      return { transactions: [], pendingBalance: null, pendingBalanceValue: null };
    }
    let pendingBalance = new BigNumber(0);
    const transactions = [];
    _.each(rawTransactions, (transaction) => {
      let amountText = ' ';
      let amount = null;
      let datetime = transaction.createdAt;
      let isComfirmed = true;
      let isSender = false;
      let state = 'Receiving';
      if (transaction.value) {
        amount = common.convertUnitToCoinAmount(symbol, transaction.value);
        amountText = `${common.getBalanceString(symbol, amount)} ${symbol}`;
      }
      if (address === transaction.from) {
        isSender = true;
      }
      if (transaction.blockHeight === -1) {
        isComfirmed = false;
      }
      if (isSender) {
        if (isComfirmed) {
          state = 'Sent';
          datetime = transaction.confirmedAt;
        } else {
          state = 'Sending';
          if (transaction.createdAt) {
            const isFailed = isFailedTransaction(transaction.createdAt);
            state = isFailed ? 'Failed' : state;
          }
        }
      } else if (isComfirmed) {
        state = 'Received';
        datetime = transaction.confirmedAt;
      } else if (transaction.createdAt) {
        const isFailed = isFailedTransaction(transaction.createdAt);
        state = isFailed ? 'Failed' : state;
      }
      if (datetime) {
        datetime = moment(datetime).format('MMM D. YYYY');
      } else {
        datetime = '';
      }
      transactions.push({ state, datetime, amountText });
      if (state === 'Receiving' && !_.isNull(amount)) {
        pendingBalance = pendingBalance.plus(amount);
      }
    });
    const pendingBalanceValue = common.getCoinValue(pendingBalance, symbol, currency, prices);
    return { transactions, pendingBalance, pendingBalanceValue };
  }

  static listView(listData) {
    if (!listData) {
      return <ActivityIndicator size="small" color="#00ff00" />;
    }
    if (listData.length === 0) {
      return <Loc style={[styles.noTransNotice]} text="There is no transaction found in this wallet" />;
    }
    return (
      <FlatList
        data={listData}
        renderItem={({ item }) => (
          <Item
            title={item.state}
            amount={item.amountText}
            datetime={item.datetime}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,
      isLoadMore: false,
      listData: null,
      balanceText: null,
      balanceValueText: null,
      pendingBalanceText: null,
      pendingBalanceValueText: null,
    };

    this.page = 1;

    this.onRefresh = this.onRefresh.bind(this);
    this.refreshControl = this.refreshControl.bind(this);
    this.onSendButtonClick = this.onSendButtonClick.bind(this);
    this.onReceiveButtonClick = this.onReceiveButtonClick.bind(this);
    this.onbackClick = this.onbackClick.bind(this);
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
  }

  static getBalanceText(symbol, balance) {
    let balanceText = '0';

    if (!_.isUndefined(balance)) {
      balanceText = `${common.getBalanceString(symbol, balance)}`;
    }

    return balanceText;
  }

  static getAssetValueText(balanceValue) {
    let assetValueText = '0';

    if (!_.isUndefined(balanceValue)) {
      assetValueText = `${common.getAssetValueString(balanceValue)}`;
    }

    return assetValueText;
  }

  static getBalanceTexts(balance, balanceValue, pendingBalance, pendingBalanceValue, symbol, currency) {
    const currencySymbol = getCurrencySymbol(currency);
    const balanceText = `${History.getBalanceText(symbol, balance)} ${symbol}`;
    const balanceValueText = `${currencySymbol}${History.getAssetValueText(balanceValue)}`;
    const pendingBalanceText = pendingBalance && !pendingBalance.isEqualTo(0) ? `${History.getBalanceText(symbol, pendingBalance)} ${symbol}` : '';
    const pendingBalanceValueText = pendingBalanceValue ? `${currencySymbol}${History.getAssetValueText(pendingBalanceValue)}` : '';
    return {
      balanceText, balanceValueText, pendingBalanceText, pendingBalanceValueText,
    };
  }

  componentDidMount() {
    const { currency, prices, navigation } = this.props;
    const { coin } = navigation.state.params;
    const {
      balance, balanceValue, transactions, address, symbol,
    } = coin;
    const { pendingBalance, pendingBalanceValue, transactions: listData } = History.processRawTransactions(transactions, address, symbol, currency, prices);
    const balanceTexts = History.getBalanceTexts(balance, balanceValue, pendingBalance, pendingBalanceValue, symbol, currency);
    this.setState({ listData, ...balanceTexts });
  }

  componentWillReceiveProps(nextProps) {
    const {
      updateTimestamp, navigation, currency, prices,
    } = nextProps;
    const { updateTimestamp: lastUpdateTimestamp, prices: lastPrices, currency: lastCurrency } = this.props;
    const { coin } = navigation.state.params;
    if ((updateTimestamp !== lastUpdateTimestamp || prices !== lastPrices || currency !== lastCurrency) && coin) {
      const {
        balance, balanceValue, transactions, address, symbol,
      } = coin;
      const { pendingBalance, pendingBalanceValue, transactions: listData } = History.processRawTransactions(transactions, address, symbol, currency, prices);
      const balanceTexts = History.getBalanceTexts(balance, balanceValue, pendingBalance, pendingBalanceValue, symbol, currency);
      this.setState({ listData, ...balanceTexts });
    }
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

  static renderPendingBalance(pendingBalanceText, pendingBalanceValueText) {
    if (_.isEmpty(pendingBalanceText)) {
      return null;
    }
    return (
      <View style={styles.sendingView}>
        <Image style={styles.sendingIcon} source={sending} />
        <Text style={styles.sending}>{`${pendingBalanceText} (${pendingBalanceValueText})`}</Text>
      </View>
    );
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
    const {
      balanceText, balanceValueText, pendingBalanceText, pendingBalanceValueText, listData,
    } = this.state;
    const { navigation } = this.props;
    const { coin } = navigation.state.params;

    const symbol = coin && coin.symbol;
    const type = coin && coin.type;

    return (
      <ScrollView>
        <ImageBackground source={header} style={[styles.headerImage]}>
          <Text style={[styles.headerTitle]}>
            {symbol}
            {' '}
            {type === 'Testnet' ? type : ''}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={this.onbackClick}
          >
            <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
          </TouchableOpacity>
        </ImageBackground>
        <View style={styles.headerBoardView}>
          <View style={styles.headerBoard}>
            <ResponsiveText style={[styles.myAssets]} fontStyle={[styles.myAssetsFontStyle]} maxFontSize={35}>{balanceText}</ResponsiveText>
            <Text style={styles.assetsValue}>{balanceValueText}</Text>
            {History.renderPendingBalance(pendingBalanceText, pendingBalanceValueText)}
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
          <Loc style={[styles.recent]} text="Recent" />
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
  walletManager: PropTypes.shape({}),
  updateTimestamp: PropTypes.number.isRequired,
  prices: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

History.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
  prices: state.Wallet.get('prices'),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(History);

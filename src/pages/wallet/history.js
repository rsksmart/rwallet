import React, { Component } from 'react';
import _ from 'lodash';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, RefreshControl, ActivityIndicator,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import Loc from '../../components/common/misc/loc';
import ResponsiveText from '../../components/common/misc/responsive.text';
import common from '../../common/common';
import HistoryHeader from '../../components/headers/header.history';
import BasePageSimple from '../base/base.page.simple';
import { strings } from '../../common/i18n';
import definitions from '../../common/definitions';
import screenHelper from '../../common/screenHelper';
import flex from '../../assets/styles/layout.flex';
import walletActions from '../../redux/wallet/actions';

const { getCurrencySymbol } = common;

const sending = require('../../assets/images/icon/sending.png');
const send = require('../../assets/images/icon/send.png');
const receive = require('../../assets/images/icon/receive.png');

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
    marginTop: -76,
  },
  myAssets: {
    marginTop: 17,
    marginHorizontal: 25,
  },
  myAssetsText: {
    color: '#000000',
    fontFamily: 'Avenir-Black',
  },
  assetsValue: {
    color: '#000000',
    fontFamily: 'Avenir-Roman',
    fontSize: 15,
    letterSpacing: 0.94,
    marginTop: 4,
    marginLeft: 25,
  },
  sending: {
    color: '#000000',
    fontFamily: 'Avenir-Roman',
    fontSize: 15,
    letterSpacing: 0.94,
    marginLeft: 5,
  },
  myAssetsButtonsView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 30,
    bottom: 17,
  },
  ButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D8D8D8',
    marginLeft: 20,
    paddingBottom: 9,
    paddingTop: 11,
  },
  rowRightR1: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowRightR2: {
    right: 0,
    flexDirection: 'column',
  },
  title: {
    color: '#000000',
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
    letterSpacing: 0.33,
  },
  amount: {
    color: '#000000',
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
    letterSpacing: 1,
    alignSelf: 'flex-end',
  },
  datetime: {
    color: '#939393',
    fontFamily: 'Avenir-Roman',
    fontSize: 12,
    letterSpacing: 0,
    alignSelf: 'flex-end',
    marginTop: 4,
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
    marginTop: 4,
  },
  sendingIcon: {
    width: 14,
    height: 14,
  },
  refreshControl: {
    zIndex: 10000,
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 10 + screenHelper.topHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
  iconView: {
    alignItems: 'center',
    width: 34,
    marginTop: 6,
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

const stateIcons = {
  Sent: <SimpleLineIcons name="arrow-up-circle" size={30} style={[{ color: '#6875B7' }]} />,
  Sending: <Image source={sending} />,
  Received: <SimpleLineIcons name="arrow-down-circle" size={30} style={[{ color: '#6FC062' }]} />,
  Receiving: <Image source={sending} />,
  Failed: <MaterialIcons name="error-outline" size={36} style={[{ color: '#E73934' }]} />,
};

function Item({
  title, amount, datetime, onPress,
}) {
  const icon = stateIcons[title];
  return (
    <TouchableOpacity style={[styles.row]} onPress={onPress}>
      <View style={styles.iconView}>{icon}</View>
      <View style={[styles.rowRight]}>
        <View style={[styles.rowRightR1]}>
          <Loc style={[styles.title]} text={`txState.${title}`} />
        </View>
        <View style={[styles.rowRightR2]}>
          <Text style={styles.amount}>{amount}</Text>
          <Text style={styles.datetime}>{datetime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  datetime: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
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
  static processRawTransactions(rawTransactions, address, symbol, type, decimalPlaces, currency, prices) {
    if (_.isEmpty(rawTransactions)) {
      const result = { pendingBalance: null, pendingBalanceValue: null };
      result.transactions = rawTransactions ? [] : null;
      return result;
    }
    let pendingBalance = new BigNumber(0);
    const transactions = [];
    _.each(rawTransactions, (transaction) => {
      let amountText = ' ';
      let amount = null;
      const isSender = address === transaction.from;
      let state = 'Failed';
      switch (transaction.status) {
        case definitions.txStatus.PENDING:
          state = isSender ? 'Sending' : 'Receiving';
          break;
        case definitions.txStatus.SUCCESS:
          state = isSender ? 'Sent' : 'Received';
          break;
        default:
      }
      const datetime = transaction.status === definitions.txStatus.SUCCESS ? transaction.confirmedAt : transaction.createdAt;
      let datetimeText = '';
      if (datetime) {
        const daysElapsed = moment().diff(datetime, 'days');
        if (daysElapsed < 1) {
          datetimeText = datetime.fromNow();
        } else {
          datetimeText = datetime.format('MMM D. YYYY');
        }
      }

      if (transaction.value) {
        amount = common.convertUnitToCoinAmount(symbol, transaction.value);
        amountText = `${common.getBalanceString(amount, decimalPlaces)} ${common.getSymbolName(symbol, type)}`;
      }
      transactions.push({
        state,
        datetime,
        datetimeText,
        amountText,
        rawTransaction: transaction,
        decimalPlaces,
      });
      if (state === 'Receiving' && !_.isNull(amount)) {
        pendingBalance = pendingBalance.plus(amount);
      }
    });
    const pendingBalanceValue = common.getCoinValue(pendingBalance, symbol, currency, prices);
    return { transactions, pendingBalance, pendingBalanceValue };
  }

  constructor(props) {
    super(props);

    const { navigation } = props;
    this.coin = navigation.state.params.coin;

    this.state = {
      isRefreshing: false,
      isLoadMore: false,
      listData: null,
      balanceText: null,
      balanceValueText: null,
      pendingBalanceText: null,
      pendingBalanceValueText: null,
      fetchTxTimestamp: undefined, // Record the timestamp of the request
    };

    this.refreshControl = this.refreshControl.bind(this);
    this.onSendButtonClick = this.onSendButtonClick.bind(this);
    this.onReceiveButtonClick = this.onReceiveButtonClick.bind(this);
    this.onbackClick = this.onbackClick.bind(this);
    this.onListItemPress = this.onListItemPress.bind(this);

    // Avoid triggering onEndReached multiple times
    // https://github.com/facebook/react-native/issues/14015
    this.isOnEndReachedCalledDuringMomentum = false;
  }

  static getBalanceText(symbol, balance, decimalPlaces) {
    let balanceText = '0';

    if (!_.isUndefined(balance)) {
      balanceText = `${common.getBalanceString(balance, decimalPlaces)}`;
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

  static getBalanceTexts(balance, balanceValue, pendingBalance, pendingBalanceValue, symbol, type, decimalPlaces, currency) {
    const symbolName = common.getSymbolName(symbol, type);
    const currencySymbol = getCurrencySymbol(currency);
    const balanceText = `${History.getBalanceText(symbol, balance, decimalPlaces)} ${symbolName}`;
    const balanceValueText = `${currencySymbol}${History.getAssetValueText(balanceValue)}`;
    const pendingBalanceText = pendingBalance && !pendingBalance.isEqualTo(0) ? `${History.getBalanceText(symbol, pendingBalance, decimalPlaces)} ${symbolName}` : null;
    const pendingBalanceValueText = pendingBalanceValue ? `${currencySymbol}${History.getAssetValueText(pendingBalanceValue)}` : null;
    return {
      balanceText, balanceValueText, pendingBalanceText, pendingBalanceValueText,
    };
  }

  componentDidMount() {
    const { currency, prices, fetchTransactions } = this.props;
    const {
      balance, balanceValue, transactions, address, symbol, type, decimalPlaces,
    } = this.coin;
    const { pendingBalance, pendingBalanceValue, transactions: listData } = History.processRawTransactions(transactions, address, symbol, type, decimalPlaces, currency, prices);
    const balanceTexts = History.getBalanceTexts(balance, balanceValue, pendingBalance, pendingBalanceValue, symbol, type, decimalPlaces, currency);
    this.setState({ listData, ...balanceTexts });
    if (_.isEmpty(transactions)) {
      this.setState({ isRefreshing: true });
      const params = {
        token: this.coin,
        fetchCount: 10,
        skipCount: 0,
        timestamp: (new Date()).getTime(),
      };
      fetchTransactions(params);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      updateTimestamp, currency, prices, txTimestamp,
    } = nextProps;
    const { updateTimestamp: lastUpdateTimestamp, prices: lastPrices, currency: lastCurrency } = this.props;
    const { fetchTxTimestamp } = this.state;
    if ((updateTimestamp !== lastUpdateTimestamp || prices !== lastPrices || currency !== lastCurrency) && this.coin) {
      const {
        balance, balanceValue, transactions, address, symbol, type, decimalPlaces,
      } = this.coin;
      const { pendingBalance, pendingBalanceValue, transactions: listData } = History.processRawTransactions(transactions, address, symbol, type, decimalPlaces, currency, prices);
      const balanceTexts = History.getBalanceTexts(balance, balanceValue, pendingBalance, pendingBalanceValue, symbol, type, decimalPlaces, currency);

      // When txTimestamp === fetchTxTimestamp, the new data is retrieved and isLoadMore is marked as false.
      if (txTimestamp === fetchTxTimestamp) {
        this.setState({ isLoadMore: false });
      }

      this.setState({
        listData,
        ...balanceTexts,
        isRefreshing: updateTimestamp === lastUpdateTimestamp,
      });
    }
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    // simulate 1s network delay
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 1000);
  }

  onEndReached = () => {
    const { fetchTransactions } = this.props;
    const { isLoadMore, listData } = this.state;
    // In these cases, the operation of loading more should not be executed.
    // 1. the list data is empty
    // 2. It's loading more
    // 3. When FlatList momentum scroll, the onEndReached function is called before.
    if (_.isEmpty(listData) || isLoadMore || this.isOnEndReachedCalledDuringMomentum) {
      return;
    }
    this.isOnEndReachedCalledDuringMomentum = true;
    // Record the request time so that you can check whether it is the latest request during the callback
    const timestamp = (new Date()).getTime();
    this.setState({ fetchTxTimestamp: timestamp, isLoadMore: true }, () => {
      const params = {
        token: this.coin,
        fetchCount: 10,
        skipCount: 0,
        timestamp,
      };
      fetchTransactions(params);
    });
  }

  onSendButtonClick() {
    const { navigation } = this.props;
    navigation.navigate('Transfer', navigation.state.params);
  }

  onReceiveButtonClick() {
    const { navigation } = this.props;
    navigation.navigate('WalletReceive', navigation.state.params);
  }

  onMomentumScrollBegin = () => {
    const { isLoadMore } = this.state;
    if (!isLoadMore) {
      this.isOnEndReachedCalledDuringMomentum = false;
    }
  }

  onbackClick() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  onListItemPress(index) {
    const { listData } = this.state;
    const { navigation } = this.props;
    const item = listData[index];
    navigation.navigate('Transaction', item);
  }

  renderHeader = (listData, isRefreshing) => {
    if (listData && listData.length === 0 && !isRefreshing) {
      return <Loc style={[styles.noTransNotice]} text="page.wallet.history.noTransNote" />;
    }
    return null;
  }

  listView = (listData, onPress, isRefreshing) => (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={listData}
      renderItem={({ item, index }) => (
        <Item
          title={item.state}
          amount={item.amountText}
          datetime={item.datetimeText}
          onPress={() => { onPress(index); }}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={(
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={this.onRefresh}
        />
        )}
      ListHeaderComponent={this.renderHeader(listData, isRefreshing)}
      ListFooterComponent={this.renderFooter}
      onEndReached={this.onEndReached}
      onEndReachedThreshold={0.5}
      onMomentumScrollBegin={this.onMomentumScrollBegin}
    />
  );

  refreshControl() {
    const { isRefreshing } = this.state;
    return (
      <RefreshControl
        style={styles.refreshControl}
        refreshing={isRefreshing}
        onRefresh={this.onRefresh}
        title={strings('page.wallet.history.loading')}
      />
    );
  }

  renderFooter = () => {
    const { isLoadMore } = this.state;
    return (
      <View style={styles.footer}>
        {isLoadMore && (
          <ActivityIndicator size="small" />
        )}
      </View>
    );
  }

  render() {
    const {
      balanceText, balanceValueText, pendingBalanceText, pendingBalanceValueText, listData, isRefreshing,
    } = this.state;
    const { navigation } = this.props;

    const symbol = this.coin && this.coin.symbol;
    const type = this.coin && this.coin.type;
    const symbolName = common.getSymbolName(symbol, type);

    return (
      <BasePageSimple headerComponent={<HistoryHeader title={symbolName} onBackButtonPress={() => navigation.goBack()} />}>
        <View style={styles.headerBoardView}>
          <View style={styles.headerBoard}>
            <ResponsiveText layoutStyle={styles.myAssets} fontStyle={styles.myAssetsText} maxFontSize={35}>{balanceText}</ResponsiveText>
            <Text style={styles.assetsValue}>{balanceValueText}</Text>
            {
              pendingBalanceText && (
                <View style={styles.sendingView}>
                  <Image style={styles.sendingIcon} source={sending} />
                  <Text style={styles.sending}>
                    {pendingBalanceText}
                    {pendingBalanceValueText && `(${pendingBalanceValueText})`}
                  </Text>
                </View>
              )
            }
            <View style={styles.myAssetsButtonsView}>
              <TouchableOpacity
                style={styles.ButtonView}
                onPress={this.onSendButtonClick}
              >
                <Image source={send} />
                <Loc style={[styles.sendText]} text="button.Send" />
              </TouchableOpacity>
              <View style={styles.spliteLine} />
              <TouchableOpacity
                style={[styles.ButtonView]}
                onPress={this.onReceiveButtonClick}
              >
                <Image source={receive} />
                <Loc style={[styles.receiveText]} text="button.Receive" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[styles.sectionContainer, { marginTop: 30 }]}>
          <Loc style={[styles.recent]} text="page.wallet.history.recent" />
        </View>
        <View style={[styles.sectionContainer, flex.flex1]}>
          {this.listView(listData, this.onListItemPress, isRefreshing)}
        </View>
      </BasePageSimple>
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
  fetchTransactions: PropTypes.func.isRequired,
  txTimestamp: PropTypes.number,
};

History.defaultProps = {
  walletManager: undefined,
  txTimestamp: undefined,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
  prices: state.Price.get('prices'),
  language: state.App.get('language'),
  txTimestamp: state.Wallet.get('txTimestamp'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchTransactions: (params) => dispatch(walletActions.fetchTransactions(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);

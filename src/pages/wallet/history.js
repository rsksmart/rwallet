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
import presetStyles from '../../assets/styles/style';
import screenHelper from '../../common/screenHelper';
import flex from '../../assets/styles/layout.flex';

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
  lastRow: {
    marginBottom: 17 + screenHelper.bottomHeight,
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
  title, amount, datetime, onPress, isLastRow,
}) {
  const icon = stateIcons[title];
  return (
    <TouchableOpacity style={[styles.row, isLastRow ? styles.lastRow : null]} onPress={onPress}>
      <View style={styles.iconView}>{icon}</View>
      <View style={[styles.rowRight, isLastRow ? presetStyles.noBottomBorder : null]}>
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
  isLastRow: PropTypes.bool.isRequired,
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
  static processRawTransactions(rawTransactions, address, symbol, decimalPlaces, currency, prices) {
    if (_.isEmpty(rawTransactions)) {
      return { transactions: [], pendingBalance: null, pendingBalanceValue: null };
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
        amountText = `${common.getBalanceString(amount, decimalPlaces)} ${symbol}`;
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
    this.onListItemPress = this.onListItemPress.bind(this);
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

  static getBalanceTexts(balance, balanceValue, pendingBalance, pendingBalanceValue, symbol, decimalPlaces, currency) {
    const currencySymbol = getCurrencySymbol(currency);
    const balanceText = `${History.getBalanceText(symbol, balance, decimalPlaces)} ${symbol}`;
    const balanceValueText = `${currencySymbol}${History.getAssetValueText(balanceValue)}`;
    const pendingBalanceText = pendingBalance && !pendingBalance.isEqualTo(0) ? `${History.getBalanceText(symbol, pendingBalance, decimalPlaces)} ${symbol}` : null;
    const pendingBalanceValueText = pendingBalanceValue ? `${currencySymbol}${History.getAssetValueText(pendingBalanceValue)}` : null;
    return {
      balanceText, balanceValueText, pendingBalanceText, pendingBalanceValueText,
    };
  }

  componentDidMount() {
    const { currency, prices, navigation } = this.props;
    const { coin } = navigation.state.params;
    const {
      balance, balanceValue, transactions, address, symbol, decimalPlaces,
    } = coin;
    const { pendingBalance, pendingBalanceValue, transactions: listData } = History.processRawTransactions(transactions, address, symbol, decimalPlaces, currency, prices);
    const balanceTexts = History.getBalanceTexts(balance, balanceValue, pendingBalance, pendingBalanceValue, symbol, decimalPlaces, currency, decimalPlaces);
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
        balance, balanceValue, transactions, address, symbol, decimalPlaces,
      } = coin;
      const { pendingBalance, pendingBalanceValue, transactions: listData } = History.processRawTransactions(transactions, address, symbol, decimalPlaces, currency, prices);
      const balanceTexts = History.getBalanceTexts(balance, balanceValue, pendingBalance, pendingBalanceValue, symbol, decimalPlaces, currency);
      this.setState({ listData, ...balanceTexts });
    }
  }

  onRefresh() {
    this.page = 1;
    this.setState({ isRefreshing: true });
    // simulate 1s network delay
    setTimeout(() => {
      this.setState({ isRefreshing: false });
    }, 1000);
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

  onListItemPress(index) {
    const { listData } = this.state;
    const { navigation } = this.props;
    const item = listData[index];
    navigation.navigate('Transaction', item);
  }

  listView = (listData, onPress, isRefreshing) => {
    if (!listData) {
      return <ActivityIndicator size="small" color="#00ff00" />;
    }
    if (listData.length === 0) {
      return <Loc style={[styles.noTransNotice]} text="page.wallet.history.noTransNote" />;
    }

    const refreshControl = (
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={this.onRefresh}
      />
    );

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listData}
        renderItem={({ item, index }) => (
          <Item
            title={item.state}
            amount={item.amountText}
            datetime={item.datetimeText}
            onPress={() => { onPress(index); }}
            isLastRow={index === listData.length - 1}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={refreshControl}
      />
    );
  };

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

  renderFooter() {
    const { isLoadMore } = this.state;
    let footer = null;
    if (isLoadMore) {
      footer = <ActivityIndicator style={styles.footerIndicator} size="small" color="#00ff00" />;
    }
    return footer;
  }

  render() {
    const {
      balanceText, balanceValueText, pendingBalanceText, pendingBalanceValueText, listData, isRefreshing,
    } = this.state;
    const { navigation } = this.props;
    const { coin } = navigation.state.params;

    const symbol = coin && coin.symbol;
    const type = coin && coin.type;
    const symbolName = common.getSymbolFullName(symbol, type);

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
        {this.renderFooter()}
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
};

History.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
  prices: state.Price.get('prices'),
  language: state.App.get('language'),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(History);

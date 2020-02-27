import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, Image, TextInput, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SwapHeader from '../../../components/headers/header.swap';
import BasePageGereral from '../../base/base.page.general';
import Button from '../../../components/common/button/button';
import space from '../../../assets/styles/space';
import color from '../../../assets/styles/color.ts';
import presetStyles from '../../../assets/styles/style';
import common from '../../../common/common';
import CoinswitchHelper from '../../../common/coinswitch.helper';
import Transaction from '../../../common/transaction';
import appActions from '../../../redux/app/actions';
import { createErrorNotification } from '../../../common/notification.controller';
import walletActions from '../../../redux/wallet/actions';
import Loc from '../../../components/common/misc/loc';


const styles = StyleSheet.create({
  body: {
    marginTop: -330,
    marginHorizontal: 20,
  },
  board: {
    paddingHorizontal: 28,
    paddingVertical: 22,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 30,
  },
  greenLine: {
    marginTop: 7,
    marginBottom: 15,
    width: 35,
    height: 3,
    backgroundColor: '#00B520',
    borderRadius: 1.5,
  },
  listText: {
    lineHeight: 25,
  },
  rightButton: {
    color: '#FFF',
  },
  sepratorLine: {
    backgroundColor: '#FFF',
    height: StyleSheet.hairlineWidth,
    flex: 1,
  },
  seprator: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    marginVertical: 12,
  },
  exchangeIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  exchangeIconView: {
    width: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  operationView: {
    backgroundColor: '#F3F7F4',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
  },
  boardTokenViewLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  operationAmount: {
    color: '#FFBB00',
  },
  operationValue: {
    alignSelf: 'flex-end',
  },
  operationLeft: {
    flex: 1,
  },
  operationRight: {

  },
  receivingAmount: {
    color: '#00B520',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  boardTokenIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginLeft: -5,
  },
  boardTokenName: {
    fontSize: 25,
    color: color.component.swipableButtonList.title.color,
    fontFamily: 'Avenir-Book',
    letterSpacing: 0.4,
  },
  boardText: {
    color: '#9B9B9B',
  },
  boardWalletName: {
    color: '#000',
  },
  boardTokenView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  boardTokenExchangeIcon: {
    marginTop: -6,
  },
  boardAmountView: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  sourceAmount: {
    flex: 1,
    paddingRight: 50,
  },
  textInput: {
    color: '#000',
    fontFamily: 'Avenir-Book',
    fontSize: 27,
  },
  boardAmount: {
    color: '#000',
    fontSize: 27,
    fontFamily: 'Avenir-Book',
    letterSpacing: 0.4,
    flex: 1,
  },
  boardValue: {
    fontFamily: 'Avenir-Book',
  },
  switchView: {
    height: 40,
    marginTop: 33,
    backgroundColor: '#F3F3F3',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  switchItem: {
    width: '33.3%',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 25,
  },
  switchItemActived: {
    position: 'absolute',
    left: '33.3%',
    width: '33.3%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: '#00B520',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    fontFamily: 'Avenir-Heavy',
  },
  switchTextActived: {
    color: '#FFF',
  },
  error: {
    marginRight: 10,
  },
  errorView: {
    backgroundColor: '#F3F7F4',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 22,
  },
  errorText: {
    flex: 1,
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: 0.75,
    borderWidth: 0,
  },
});

const res = {};
res.exchange = require('../../../assets/images/icon/exchange.png');
res.BTC = require('../../../assets/images/icon/BTC.png');
res.RBTC = require('../../../assets/images/icon/RBTC.png');
res.RIF = require('../../../assets/images/icon/RIF.png');
res.currencyExchange = require('../../../assets/images/icon/currencyExchange.png');
res.error = require('../../../assets/images/icon/error.png');

const switchItems = ['MIN', 'HALF', 'ALL'];

class Swap extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.onExchangePress = this.onExchangePress.bind(this);
    this.onSwitchPress = this.onSwitchPress.bind(this);
    this.onHistoryPress = this.onHistoryPress.bind(this);
    this.onSelectSourcePress = this.onSelectSourcePress.bind(this);
    this.onSelectDestPress = this.onSelectDestPress.bind(this);
    this.onChangeSourceAmount = this.onChangeSourceAmount.bind(this);
    this.state = {
      switchIndex: -1,
      switchSelectedText: switchItems[0],
      isBalanceEnough: false,
      isAmountInRange: false,
      mainCoin: 'source',
      sourceAmount: null,
      destAmount: null,
      sourceText: null,
      rate: -1,
      limitMinDepositCoin: -1,
      limitMaxDepositCoin: -1,
      limitHalfDepositCoin: -1,
      sourceUsdRate: -1,
      destUsdRate: -1,
      minerFee: 0,
      coinLoading: false,
    };
  }

  async componentDidMount() {
    const { swapSource, swapDest } = this.props;
    if (swapSource && swapDest) {
      this.updateRateInfo(swapSource, swapDest, this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { swapSource: currentSwapSource, swapDest: currentSwapDest, prices } = nextProps;
    const { swapSource: lastSwapSource, swapDest: lastSwapDest } = this.props;
    const suRate = currentSwapSource ? prices.find((price) => price.symbol === currentSwapSource.coin.symbol) : null;
    const duRate = currentSwapDest ? prices.find((price) => price.symbol === currentSwapDest.coin.symbol) : null;
    if (suRate) this.setState({ sourceUsdRate: parseFloat(suRate.price.USD) });
    if (duRate) this.setState({ destUsdRate: parseFloat(duRate.price.USD) });

    if ((currentSwapSource && currentSwapDest) && ((!lastSwapSource || !this.isSameCoin(currentSwapSource, lastSwapSource)) || (!lastSwapDest || !this.isSameCoin(currentSwapDest, lastSwapDest)))
    ) {
      this.updateRateInfo(currentSwapSource, currentSwapDest, nextProps);
    } else if (!currentSwapSource || !currentSwapDest) {
      this.resetAmountState();
    }
  }

  async onExchangePress() {
    const {
      navigation, swapSource, swapDest, addNotification,
    } = this.props;
    const { sourceAmount } = this.state;

    try {
      this.setState({ loading: true });
      const { address: sourceAddress, id: sourceId } = swapSource.coin;
      const { address: destAddress, id: destId } = swapDest.coin;
      const sourceCoin = sourceId.toLowerCase();
      const destCoin = destId.toLowerCase();
      const order = await CoinswitchHelper.placeOrder(sourceCoin, destCoin, sourceAmount, { address: destAddress }, { address: sourceAddress });
      const {
        // orderId,
        exchangeAddress: { address: agentAddress },
      } = order;

      const gasFee = this.getFeeParams(swapSource.coin);
      const extraParams = { data: '', memo: '', gasFee };
      let transaction = new Transaction(swapSource.coin, agentAddress, sourceAmount, extraParams);
      console.log('transaction: ', transaction);
      await transaction.processRawTransaction();
      await transaction.signTransaction();
      await transaction.processSignedTransaction();
      transaction = null;
      this.setState({ loading: false });
      navigation.navigate('SwapCompleted', { coin: swapSource.coin });
    } catch (error) {
      this.setState({ loading: false });
      console.log(`confirm, error: ${error.message}`);
      const buttonText = 'button.RETRY';
      let notification = null;
      if (error.code === 141) {
        const message = error.message.split('|');
        console.log(message[0]);
        switch (message[0]) {
          case 'err.notenoughbalance.btc':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.moreBTC',
              buttonText,
            );
            break;
          case 'err.notenoughbalance.rbtc':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.moreRBTC',
              buttonText,
            );
            break;
          case 'err.notenoughbalance.rif':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.moreRIF',
              buttonText,
            );
            break;
          case 'err.notenoughbalance':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.moreBalance',
              buttonText,
            );
            break;
          case 'err.timeout':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.serverTimeout',
              buttonText,
            );
            addNotification(notification);
            break;
          case 'err.customized':
            notification = createErrorNotification(
              'modal.txFailed.title',
              message[1],
              buttonText,
            );
            break;
          default:
            break;
        }
      }
      // Default error notification
      if (!notification) {
        notification = createErrorNotification(
          'modal.txFailed.title',
          'modal.txFailed.contactService',
          buttonText,
        );
      }
      addNotification(notification);
    }
  }

  onSwitchPress = (index) => {
    const { limitMinDepositCoin, limitMaxDepositCoin, limitHalfDepositCoin } = this.state;
    let amount = -1;
    switch (index) {
      case 0:
        amount = limitMinDepositCoin;
        break;
      case 1:
        amount = limitHalfDepositCoin;
        break;
      case 2:
        amount = limitMaxDepositCoin;
        break;
      default:
    }
    this.setState({
      switchIndex: index,
      switchSelectedText: switchItems[index],
      sourceText: amount.toString(),
    }, () => this.setAmountState(amount, this.props, this.state));
  };

  onHistoryPress() {
    const { navigation, swapSource } = this.props;
    navigation.navigate('WalletHistory', { coin: swapSource.coin });
  }

  onSelectSourcePress() {
    const { navigation } = this.props;
    navigation.push('SwapSelection', { selectionType: 'source' });
  }

  onSelectDestPress() {
    const { navigation } = this.props;
    navigation.push('SwapSelection', { selectionType: 'dest' });
  }

  onChangeSourceAmount(text) {
    const isAmount = common.isAmount(text);
    let sourceAmount = null;
    if (isAmount) {
      sourceAmount = parseFloat(text);
    }
    this.setState({ sourceText: text, switchIndex: -1 }, () => this.setAmountState(sourceAmount, this.props, this.state));
  }

  setAmountState(sourceAmount, props, state) {
    const { swapDest, swapSource } = props;
    const { limitMinDepositCoin, limitMaxDepositCoin } = state;
    if (!sourceAmount) {
      this.setState({
        sourceAmount: null, destAmount: null, isBalanceEnough: false,
      });
      return;
    }
    const { rate } = state;
    const destAmount = swapDest && rate ? (sourceAmount * rate).toPrecision(6) : null;
    const isAmountInRange = sourceAmount >= limitMinDepositCoin && sourceAmount <= limitMaxDepositCoin;
    const isBalanceEnough = swapSource.coin.balance.isGreaterThanOrEqualTo(sourceAmount);
    this.setState({
      sourceAmount, destAmount, isBalanceEnough, isAmountInRange,
    });
  }

  updateRateInfo = (currentSwapSource, currentSwapDest, props) => {
    const { sourceAmount } = this.state;
    const sourceCoinId = currentSwapSource.coin.id.toLowerCase();
    const destCoinId = currentSwapDest.coin.id.toLowerCase();
    this.setState({ coinLoading: true });
    const promise = CoinswitchHelper.getRate(sourceCoinId, destCoinId);
    Promise.all([promise])
      .then((values) => {
        const sdRate = values[0];
        const {
          rate, limitMinDepositCoin, limitMaxDepositCoin, minerFee,
        } = sdRate;
        this.setState({
          rate,
          minerFee,
          limitMinDepositCoin,
          limitMaxDepositCoin,
          limitHalfDepositCoin: ((limitMaxDepositCoin + limitMinDepositCoin) / 2).toFixed(2),
        }, () => {
          this.setAmountState(sourceAmount, props, this.state);
          this.setState({ coinLoading: false });
        });
      }).catch((err) => {
        console.log(err);
      });
  }

  isSameCoin = (source, target) => source.walletName === target.walletName
    && source.coin.chain === target.coin.chain
    && source.coin.type === target.coin.type
    && source.coin.symbol === target.coin.symbol;

  getFeeParams = (coin) => {
    switch (coin.id) {
      case 'BTC':
        return { preference: 'medium' };
      case 'RBTC':
        return {
          gasPrice: coin.metadata.DEFAULT_RBTC_GAS_PRICE.toString(),
          gas: coin.metadata.DEFAULT_RBTC_MEDIUM_GAS,
        };
      case 'doc':
        return {
          gasPrice: coin.metadata.DEFAULT_RBTC_GAS_PRICE.toString(),
          gas: coin.metadata.DEFAULT_DOC_MEDIUM_GAS,
        };
      default:
        return null;
    }
  };

  switchSourceDest = () => {
    const { switchSwap } = this.props;
    const { destAmount } = this.state;
    switchSwap();
    this.onChangeSourceAmount(destAmount || 0);
  };

  resetAmountState() {
    this.setState({
      destAmount: null,
      rate: -1,
      minerFee: 0,
      limitMinDepositCoin: -1,
      limitMaxDepositCoin: -1,
      limitHalfDepositCoin: -1,
    });
  }

  renderExchangeStateBlock = (isBalanceEnough, isAmountInRange, sourceAmount, destAmount, sourceUsdRate, destUsdRate, sourceValueText, destValueText) => {
    let errorText = null;
    if (!sourceAmount) {
      errorText = 'page.wallet.swap.errorSourceAmount';
    } else if (!destAmount) {
      errorText = 'page.wallet.swap.errorDestAmount';
    } else if (!isAmountInRange) {
      errorText = 'page.wallet.swap.errorAmountInRange';
    } else if (!isBalanceEnough) {
      errorText = 'page.wallet.swap.errorBalanceEnough';
    }

    if (errorText) {
      return (
        <View style={[styles.errorView, space.marginTop_27]}>
          <Image style={styles.error} source={res.error} />
          <Loc style={styles.errorText} text={errorText} />
        </View>
      );
    }
    return (
      <View>
        <View style={[styles.operationView, space.marginTop_27]}>
          <View style={styles.operationLeft}>
            <Text>Exchanging</Text>
          </View>
          <View style={styles.operationRight}>
            {sourceAmount && <Text style={styles.operationAmount}>{sourceAmount.toString()}</Text>}
            <Text style={styles.operationValue}>{sourceValueText}</Text>
          </View>
        </View>
        <View style={[styles.operationView, space.marginTop_10]}>
          <View style={styles.operationLeft}>
            <Text>Receiving</Text>
          </View>
          <View style={styles.operationRight}>
            {destAmount && <Text style={[styles.operationAmount, styles.receivingAmount]}>{`+${destAmount.toString()}`}</Text>}
            <Text style={styles.operationValue}>{destValueText ? `+${destValueText}` : ''}</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {
      navigation, swapSource, swapDest, currency,
    } = this.props;
    const {
      isBalanceEnough, isAmountInRange, sourceAmount, destAmount, sourceText, sourceUsdRate, destUsdRate,
      limitMinDepositCoin, limitMaxDepositCoin, limitHalfDepositCoin, rate, coinLoading, loading, switchIndex,
    } = this.state;

    const currencySymbol = common.getCurrencySymbol(currency);
    const sourceValueText = sourceAmount && sourceUsdRate ? currencySymbol + (sourceAmount * sourceUsdRate).toFixed(2) : '';
    const destValueText = destAmount && destUsdRate ? currencySymbol + (destAmount * destUsdRate).toFixed(2) : '';

    const balanceText = swapSource.coin.balance ? common.getBalanceString(swapSource.coin.symbol, swapSource.coin.balance) : '';

    const isCanSwitchSourceDest = swapSource && swapDest && !coinLoading;

    const customBottomButton = (
      <Button
        text="button.Exchange"
        disabled={!isAmountInRange || !isBalanceEnough}
        onPress={this.onExchangePress}
      />
    );

    return (
      <BasePageGereral
        isSafeView
        hasLoader
        isLoading={loading}
        headerComponent={<SwapHeader title="page.wallet.swap.title" onBackButtonPress={() => navigation.goBack()} rightButton={<View />} />}
        customBottomButton={customBottomButton}
      >
        <View style={styles.body}>
          <View style={[presetStyles.board, styles.board]}>
            <Text style={styles.boardText}>
              <Loc text="page.wallet.swap.wallet" />
              <Text style={styles.boardWalletName}>{` ${swapSource.walletName}`}</Text>
              {`: ${balanceText} ${swapSource.coin.symbol} `}
            </Text>
            <View style={styles.boardTokenView}>
              <TouchableOpacity onPress={this.onSelectSourcePress} style={styles.boardTokenViewLeft}>
                <Image style={styles.boardTokenIcon} source={swapSource.coin.icon} />
                <Text style={styles.boardTokenName}>{swapSource.coin.symbol}</Text>
                <EvilIcons name="chevron-down" color="#9B9B9B" size={40} />
              </TouchableOpacity>
              <Image style={styles.boardTokenExchangeIcon} source={res.currencyExchange} />
            </View>
            <View style={styles.boardAmountView}>
              <View style={styles.sourceAmount}>
                <TextInput
                  style={[styles.textInput]}
                  value={sourceText}
                  onChangeText={this.onChangeSourceAmount}
                  placeholder="0.00"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <Text style={styles.boardValue}>{sourceValueText}</Text>
            </View>
            {coinLoading && (
            <View style={[styles.cardOverlay, presetStyles.board]}>
              <ActivityIndicator
                size="large"
                animating={coinLoading}
              />
            </View>
            )}
          </View>
          <View style={styles.seprator}>
            <View style={styles.sepratorLine} />
            <TouchableOpacity
              style={[styles.exchangeIconView, { opacity: isCanSwitchSourceDest ? 1 : 0.3 }]}
              disabled={!isCanSwitchSourceDest}
              onPress={this.switchSourceDest}
            >
              <Image style={styles.exchangeIcon} source={res.exchange} />
            </TouchableOpacity>
            <View style={styles.sepratorLine} />
          </View>
          <View style={[presetStyles.board, styles.board]}>
            { swapDest && (
              <Text style={styles.boardText}>
                <Loc text="page.wallet.swap.want" />
                {` ${swapDest.coin.symbol} `}
                <Text style={styles.boardWalletName}>{`(${swapDest.walletName})`}</Text>
              </Text>
            )}
            <View style={styles.boardTokenView}>
              <TouchableOpacity onPress={this.onSelectDestPress} style={styles.boardTokenViewLeft}>
                {swapDest && (<Image style={styles.boardTokenIcon} source={swapDest.coin.icon} />)}
                {swapDest && (<Text style={styles.boardTokenName}>{swapDest.coin.symbol}</Text>)}
                <EvilIcons name="chevron-down" color="#9B9B9B" size={40} />
              </TouchableOpacity>
              <Image style={styles.boardTokenExchangeIcon} source={res.currencyExchange} />
            </View>
            <View style={styles.boardAmountView}>
              <Text style={[styles.boardAmount]}>{destAmount}</Text>
              <Text style={styles.boardValue}>{destValueText}</Text>
            </View>
            {coinLoading && swapDest && (
              <View style={[styles.cardOverlay, presetStyles.board]}>
                <ActivityIndicator
                  size="large"
                  animating={coinLoading}
                />
              </View>
            )}
          </View>
          <View
            pointerEvents={rate > 0 && limitMinDepositCoin > 0 && limitMaxDepositCoin > 0 && !coinLoading ? 'auto' : 'none'}
            style={styles.switchView}
          >
            <TouchableOpacity style={[styles.switchItem, switchIndex === 0 ? { backgroundColor: color.component.button.backgroundColor } : {}]} onPress={() => this.onSwitchPress(0)}>
              <Text style={[styles.switchText]}>{limitMinDepositCoin > 0 ? `${switchItems[0]}(${limitMinDepositCoin})` : switchItems[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.switchItem, switchIndex === 1 ? { backgroundColor: color.component.button.backgroundColor } : {}]} onPress={() => this.onSwitchPress(1)}>
              <Text style={styles.switchText}>{limitHalfDepositCoin > 0 ? `${switchItems[1]}(${limitHalfDepositCoin})` : switchItems[1]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.switchItem, switchIndex === 2 ? { backgroundColor: color.component.button.backgroundColor } : {}]} onPress={() => this.onSwitchPress(2)}>
              <Text style={styles.switchText}>{limitMaxDepositCoin > 0 ? `${switchItems[2]}(${limitMaxDepositCoin})` : switchItems[2]}</Text>
            </TouchableOpacity>
          </View>
          { this.renderExchangeStateBlock(isBalanceEnough, isAmountInRange, sourceAmount, destAmount, sourceUsdRate, destUsdRate, sourceValueText, destValueText) }
        </View>
      </BasePageGereral>
    );
  }
}

Swap.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  swapSource: PropTypes.shape({
    walletName: PropTypes.string.isRequired,
    coin: PropTypes.object.isRequired,
  }),
  swapDest: PropTypes.shape({
    walletName: PropTypes.string.isRequired,
    coin: PropTypes.object.isRequired,
  }),
  prices: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currency: PropTypes.string.isRequired,
  addNotification: PropTypes.func.isRequired,
  switchSwap: PropTypes.func.isRequired,
};

Swap.defaultProps = {
  swapSource: null,
  swapDest: null,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  swapSource: state.Wallet.get('swapSource'),
  swapDest: state.Wallet.get('swapDest'),
  prices: state.Wallet.get('prices'),
  currency: state.App.get('currency'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
  switchSwap: () => dispatch(walletActions.switchSwap()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Swap);

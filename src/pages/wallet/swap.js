import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, Image, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import posed from 'react-native-pose';
import BigNumber from 'bignumber.js';
import SwapHeader from '../../components/headers/header.swap';
// import Loc from '../../components/common/misc/loc';
import BasePageGereral from '../base/base.page.general';
import Button from '../../components/common/button/button';
import space from '../../assets/styles/space';
import color from '../../assets/styles/color.ts';
import presetStyles from '../../assets/styles/style';
import common from '../../common/common';

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
    borderColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
    width: '100%',
  },
  seprator: {
    marginVertical: 12,
    justifyContent: 'center',
  },
  exchangeIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  exchangeIconView: {
    alignSelf: 'center',
    backgroundColor: '#54B52D',
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
});

const res = {};
res.exchange = require('../../assets/images/icon/exchange.png');
res.BTC = require('../../assets/images/icon/BTC.png');
res.RBTC = require('../../assets/images/icon/RBTC.png');
res.RIF = require('../../assets/images/icon/RIF.png');
res.currencyExchange = require('../../assets/images/icon/currencyExchange.png');
res.error = require('../../assets/images/icon/error.png');

const switchItems = ['MIN', 'HALF', 'ALL'];

const SwitchItemActived = posed.View({
  item0: { left: '0%' },
  item1: { left: '33.333%' },
  item2: { left: '66.666%' },
});


// RATE, get from backend;
const RATE = 0.7;

const MIN_SWAP_AMOUNT = 0.0019;

class Swap extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  // static generateValueText(value, currency) {
  //   const currencySymbol = common.getCurrencySymbol(currency);
  //   const amountValueText = common.getAssetValueString(value);
  //   const valueText = `${currencySymbol}${amountValueText}`;
  //   return valueText;
  // }

  constructor(props) {
    super(props);
    this.onExchangePress = this.onExchangePress.bind(this);
    this.onSwitchPress = this.onSwitchPress.bind(this);
    this.onHistoryPress = this.onHistoryPress.bind(this);
    this.onSelectSourcePress = this.onSelectSourcePress.bind(this);
    this.onSelectDestPress = this.onSelectDestPress.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.state = {
      switchIndex: -1,
      switchSelectedText: switchItems[0],
      isBalanceEnough: true,
      sourceAmount: null,
      destAmount: null,
      sourceValue: null,
      destValue: null,
      intputText: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { sourceAmount } = this.state;
    this.setAmountState(sourceAmount, nextProps);
  }

  onExchangePress() {
    const { navigation, swapSource } = this.props;
    const { sourceAmount, destAmount } = this.state;
    console.log(`sourceAmount: ${sourceAmount}, destAmount: ${destAmount}`);
    navigation.navigate('SwapCompleted', { coin: swapSource.coin });
  }

  onSwitchPress(index) {
    const { swapSource } = this.props;
    let { sourceAmount } = this.state;
    const { balance } = swapSource.coin;
    switch (index) {
      case 0:
        sourceAmount = new BigNumber(MIN_SWAP_AMOUNT);
        break;
      case 1:
        sourceAmount = balance.div(2);
        break;
      case 2:
        sourceAmount = balance;
        break;
      default:
    }
    const isBalanceEnough = balance.isGreaterThanOrEqualTo(MIN_SWAP_AMOUNT) || sourceAmount.isGreaterThanOrEqualTo(MIN_SWAP_AMOUNT);
    this.setState({
      switchIndex: index, switchSelectedText: switchItems[index], isBalanceEnough, intputText: common.getBalanceString(swapSource.coin.symbol, sourceAmount),
    });
    this.setAmountState(sourceAmount, this.props);
  }

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

  onChangeText(text) {
    const isAmount = common.isAmount(text);
    let sourceAmount = null;
    if (isAmount) {
      sourceAmount = new BigNumber(text);
    }
    this.setAmountState(sourceAmount, this.props);
    this.setState({ intputText: text });
  }

  setAmountState(sourceAmount, props) {
    const {
      swapSource, swapDest, currency, prices,
    } = props;
    if (!sourceAmount) {
      this.setState({
        sourceAmount: null, sourceValue: null, destAmount: null, destValue: null, isBalanceEnough: false,
      });
      return;
    }
    const sourceValue = common.getCoinValue(sourceAmount, swapSource.coin.symbol, currency, prices);
    const destAmount = swapDest ? sourceAmount * RATE : null;
    const destValue = swapDest ? common.getCoinValue(sourceAmount, swapDest.coin.symbol, currency, prices) : null;
    const isBalanceEnough = sourceAmount.isGreaterThanOrEqualTo(MIN_SWAP_AMOUNT);
    this.setState({
      sourceAmount, sourceValue, destAmount, destValue, isBalanceEnough,
    });
  }

  renderExchangeStateBlock(isBalanceEnough, sourceAmountText, destAmountText, sourceValueText, destValueText) {
    const { swapSource } = this.props;
    if (!isBalanceEnough) {
      return (
        <View style={[styles.errorView, space.marginTop_27]}>
          <Image style={styles.error} source={res.error} />
          <Text style={styles.errorText}>{`The amount is lower than the exchange mininum of ${MIN_SWAP_AMOUNT} ${swapSource.coin.symbol}`}</Text>
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
            <Text style={styles.operationAmount}>{sourceAmountText}</Text>
            <Text style={styles.operationValue}>{sourceValueText}</Text>
          </View>
        </View>
        <View style={[styles.operationView, space.marginTop_10]}>
          <View style={styles.operationLeft}>
            <Text>Receiving</Text>
          </View>
          <View style={styles.operationRight}>
            <Text style={[styles.operationAmount, styles.receivingAmount]}>{`+${destAmountText}`}</Text>
            <Text style={styles.operationValue}>{`+${destValueText}`}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const {
      navigation, swapSource, swapDest, currency,
    } = this.props;
    const {
      switchIndex, switchSelectedText, isBalanceEnough, sourceValue, destValue, sourceAmount, destAmount, intputText,
    } = this.state;

    console.log(sourceAmount);
    const currencySymbol = common.getCurrencySymbol(currency);
    const sourceValueText = currencySymbol + common.getAssetValueString(sourceValue || '0.00');
    const destValueText = currencySymbol + common.getAssetValueString(destValue || '0.00');
    const destAmountText = swapDest && destAmount ? common.getBalanceString(swapDest.coin.symbol, destAmount) : '0.00';
    const sourceAmountText = sourceAmount ? common.getBalanceString(swapSource.coin.symbol, destAmount) : null;

    const balanceText = swapSource.coin.balance ? common.getBalanceString(swapSource.coin.symbol, swapSource.coin.balance) : '';
    const rightButton = (
      <TouchableOpacity onPress={this.onHistoryPress}>
        <MaterialCommunityIcons style={styles.rightButton} name="progress-clock" size={30} />
      </TouchableOpacity>
    );
    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        headerComponent={<SwapHeader title="page.wallet.swap.title" onBackButtonPress={() => navigation.goBack()} rightButton={rightButton} />}
      >
        <View style={styles.body}>
          <View style={[presetStyles.board, styles.board]}>
            <Text style={styles.boardText}>
              {`I have ${balanceText} ${swapSource.coin.symbol} in `}
              <Text style={styles.boardWalletName}>{swapSource.walletName}</Text>
            </Text>
            <View style={styles.boardTokenView}>
              <View style={styles.boardTokenViewLeft}>
                <Image style={styles.boardTokenIcon} source={swapSource.coin.icon} />
                <Text style={styles.boardTokenName}>{swapSource.coin.symbol}</Text>
                <TouchableOpacity onPress={this.onSelectSourcePress}>
                  <EvilIcons name="chevron-down" color="#9B9B9B" size={40} />
                </TouchableOpacity>
              </View>
              <Image style={styles.boardTokenExchangeIcon} source={res.currencyExchange} />
            </View>
            <View style={styles.boardAmountView}>
              <View style={styles.sourceAmount}>
                <TextInput
                  style={[styles.textInput]}
                  value={intputText}
                  onChangeText={this.onChangeText}
                  placeholder="0.00"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <Text style={styles.boardValue}>{sourceValueText}</Text>
            </View>
          </View>
          <View style={styles.seprator}>
            <View style={styles.sepratorLine} />
            <View style={styles.exchangeIconView}>
              <Image style={styles.exchangeIcon} source={res.exchange} />
            </View>
          </View>
          <View style={[presetStyles.board, styles.board]}>
            { swapDest && (
              <Text style={styles.boardText}>
                {`I want ${swapDest.coin.symbol} in`}
                <Text style={styles.boardWalletName}>{` ${swapDest.walletName}`}</Text>
              </Text>
            )}
            <View style={styles.boardTokenView}>
              <View style={styles.boardTokenViewLeft}>
                {swapDest && (<Image style={styles.boardTokenIcon} source={swapDest.coin.icon} />)}
                {swapDest && (<Text style={styles.boardTokenName}>{swapDest.coin.symbol}</Text>)}
                <TouchableOpacity onPress={this.onSelectDestPress}>
                  <EvilIcons name="chevron-down" color="#9B9B9B" size={40} />
                </TouchableOpacity>
              </View>
              <Image style={styles.boardTokenExchangeIcon} source={res.currencyExchange} />
            </View>
            <View style={styles.boardAmountView}>
              <Text style={[styles.boardAmount]}>{destAmountText}</Text>
              <Text style={styles.boardValue}>{destValueText}</Text>
            </View>
          </View>

          <View style={styles.switchView}>
            <TouchableOpacity style={[styles.switchItem]} onPress={() => this.onSwitchPress(0)}>
              <Text style={[styles.switchText]}>{switchItems[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchItem} onPress={() => this.onSwitchPress(1)}>
              <Text style={styles.switchText}>{switchItems[1]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchItem} onPress={() => this.onSwitchPress(2)}>
              <Text style={styles.switchText}>{switchItems[2]}</Text>
            </TouchableOpacity>
            {switchIndex >= 0 && (
              <SwitchItemActived style={[styles.switchItemActived]} pose={`item${switchIndex}`}>
                <Text style={[styles.switchText, styles.switchTextActived]}>{ switchSelectedText }</Text>
              </SwitchItemActived>
            )}
          </View>
          { this.renderExchangeStateBlock(isBalanceEnough, sourceAmountText, destAmountText, sourceValueText, destValueText) }
          <View style={[styles.buttonView, space.marginTop_30, space.marginBottom_20]}>
            <Button text="button.Exchange" onPress={this.onExchangePress} />
          </View>
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
  // prices: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currency: PropTypes.string.isRequired,
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

export default connect(mapStateToProps)(Swap);

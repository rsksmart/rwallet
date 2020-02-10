import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Switch, Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import color from '../../assets/styles/color.ts';
import RadioGroup from './transfer.radio.group';
import Loc from '../../components/common/misc/loc';

// import ConfirmSlider from '../../components/wallet/confirm.slider';
// import circleCheckIcon from '../../assets/images/misc/circle.check.png';
// import circleIcon from '../../assets/images/misc/circle.png';
import { createErrorNotification } from '../../common/notification.controller';
import appActions from '../../redux/app/actions';
import Transaction from '../../common/transaction';
import common from '../../common/common';
import { strings } from '../../common/i18n';
import Button from '../../components/common/button/button';
import OperationHeader from '../../components/headers/header.operation';
import BasePageGereral from '../base/base.page.general';

const MEMO_NUM_OF_LINES = 8;
const MEMO_LINE_HEIGHT = 15;

const styles = StyleSheet.create({
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    marginLeft: -2,
    marginBottom: 2,
  },
  chevron: {
    color: '#FFF',
  },
  headImage: {
    position: 'absolute',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    marginTop: 30,
  },
  check: {
    margin: 25,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
  },
  text: {
    color: '#4A4A4A',
    fontSize: 15,
    fontWeight: '300',
    width: '80%',
    marginTop: 15,
    textAlign: 'center',
  },
  link: {
    color: '#00B520',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  title1: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.39,
    marginBottom: 15,
    marginTop: 20,
  },
  title2: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.31,
    marginBottom: 10,
    marginTop: 10,
  },
  title3: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.23,
    marginBottom: 10,
    marginTop: 10,
  },
  textInput: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 0,
    marginLeft: 5,
    marginVertical: 10,
    flex: 1,
  },
  textInputView: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputIcon: {
    marginRight: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.31,
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    width: '33%',
  },
  radioItemLeft: {

  },
  radioItemText1: {
    color: '#000000',
    fontSize: 16,
    letterSpacing: 0.31,
  },
  radioItemText2: {
    color: '#4A4A4A',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.23,
  },
  radioCheck: {
    fontSize: 20,
  },
  RadioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    marginTop: 5,
    marginRight: 10,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00B520',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customFeeSlider: {
    width: '100%',
    height: 40,
  },
  customFeeSliderWrapper: {
    height: 60,
    marginTop: 5,
  },
  customFeeText: {
    alignSelf: 'flex-end',
    fontSize: 13,
  },
  customTitle: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.31,
    marginBottom: 10,
    marginTop: 10,
  },
  sendingRow: {
    flexDirection: 'row',
  },
  sendAll: {
    position: 'absolute',
    right: 10,
    bottom: 15,
  },
  sendAllText: {
    color: '#00B520',
  },
  lastBlockMarginBottom: {
    marginBottom: 15,
  },
  confirmButton: {
    alignSelf: 'center',
  },
  titleView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    left: 10,
    alignItems: 'center',
  },
});

const FEE_LEVEL_ADJUSTMENT = 0.25;
const DEFAULT_RBTC_MIN_GAS = 21000;
const DEFAULT_RIF_MIN_GAS = 23064;
const DEFAULT_RBTC_MEDIUM_GAS = DEFAULT_RBTC_MIN_GAS / (1 - FEE_LEVEL_ADJUSTMENT);
const DEFAULT_RIF_MEDIUM_GAS = DEFAULT_RIF_MIN_GAS / (1 - FEE_LEVEL_ADJUSTMENT);
const DEFAULT_BTC_MIN_FEE = 60000;
const DEFAULT_BTC_MEDIUM_FEE = DEFAULT_BTC_MIN_FEE / (1 - FEE_LEVEL_ADJUSTMENT);
const DEFAULT_RBTC_GAS_PRICE = 600000000;
const MAX_FEE_TIMES = 2;
const PLACEHODLER_AMOUNT = 0.001;

const addressIcon = require('../../assets/images/icon/address.png');

class Transfer extends Component {
  static navigationOptions = () => ({
    header: null,
    // gesturesEnabled: false,
  });

  static generateAmountPlaceholderText(symbol, currency, prices) {
    const amountText = common.getBalanceString(symbol, PLACEHODLER_AMOUNT);
    let amountPlaceholderText = `${amountText} ${symbol}`;
    if (prices) {
      const currencySymbol = common.getCurrencySymbol(currency);
      const amountValue = common.getCoinValue(PLACEHODLER_AMOUNT, symbol, currency, prices);
      const amountValueText = common.getAssetValueString(amountValue, amountValue);
      amountPlaceholderText += ` (${currencySymbol}${amountValueText})`;
    }
    return amountPlaceholderText;
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      to: null,
      amount: '',
      memo: null,
      feeLevel: 1,
      preference: 'medium',
      // isConfirm: false,
      enableConfirm: false,
      isCustomFee: false,
      customFee: null,
      customFeeValue: new BigNumber(0),
      feeSymbol: null,
      feeSliderValue: 0,
      amountPlaceholderText: '',
    };

    this.confirm = this.confirm.bind(this);
    this.validateConfirmControl = this.validateConfirmControl.bind(this);
    this.onGroupSelect = this.onGroupSelect.bind(this);
    this.inputAmount = this.inputAmount.bind(this);
    this.onQrcodeScanPress = this.onQrcodeScanPress.bind(this);
    // this.onConfirmSliderVerified = this.onConfirmSliderVerified.bind(this);
    this.onCustomFeeSlideValueChange = this.onCustomFeeSlideValueChange.bind(this);
    this.onCustomFeeSlidingComplete = this.onCustomFeeSlidingComplete.bind(this);
    this.onSendAllPress = this.onSendAllPress.bind(this);
    this.onConfirmPress = this.onConfirmPress.bind(this);
  }

  componentDidMount() {
    this.initContext();
  }

  componentWillReceiveProps(nextProps) {
    const { prices, currency, navigation } = nextProps;
    const { prices: curPrices } = this.props;
    const { coin } = navigation.state.params;

    if (prices && prices !== curPrices) {
      const { customFee, feeSymbol } = this.state;
      const customFeeValue = common.getCoinValue(customFee, feeSymbol, currency, prices);
      const amountPlaceholderText = Transfer.generateAmountPlaceholderText(coin.symbol, currency, prices);
      this.setState({ customFeeValue, amountPlaceholderText });
    }
  }

  onGroupSelect(index) {
    const preferences = ['low', 'medium', 'high'];
    const preference = preferences[index];
    this.setState({ preference, feeLevel: index, isCustomFee: false });
  }

  onQrcodeScanPress() {
    const { navigation } = this.props;
    navigation.navigate('Scan', {
      onQrcodeDetected: (data) => {
        const parseUrl = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        const url = data;
        const result = parseUrl.exec(url);
        const host = result[3];
        const [address2] = host.split('.');
        this.setState({ to: address2 });
      },
    });
  }

  // async onConfirmSliderVerified() {
  //   this.setState({ isConfirm: true });
  //   await this.confirm();
  // }

  onCustomFeeSwitchValueChange(value) {
    const { customFee } = this.state;
    this.setState({ isCustomFee: value });
    if (customFee) {
      return;
    }
    if (value) {
      const feeSliderValue = 0.5;
      this.setState({ feeSliderValue });
      this.onCustomFeeSlideValueChange(feeSliderValue);
    }
  }

  /**
   * onCustomFeeSlideValueChange
   * @param {number} value slider value, 0-1
   */
  onCustomFeeSlideValueChange(value) {
    // console.log('onCustomFeeSlideValueChange, value: ', value);
    const { currency, prices, navigation } = this.props;
    const { coin } = navigation.state.params;
    const { feeSymbol } = this.state;
    // maxFee = 2 times high fee
    const maxFee = this.mediumFee.times(MAX_FEE_TIMES).times(1 + FEE_LEVEL_ADJUSTMENT);
    // If feeSymbol is RBTC, fee must multiply DEFAULT_RBTC_GAS_PRICE
    let minFee = null;
    if (coin.symbol === 'RBTC') {
      minFee = common.convertUnitToCoinAmount(feeSymbol, DEFAULT_RBTC_MIN_GAS).times(DEFAULT_RBTC_GAS_PRICE);
    } else if (coin.symbol === 'RIF') {
      minFee = common.convertUnitToCoinAmount(feeSymbol, DEFAULT_RIF_MIN_GAS).times(DEFAULT_RBTC_GAS_PRICE);
    } else {
      minFee = common.convertUnitToCoinAmount(feeSymbol, DEFAULT_BTC_MIN_FEE);
    }
    // minFee + (maxFee-minFee) * value
    const customFee = minFee.plus(maxFee.minus(minFee).times(value));
    const customFeeValue = common.getCoinValue(customFee, feeSymbol, currency, prices);
    this.setState({ customFee, customFeeValue });
  }

  onCustomFeeSlidingComplete(value) {
    this.setState({ feeSliderValue: value });
  }

  onSendAllPress() {
    const {
      isCustomFee, customFee, feeLevel, feeData,
    } = this.state;
    const { navigation } = this.props;
    const { coin } = navigation.state.params;
    // If balance data have not received from server (user enter this page quickly), return without setState.
    if (_.isNil(coin.balance)) {
      return;
    }
    if (coin.symbol === 'RIF') {
      const amount = common.getBalanceString(coin.symbol, coin.balance);
      this.setState({ amount });
    } else {
      let fee = feeData[feeLevel].coin;
      if (isCustomFee) {
        fee = customFee;
      }
      let balance = coin.balance.minus(fee);
      balance = balance.gt(0) ? balance : 0;
      const amountText = common.getBalanceString(coin.symbol, balance);
      this.inputAmount(amountText);
    }
  }

  async onConfirmPress() {
    const { navigation: { state } } = this.props;
    const { params } = state;
    const { coin } = params;
    let { amount, to } = this.state;
    amount = amount.trim();
    to = to.trim();
    if (!this.validateFormData(amount, to, coin.symbol, coin.type, coin.networkId)) {
      // this.resetConfirm();
      return;
    }
    const { callAuthVerify } = this.props;
    callAuthVerify(this.confirm, () => null);
  }

  getFeeParams() {
    const {
      feeSymbol, isCustomFee, customFee, preference,
    } = this.state;
    const { navigation } = this.props;
    const { coin } = navigation.state.params;
    let feeParams = null;
    if (isCustomFee) {
      if (feeSymbol === 'RBTC') {
        const fee = customFee.div(DEFAULT_RBTC_GAS_PRICE);
        const wei = common.rbtcToWei(fee);
        feeParams = {
          gasPrice: DEFAULT_RBTC_GAS_PRICE.toString(),
          gas: wei.decimalPlaces(0).toNumber(),
        };
      } else {
        // If BTC is costom fee, set fees field = customFee hex
        feeParams = {
          fees: common.btcToSatoshiHex(customFee),
        };
      }
    } else if (feeSymbol === 'RBTC') {
      const feeLevels = {
        low: 1 - FEE_LEVEL_ADJUSTMENT,
        medium: 1,
        high: 1 + FEE_LEVEL_ADJUSTMENT,
      };
      const mediumGas = coin.symbol === 'RIF' ? DEFAULT_RIF_MEDIUM_GAS : DEFAULT_RBTC_MEDIUM_GAS;
      feeParams = {
        gasPrice: DEFAULT_RBTC_GAS_PRICE.toString(),
        gas: mediumGas * feeLevels[preference],
      };
    } else if (feeSymbol === 'BTC') {
      // If BTC is not costom fee, set preference field = high/medium/low
      feeParams = { preference };
    }
    return feeParams;
  }

  initContext() {
    const { navigation, prices, currency } = this.props;
    const { coin } = navigation.state.params;

    console.log('prices: ', prices);
    console.log('currency: ', currency);

    const feeLevels = [
      1 - FEE_LEVEL_ADJUSTMENT,
      1,
      1 + FEE_LEVEL_ADJUSTMENT,
    ];
    const feeBase = { BTC: DEFAULT_BTC_MEDIUM_FEE, RBTC: DEFAULT_RBTC_MEDIUM_GAS, RIF: DEFAULT_RIF_MEDIUM_GAS };
    let feeSymbol = coin.symbol;
    if (feeSymbol === 'RIF') {
      feeSymbol = 'RBTC';
    }
    const feeData = [];
    for (let i = 0; i < 3; i += 1) {
      const item = {};
      const fee = feeLevels[i] * feeBase[coin.symbol];

      let coinAmount = common.convertUnitToCoinAmount(feeSymbol, fee);
      if (feeSymbol === 'RBTC') {
        coinAmount = coinAmount.times(DEFAULT_RBTC_GAS_PRICE);
      }
      const coinValue = common.getCoinValue(coinAmount, feeSymbol, currency, prices);
      item.value = coinValue;
      item.coin = coinAmount;
      feeData.push(item);
    }
    this.mediumFee = feeData[1].coin;
    const amountPlaceholderText = Transfer.generateAmountPlaceholderText(coin.symbol, currency, prices);
    this.setState({ feeData, feeSymbol, amountPlaceholderText });
  }

  // resetConfirm() {
  //   this.setState({ isConfirm: false });
  //   this.confirmSlider.reset();
  // }

  /**
   * validateFormData, return true/false, indicates whether the form datas are valid.
   * @param {string} amount, coin amount
   * @param {string} address, wallet address
   * @param {string} symbol, coin symbol
   * @param {string} type, coin network type
   * @param {number} type, coin networkId
   */
  validateFormData(amount, address, symbol, type, networkId) {
    const { addNotification } = this.props;
    const isAmountNumber = common.isAmount(amount);
    if (!isAmountNumber) {
      const notification = createErrorNotification(
        'modal.invalidAmount.title',
        'modal.invalidAmount.body',
      );
      addNotification(notification);
      return false;
    }
    const isAddress = common.isWalletAddress(address, symbol, type, networkId);
    if (!isAddress) {
      const notification = createErrorNotification(
        'modal.invalidAddress.title',
        'modal.invalidAddress.body',
      );
      addNotification(notification);
      return false;
    }
    return true;
  }

  async confirm() {
    const { navigation, navigation: { state }, addNotification } = this.props;
    const { params } = state;
    const { coin } = params;
    const { memo } = this.state;
    let { amount, to } = this.state;
    amount = amount.trim();
    to = to.trim();
    try {
      this.setState({ loading: true });
      const feeParams = this.getFeeParams();
      const extraParams = { data: '', memo, gasFee: feeParams };
      let transaction = new Transaction(coin, to, amount, extraParams);
      await transaction.processRawTransaction();
      await transaction.signTransaction();
      await transaction.processSignedTransaction();
      this.setState({ loading: false });
      const completedParams = {
        symbol: coin.symbol,
        type: coin.type,
        hash: transaction.txHash,
      };
      navigation.navigate('TransferCompleted', completedParams);
      transaction = null;
    } catch (error) {
      this.setState({ loading: false });
      console.log(`confirm, error: ${error.message}`);
      const buttonText = 'button.RETRY';
      let notification = null;
      if (error.code === 141) {
        const message = error.message.split('|');
        switch (message[0]) {
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
      // this.resetConfirm();
    }
  }

  validateConfirmControl() {
    const { to, amount } = this.state;
    this.setState({ enableConfirm: to && amount });
  }

  inputAmount(text) {
    this.setState({ amount: text });
    if (parseFloat(text) >= 0) {
      this.setState({ amount: text }, this.validateConfirmControl.bind(this));
    }
  }

  renderCustomFee(isCustomFee) {
    const {
      customFee, feeSymbol, customFeeValue, feeSliderValue,
    } = this.state;
    const { currency } = this.props;
    const currencySymbol = common.getCurrencySymbol(currency);
    return (
      <View style={[styles.customFeeSliderWrapper]}>
        { isCustomFee && (
          <View>
            <Slider
              value={feeSliderValue}
              style={styles.customFeeSlider}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#00B520"
              maximumTrackTintColor="#D8D8D8"
              thumbTintColor="#00B520"
              onValueChange={(value) => this.onCustomFeeSlideValueChange(value)}
              onSlidingComplete={(value) => this.onCustomFeeSlidingComplete(value)}
            />
            <Text style={styles.customFeeText}>
              {`${common.getBalanceString(feeSymbol, customFee)} ${feeSymbol} = ${currencySymbol}${common.getAssetValueString(customFeeValue)}`}
            </Text>
          </View>
        )}
      </View>

    );
  }

  renderFeeOptions() {
    const { currency } = this.props;
    const {
      feeSymbol, feeData, feeLevel, isCustomFee,
    } = this.state;
    const currencySymbol = common.getCurrencySymbol(currency);
    const items = [];
    if (!feeData) {
      return null;
    }
    for (let i = 0; i < feeData.length; i += 1) {
      const item = {};
      const fee = feeData[i];
      const coinAmount = common.getBalanceString(feeSymbol, fee.coin);
      item.coin = `${coinAmount} ${feeSymbol}`;
      const coinValue = common.getAssetValueString(fee.value);
      item.value = `${currencySymbol}${coinValue}`;
      items.push(item);
    }
    let selectIndex = null;
    if (!isCustomFee) {
      selectIndex = feeLevel;
    }
    return (
      <RadioGroup
        isDisabled={isCustomFee}
        data={items}
        selectIndex={selectIndex}
        onChange={(i) => this.onGroupSelect(i)}
      />
    );
  }

  renderMemo(memo) {
    const paddingBottom = 4;
    return (
      <TextInput
        style={[styles.textInput, { textAlignVertical: 'top', paddingBottom }]}
        placeholder={strings('page.wallet.transfer.enterMemo')}
        multiline
        numberOfLines={Platform.OS === 'ios' ? null : MEMO_NUM_OF_LINES}
        minHeight={(Platform.OS === 'ios' && MEMO_NUM_OF_LINES) ? (MEMO_LINE_HEIGHT * MEMO_NUM_OF_LINES + paddingBottom) : null}
        value={memo}
        onChange={(event) => this.setState({ memo: event.nativeEvent.text })}
      />
    );
  }

  render() {
    const {
      loading, to, amount, memo, /* isConfirm, */ isCustomFee, amountPlaceholderText,
      enableConfirm,
    } = this.state;
    const { navigation } = this.props;
    const { coin } = navigation.state.params;
    const symbol = coin && coin.symbol;
    const type = coin && coin.type;
    const symbolName = common.getSymbolFullName(symbol, type);

    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn={false}
        hasLoader
        isLoading={loading}
        headerComponent={<OperationHeader operation="Send" symbolName={symbolName} onBackButtonPress={() => navigation.goBack()} />}
      >
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <View style={styles.sendingRow}>
              <Loc style={[styles.title1]} text="txState.Sending" />
              <TouchableOpacity style={[styles.sendAll]} onPress={this.onSendAllPress}><Loc style={[styles.sendAllText]} text="Send All" /></TouchableOpacity>
            </View>
            <View style={styles.textInputView}>
              <TextInput
                placeholder={amountPlaceholderText}
                style={[styles.textInput]}
                value={amount}
                keyboardType="numeric"
                onChangeText={this.inputAmount}
              />
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.title2]} text="page.wallet.transfer.to" />
            <View style={styles.textInputView}>
              <TextInput
                style={[styles.textInput]}
                value={to}
                onChangeText={(text) => {
                  this.setState({ to: text }, this.validateConfirmControl.bind(this));
                }}
              />
              <TouchableOpacity
                style={styles.textInputIcon}
                onPress={this.onQrcodeScanPress}
              >
                <Image source={addressIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.title3]} text="page.wallet.transfer.memo" />
            <View style={styles.textInputView}>
              {this.renderMemo(memo)}
            </View>
          </View>
          <View style={[styles.sectionContainer, { marginBottom: 15 }]}>
            <Loc style={[styles.title2, { marginBottom: 5 }]} text="page.wallet.transfer.fee" />
            <Loc style={[styles.question]} text="page.wallet.transfer.feeQuestion" />
            {this.renderFeeOptions()}
          </View>
          <View style={[styles.sectionContainer]}>
            <View style={[styles.customRow]}>
              <Loc style={[styles.customTitle, { flex: 1 }]} text="page.wallet.transfer.custom" />
              <Switch
                value={isCustomFee}
                onValueChange={(v) => this.onCustomFeeSwitchValueChange(v)}
              />
            </View>
            {this.renderCustomFee(isCustomFee)}
          </View>
        </View>
        <View
          style={[styles.sectionContainer, {
            opacity: enableConfirm ? 1 : 0.5,
            width: '100%',
            justifyContent: 'center',
          }, styles.lastBlockMarginBottom]}
          pointerEvents={enableConfirm ? 'auto' : 'none'}
        >
          {/*
                // Replace ConfirmSlider with Button component temporaryly.
                <ConfirmSlider // All parameter should be adjusted for the real case
                ref={(ref) => { this.confirmSlider = ref; }}
                width={screen.width - 50}
                buttonSize={(screen.width - 50) / 8}
                buttonColor="transparent" // color for testing purpose, make sure use proper color afterwards
                borderColor="transparent" // color for testing purpose, make sure use proper color afterwards
                backgroundColor="#f3f3f3" // color for testing purpose, make sure use proper color afterwards
                textColor="#37474F" // color for testing purpose, make sure use proper color afterwards
                borderRadius={(screen.width - 50) / 16}
                okButton={{ visible: true, duration: 400 }}
                  // onVerified={this.onConfirmSliderVerified}
                onVerified={async () => {
                  if (global.passcode) {
                    showPasscode('verify', this.onConfirmSliderVerified, this.confirmSlider.reset);
                  } else {
                    await this.onConfirmSliderVerified();
                  }
                }}
                icon={(
                  <Image
                    source={isConfirm ? circleCheckIcon : circleIcon}
                    style={{ width: 32, height: 32 }}
                  />
                  )}
                label={isConfirm ? strings('page.wallet.transfer.CONFIRMED') : strings('page.wallet.transfer.slideConfirm')}
              /> */}
          <Button style={styles.confirmButton} text="button.Confirm" onPress={this.onConfirmPress} />
        </View>
      </BasePageGereral>
    );
  }
}

Transfer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  prices: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currency: PropTypes.string.isRequired,
  callAuthVerify: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  prices: state.Wallet.get('prices'),
  currency: state.App.get('currency'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  language: state.App.get('language'),
  isFingerprint: state.App.get('fingerprint'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
  callAuthVerify: (callback, fallback) => dispatch(
    appActions.callAuthVerify(callback, fallback),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);

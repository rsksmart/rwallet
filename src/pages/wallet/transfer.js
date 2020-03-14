import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import rsk3 from 'rsk3';
import color from '../../assets/styles/color.ts';
import RadioGroup from './transfer.radio.group';
import Loc from '../../components/common/misc/loc';
import { createErrorNotification } from '../../common/notification.controller';
import { createErrorConfirmation } from '../../common/confirmation.controller';
import appActions from '../../redux/app/actions';
import Transaction from '../../common/transaction';
import common from '../../common/common';
import { strings } from '../../common/i18n';
import Button from '../../components/common/button/button';
import OperationHeader from '../../components/headers/header.operation';
import BasePageGereral from '../base/base.page.general';
import CONSTANTS from '../../common/constants';
import parseHelper from '../../common/parse';
import definitions from '../../common/definitions';
import config from '../../../config';

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

const {
  MAX_FEE_TIMES, PLACEHODLER_AMOUNT, NUM_OF_FEE_LEVELS,
} = CONSTANTS;

// const addressIcon = require('../../assets/images/icon/address.png');

class Transfer extends Component {
  static navigationOptions = () => ({
    header: null,
    gesturesEnabled: false,
  });

  static generateAmountPlaceholderText(symbol, decimalPlaces, currency, prices) {
    const amountText = common.getBalanceString(PLACEHODLER_AMOUNT, decimalPlaces);
    let amountPlaceholderText = `${amountText} ${symbol}`;
    if (!_.isEmpty(prices)) {
      const currencySymbol = common.getCurrencySymbol(currency);
      const amountValue = common.getCoinValue(PLACEHODLER_AMOUNT, symbol, currency, prices);
      if (amountValue) {
        const amountValueText = common.getAssetValueString(amountValue, amountValue);
        amountPlaceholderText += ` (${currencySymbol}${amountValueText})`;
      }
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
      // isConfirm: false,
      enableConfirm: false,
      isCustomFee: false,
      customFee: null,
      customFeeValue: new BigNumber(0),
      feeSymbol: null,
      feeSliderValue: 0,
      amountPlaceholderText: '',
      levelFees: null, // [ { fee, value }... ]
    };

    const { navigation: { state: { params: { coin } } } } = props;
    this.coin = coin;

    this.txFeesCache = {};
    this.isRequestSendAll = false;

    // BTC transfer data
    this.minCustomFee = null;
    this.maxCustomFee = null;

    // Rsk transfer data
    this.gas = null;
    this.minCustomGasPrice = null;
    this.maxCustomGasPrice = null;

    // form data validation state
    this.isAmountValid = false;
    this.isAddressValid = false;

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
    this.onAmountInputBlur = this.onAmountInputBlur.bind(this);
    this.onToInputBlur = this.onToInputBlur.bind(this);
    this.onMemoInputBlur = this.onMemoInputBlur.bind(this);
    this.onAmountInputChangeText = this.onAmountInputChangeText.bind(this);
    this.requestFees = this.requestFees.bind(this);
  }

  componentDidMount() {
    this.initContext();
  }

  componentWillReceiveProps(nextProps) {
    const { prices, currency } = nextProps;
    const { prices: curPrices } = this.props;
    const { symbol, decimalPlaces } = this.coin;

    if (prices && prices !== curPrices) {
      const { customFee, feeSymbol } = this.state;
      const customFeeValue = common.getCoinValue(customFee, feeSymbol, currency, prices);
      const amountPlaceholderText = Transfer.generateAmountPlaceholderText(symbol, decimalPlaces, currency, prices);
      this.setState({ customFeeValue, amountPlaceholderText });
    }
  }

  onGroupSelect(index) {
    this.setState({ feeLevel: index, isCustomFee: false });
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
    const { customFee, customFeeValue } = this.calcCustomFee(value);
    this.setState({ customFee, customFeeValue });
  }

  onCustomFeeSlidingComplete(value) {
    this.setState({ feeSliderValue: value });
  }

  onSendAllPress() {
    const { balance, decimalPlaces } = this.coin;
    // If balance data have not received from server (user enter this page quickly), return without setState.
    if (_.isNil(balance)) {
      return;
    }
    const amount = common.getBalanceString(balance, decimalPlaces);
    this.inputAmount(amount, () => {
      this.isRequestSendAll = true;
      this.isAmountValid = true;
      this.requestFees();
    });
  }

  async onConfirmPress() {
    const { addNotification } = this.props;
    const { symbol, type, networkId } = this.coin;
    const { amount, to } = this.state;
    // This app use checksum address with chainId, but some third-party app use web3 address,
    // so we need to convert input address to checksum address with chainId before validation and transfer
    // https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md
    let toAddress = to;
    if (symbol !== 'BTC') {
      try {
        toAddress = rsk3.utils.toChecksumAddress(to, networkId);
      } catch (error) {
        const notification = createErrorNotification(
          'modal.invalidAddress.title',
          'modal.invalidAddress.body',
        );
        addNotification(notification);
        return;
      }
    }
    if (!this.validateFormData(amount, toAddress, symbol, type, networkId)) {
      // this.resetConfirm();
      return;
    }
    const { showPasscode } = this.props;
    if (global.passcode) {
      // showPasscode('verify', this.onConfirmSliderVerified, this.resetConfirm);
      showPasscode('verify', () => this.confirm(toAddress), () => {});
    } else {
      // await this.onConfirmSliderVerified();
      await this.confirm(toAddress);
    }
  }

  onAmountInputBlur() {
    const { amount } = this.state;
    if (_.isEmpty(amount)) return;
    this.isAmountValid = this.validateAmount(amount);
    if (!this.isAmountValid) return;
    this.requestFees();
  }

  onToInputBlur() {
    const { to } = this.state;
    const { symbol, type, networkId } = this.coin;
    if (_.isEmpty(to)) return;
    this.isAddressValid = this.validateAddress(to, symbol, type, networkId);
    if (!this.isAddressValid) return;
    this.requestFees();
  }

  onMemoInputBlur() {
    this.requestFees();
  }

  onAmountInputChangeText(text) {
    this.isRequestSendAll = false;
    this.inputAmount(text);
  }

  getFeeParams() {
    const {
      levelFees, feeSymbol, isCustomFee, feeLevel, customFee,
    } = this.state;
    let feeParams = null;
    if (feeSymbol === 'BTC') {
      const fee = isCustomFee ? customFee : levelFees[feeLevel].fee;
      feeParams = { fees: common.btcToSatoshiHex(fee) };
    } else {
      const { gas, customGasPrice } = this;
      const gasPrice = isCustomFee ? customGasPrice : levelFees[feeLevel].gasPrice;
      feeParams = { gas, gasPrice: gasPrice.decimalPlaces(0).toString() };
    }
    return feeParams;
  }

  calcCustomFee(value) {
    const { currency, prices } = this.props;
    const { feeSymbol } = this.state;
    let customFeeValue = null;
    let customFee = null;
    if (feeSymbol === 'BTC') {
      const { minCustomFee, maxCustomFee } = this;
      customFee = minCustomFee.plus((maxCustomFee.minus(minCustomFee)).times(value));
      customFeeValue = common.getCoinValue(customFee, feeSymbol, currency, prices);
    } else {
      const { minCustomGasPrice, maxCustomGasPrice, gas } = this;
      this.customGasPrice = minCustomGasPrice.plus((maxCustomGasPrice.minus(minCustomGasPrice)).times(value));
      customFee = common.convertUnitToCoinAmount(feeSymbol, this.customGasPrice.times(gas));
      customFeeValue = common.getCoinValue(customFee, feeSymbol, currency, prices);
    }
    return { customFee, customFeeValue };
  }

  async loadTransactionFees(symbol, type, address, to, amount, memo) {
    const { navigation, addConfirmation } = this.props;
    const { amount: lastAmount, to: lastTo, memo: lastMemo } = this.txFeesCache;
    const fee = symbol === 'BTC' ? common.btcToSatoshiHex(amount) : common.rskCoinToWeiHex(amount);
    try {
      console.log(`amount: ${amount}, to: ${to}, memo: ${memo}`);
      console.log(`lastAmount: ${lastAmount}, lastTo: ${lastTo}, lastMemo: ${lastMemo}`);
      if (amount === lastAmount && to === lastTo && memo === lastMemo) {
        return null;
      }
      this.setState({ loading: true });
      const transactionFees = await parseHelper.getTransactionFees(symbol, type, address, to, fee, memo);
      this.setState({ loading: false });
      console.log('transactionFees: ', transactionFees);
      this.txFeesCache = {
        amount, to, memo, transactionFees,
      };
      return transactionFees;
    } catch (error) {
      // If error, let user try again or quit.
      this.setState({ loading: false });
      console.log('loadTransactionFees, error: ', error);
      const confirmation = createErrorConfirmation(
        definitions.defaultErrorNotification.title,
        definitions.defaultErrorNotification.message,
        'button.retry',
        this.requestFees,
        () => navigation.goBack(),
      );
      addConfirmation(confirmation);
      return null;
    }
  }

  async requestFees() {
    const { symbol, type, address } = this.coin;
    const { amount, to } = this.state;
    const { memo } = this.state;
    const { isAmountValid, isAddressValid } = this;

    const isValid = !_.isEmpty(amount) && !_.isEmpty(to) && isAmountValid && isAddressValid;
    console.log('requestFees, isValid: ', isValid);
    if (!isValid) return;
    const transactionFees = await this.loadTransactionFees(symbol, type, address, to, amount, memo);
    if (!transactionFees) return;
    this.processFees(transactionFees);
  }

  processFees(transactionFees) {
    console.log('processFees, transactionFees: ', transactionFees);
    const { prices, currency } = this.props;
    const {
      feeSymbol, feeSliderValue, isCustomFee, feeLevel, amount, customFee,
    } = this.state;
    const { isRequestSendAll, coin } = this;
    const { symbol } = coin;

    // Calculates levelFees
    const levelFees = [];
    if (feeSymbol === 'BTC') {
      // Calculates BTC levelFees
      const { fees: { low, medium, high } } = transactionFees;
      for (let i = 0; i < NUM_OF_FEE_LEVELS; i += 1) {
        const txFees = [low, medium, high];
        const fee = common.convertUnitToCoinAmount(feeSymbol, txFees[i]);
        const value = common.getCoinValue(fee, feeSymbol, currency, prices);
        levelFees.push({ fee, value });
      }
      this.minCustomFee = levelFees[0].fee;
      this.maxCustomFee = levelFees[NUM_OF_FEE_LEVELS - 1].fee.times(MAX_FEE_TIMES);
    } else {
      // Calculates Rootstock tokens(RBTC, RIF, DOC...) levelFees
      const { gas, gasPrice: { low, medium, high } } = transactionFees;
      this.gas = new BigNumber(gas);
      const txPrices = [low, medium, high];
      for (let i = 0; i < NUM_OF_FEE_LEVELS; i += 1) {
        const gasPrice = new BigNumber(txPrices[i]);
        const gasFee = this.gas.times(gasPrice);
        const fee = common.convertUnitToCoinAmount(feeSymbol, gasFee);
        const value = common.getCoinValue(fee, feeSymbol, currency, prices);
        levelFees.push({ fee, value, gasPrice });
      }
      console.log('levelFees: ', levelFees);
      this.minCustomGasPrice = levelFees[0].gasPrice;
      this.maxCustomGasPrice = levelFees[NUM_OF_FEE_LEVELS - 1].gasPrice.times(MAX_FEE_TIMES);
    }

    this.setState({ levelFees });

    let newCustomFee = customFee;

    // Update custom fee
    if (isCustomFee) {
      const { customFee: newFee, customFeeValue } = this.calcCustomFee(feeSliderValue);
      newCustomFee = newFee;
      this.setState({ customFee: newCustomFee, customFeeValue });
    }

    // If user request send all, we need to adjust amount text.
    // We can only use the rest money without fees for transfers
    if (isRequestSendAll) {
      if (symbol === 'BTC' || symbol === 'RBTC') {
        this.adjustSendAllAmount(levelFees, feeLevel, isCustomFee, newCustomFee, amount);
      }
      this.isRequestSendAll = false;
    }
  }

  adjustSendAllAmount(levelFees, feeLevel, isCustomFee, customFee, amount) {
    const { feeSymbol } = this.state;
    let restAmount = null;
    if (isCustomFee) {
      restAmount = new BigNumber(amount).minus(customFee);
    } else {
      restAmount = new BigNumber(amount).minus(levelFees[feeLevel].fee);
    }
    restAmount = restAmount.isGreaterThan(0) ? restAmount : new BigNumber(0);
    const restAmountText = common.getBalanceString(restAmount, config.symbolDecimalPlaces[feeSymbol]);
    this.inputAmount(restAmountText);
    this.txFeesCache.amount = restAmountText;
  }

  initContext() {
    const { prices, currency } = this.props;
    const { symbol, decimalPlaces } = this.coin;
    console.log('prices: ', prices);
    console.log('currency: ', currency);
    const feeSymbol = symbol === 'BTC' ? 'BTC' : 'RBTC';
    const amountPlaceholderText = Transfer.generateAmountPlaceholderText(symbol, decimalPlaces, currency, prices);
    this.setState({ feeSymbol, amountPlaceholderText });
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
    const isValidAmount = this.validateAmount(amount);
    if (!isValidAmount) return false;
    const isValidAddress = this.validateAddress(address, symbol, type, networkId);
    return isValidAddress;
  }

  validateAddress(address, symbol, type, networkId) {
    const { addNotification } = this.props;
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

  validateAmount(amount) {
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
    return true;
  }

  async confirm(toAddress) {
    const { navigation, addNotification } = this.props;
    const { coin } = this;
    const { memo } = this.state;
    const { amount } = this.state;
    try {
      this.setState({ loading: true });
      const feeParams = this.getFeeParams();
      const extraParams = { data: '', memo, gasFee: feeParams };
      let transaction = new Transaction(coin, toAddress, amount, extraParams);
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
      const buttonText = 'button.retry';
      let notification = null;
      if (error.code === 141) {
        const message = error.message.split('|');
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
      // this.resetConfirm();
    }
  }

  validateConfirmControl() {
    const { to, amount } = this.state;
    this.setState({ enableConfirm: to && amount });
  }

  inputAmount(text, callback) {
    this.setState({ amount: text });
    if (parseFloat(text) >= 0) {
      this.setState({ amount: text }, () => {
        this.validateConfirmControl();
        if (callback) {
          callback();
        }
      });
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
              {`${common.getBalanceString(customFee, config.symbolDecimalPlaces[feeSymbol])} ${feeSymbol}`}
              {customFeeValue && ` = ${currencySymbol}${common.getAssetValueString(customFeeValue)}`}
            </Text>
          </View>
        )}
      </View>

    );
  }

  renderFeeOptions() {
    const { currency } = this.props;
    const {
      feeSymbol, feeLevel, isCustomFee, levelFees,
    } = this.state;
    const currencySymbol = common.getCurrencySymbol(currency);
    const items = [];
    for (let i = 0; i < NUM_OF_FEE_LEVELS; i += 1) {
      let item = { coin: `0 ${feeSymbol}`, value: `${currencySymbol}0` };
      if (levelFees) {
        const { fee, value } = levelFees[i];
        const amountText = common.getBalanceString(fee, config.symbolDecimalPlaces[feeSymbol]);
        const valueText = value ? `${currencySymbol}${common.getAssetValueString(value)}` : '';
        item = { coin: `${amountText} ${feeSymbol}`, value: valueText };
      }
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
        onBlur={this.onMemoInputBlur}
      />
    );
  }

  render() {
    const {
      loading, to, amount, memo, /* isConfirm, */ isCustomFee, amountPlaceholderText,
      enableConfirm, levelFees,
    } = this.state;
    const { navigation } = this.props;
    const { coin } = this;
    const symbol = coin && coin.symbol;
    const type = coin && coin.type;
    const symbolName = common.getSymbolFullName(symbol, type);
    const title = `${strings('button.Send')} ${symbolName}`;

    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn={false}
        hasLoader
        isLoading={loading}
        headerComponent={<OperationHeader title={title} onBackButtonPress={() => navigation.goBack()} />}
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
                onChangeText={this.onAmountInputChangeText}
                onBlur={this.onAmountInputBlur}
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
                  this.setState({ to: text }, this.validateConfirmControl);
                }}
                onBlur={this.onToInputBlur}
              />
              {/* <TouchableOpacity style={styles.textInputIcon} onPress={this.onQrcodeScanPress} disabled>
                <Image source={addressIcon} />
              </TouchableOpacity> */}
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
                disabled={!levelFees}
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
          <Button style={styles.confirmButton} text="button.confirm" onPress={this.onConfirmPress} />
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
  addConfirmation: PropTypes.func.isRequired,
  prices: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currency: PropTypes.string.isRequired,
  showPasscode: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  prices: state.Wallet.get('prices'),
  currency: state.App.get('currency'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
  addConfirmation: (confirmation) => dispatch(
    appActions.addConfirmation(confirmation),
  ),
  showPasscode: (category, callback, fallback) => dispatch(
    appActions.showPasscode(category, callback, fallback),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);

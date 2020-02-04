import React from 'react';
import { Text, Platform } from 'react-native';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { Toast } from '@ant-design/react-native';
import * as bitcoin from 'bitcoinjs-lib';
import rsk3 from 'rsk3';
import config from '../../config';
import store from './storage';


const { consts: { currencies } } = config;
const DEFAULT_CURRENCY_SYMBOL = currencies[0].symbol;

// Extract currency symbols from config
// Generate {USD: '$', RMB: '￥', ARS: 'ARS$', KRW: '₩', JPY: '￥', GBP: '£',}
const currencySymbols = _.reduce(currencies, (obj, row) => {
  const settingsObj = obj;
  settingsObj[row.name] = row.symbol;
  return settingsObj;
}, {});

const common = {
  currentNavigation: null,
  isIphoneX() {
    // TODO
    // return DeviceInfo.getModel().toLowerCase().indexOf('iphone x') >= 0
    return false;
  },
  btcToSatoshiHex(amount) {
    const result = `0x${new BigNumber(amount).times('1e8').decimalPlaces(0).toString(16)}`;
    return result;
  },
  satoshiToBtc(satoshi) {
    const result = new BigNumber(satoshi).div('1e8');
    return result;
  },
  rbtcToWeiHex(amount) {
    const result = `0x${new BigNumber(amount).times('1e18').decimalPlaces(0).toString(16)}`;
    return result;
  },
  rbtcToWei(amount) {
    const result = new BigNumber(amount).times('1e18');
    return result;
  },
  weiToRbtc(wei) {
    const result = new BigNumber(wei).div('1e18');
    return result;
  },
  rifToWeiHex(amount) {
    const result = `0x${new BigNumber(amount).times('1e18').decimalPlaces(0).toString(16)}`;
    return result;
  },
  weiToRif(wei) {
    const result = new BigNumber(wei).div('1e18');
    return result;
  },
  Toast(text, type, onClose, duration, mask) {
    const last = duration > 0 ? duration : 1.5;
    if (type === 'success') {
      Toast.success(text, last, onClose, mask);
    } else if (type === 'fail') {
      Toast.fail(text, last, onClose, mask);
    } else { // none
      Toast.info(text, last, onClose, mask);
    }
  },
  convertUnitToCoinAmount(symbol, unitNumber) {
    let amount = null;
    switch (symbol) {
      case 'BTC':
        amount = common.satoshiToBtc(unitNumber);
        break;
      case 'RBTC':
        amount = common.weiToRbtc(unitNumber);
        break;
      case 'RIF':
        amount = common.weiToRif(unitNumber);
        break;
      default:
    }
    return amount;
  },
  /**
   * getBalanceString, diffrent symbol apply diffrent decimalPlaces, subfix 0 will be omitted.
   * The balance will be round down by default.
   * @param {string} symbol
   * @param {BigNumber | number | string} balance
   */
  getBalanceString(symbol, balance) {
    const decimalPlaces = config.symbolDecimalPlaces[symbol];
    if (!_.isNull(balance)) {
      let balanceBigNumber = balance;
      if (typeof balance === 'number' || typeof value === 'string') {
        balanceBigNumber = new BigNumber(balance);
      }
      return balanceBigNumber.decimalPlaces(decimalPlaces, BigNumber.ROUND_DOWN).toFixed();
    }
    return null;
  },
  /**
   * getAssetValueString, value apply default decimalPlaces, subfix 0 will be omitted.
   * @param {BigNumber | number | string} value
   */
  getAssetValueString(value) {
    if (!_.isNull(value)) {
      let valueBigNumber = value;
      if (typeof value === 'number' || typeof value === 'string') {
        valueBigNumber = new BigNumber(value);
      }
      return valueBigNumber.decimalPlaces(config.assetValueDecimalPlaces).toFixed();
    }
    return null;
  },
  getCoinPrice(symbol, currency, prices) {
    for (let i = 0; i < prices.length; i += 1) {
      const priceRow = prices[i];
      if (symbol === priceRow.symbol) {
        const price = priceRow.price[currency];
        return price;
      }
    }
    return null;
  },
  getCoinValue(amount, symbol, currency, prices) {
    if (!amount || !prices || prices.length === 0) {
      return null;
    }
    try {
      const price = this.getCoinPrice(symbol, currency, prices);
      const amountBigNumber = new BigNumber(amount);
      const value = amountBigNumber.times(price);
      return value;
    } catch (e) {
      console.error(e);
    }
    return null;
  },

  getCurrencyNames() {
    return _.map(currencies, (item) => item.name);
  },

  /**
   * Get currency symbol string for example '$' based on currency
  * @param {string} currency currency string such as 'USD'
  */
  getCurrencySymbol(currency) {
    if (currencySymbols[currency]) {
      return currencySymbols[currency];
    }

    return DEFAULT_CURRENCY_SYMBOL;
  },

  async updateInAppPasscode(input) {
    let passcode = null;
    if (input) {
      await store.setPasscode(input);
      // eslint-disable-next-line no-multi-assign
      global.passcode = passcode = input;
    } else {
      // eslint-disable-next-line no-multi-assign
      global.passcode = passcode = await store.getPasscode();
    }
    return passcode;
  },

  /**
   * getTransactionUrl, returns transaction url
   * @param {*} symbol, coin symbol
   * @param {*} type, coin network type
   * @param {*} hash, transaction hash
   */
  getTransactionUrl(symbol, type, hash) {
    let url = '';
    if (config.transactionUrls[symbol] && config.transactionUrls[symbol][type]) {
      url = config.transactionUrls[symbol][type];
    }
    url = `${url}/${hash}/`;
    return url;
  },

  /**
   * getLatestBlockHeight, return latestBlockHeight. If it's not found, return null.
   * @param {array} latestBlockHeights
   * @param {string} chain
   * @param {string} type, network type
   */
  getLatestBlockHeight(latestBlockHeights, chain, type) {
    const latestBlockHeight = _.find(latestBlockHeights, { chain, type });
    if (latestBlockHeight && latestBlockHeight.blockHeight) {
      return latestBlockHeight.blockHeight;
    }
    return null;
  },

  /**
   * Validate btc address
   * @param {string} address
   * @param {string} type, MainTest or Testnet
   */
  isBtcAddress(address, type) {
    // https://github.com/bitcoinjs/bitcoinjs-lib/issues/890
    // https://bitcoin.stackexchange.com/questions/52740/how-do-you-validate-a-bitcoin-address-using-bitcoinjs-library-in-javascript
    try {
      let network = null;
      if (type === 'Testnet') {
        network = bitcoin.networks.testnet;
      }
      bitcoin.address.toOutputScript(address, network);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Validate wallet address
   * @param {string} address
   * @param {string} symbol, BTC, RBTC, RIF
   * @param {string} type, MainTest or Testnet
   */
  isWalletAddress(address, symbol, type) {
    let isAdress = false;
    if (symbol === 'BTC') {
      isAdress = this.isBtcAddress(address, type);
    } else {
      const checksumAddress = rsk3.utils.toChecksumAddress(address);
      isAdress = rsk3.utils.isAddress(checksumAddress);
    }
    return isAdress;
  },

  /**
   * Validate amount
   * @param {string} str
   */
  isAmount(str) {
    const regex = /^\d*\.{0,1}\d+$/g;
    return regex.test(str);
  },

  /**
   * Set default font family for android, solve cut-off problem for some android device
   * Oppo A77 - Some texts gets cut-off
   * solution: Set app default font family, instead of system font
   * see https://github.com/facebook/react-native/issues/15114
   */
  setDefaultFontFamily() {
    if (Platform.OS !== 'android') {
      return;
    }

    const oldRender = Text.render;
    Text.render = (...args) => {
      const origin = oldRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [{ fontFamily: config.defaultFontFamily }, origin.props.style],
      });
    };
  },

  /**
   * getSymbolFullName
   * @param {string} symbol, BTC, RBTC, RIF
   * @param {string} type, MainTest or Testnet
   */
  getSymbolFullName(symbol, type) {
    return `${type === 'Testnet' ? 'Test' : ''} ${symbol}`;
  },
};

export default common;

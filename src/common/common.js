import React from 'react';
import { Text, Platform } from 'react-native';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { Toast } from '@ant-design/react-native';
import * as bitcoin from 'bitcoinjs-lib';
import Rsk3 from '@rsksmart/rsk3';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { randomBytes } from 'react-native-randombytes';
import moment from 'moment';
// import moment locales
import 'moment/locale/zh-cn';
import 'moment/locale/es';
import 'moment/locale/pt';
import config from '../../config';
import I18n from './i18n';
import definitions from './definitions';

const { consts: { currencies, supportedTokens } } = config;
const DEFAULT_CURRENCY_SYMBOL = currencies[0].symbol;

// Default BTC transaction size
const DEFAULT_BTC_TX_SIZE = 400;

// more than 24 hours is considered a day
// https://momentjs.com/docs/#/customization/relative-time/
moment.relativeTimeThreshold('h', 24);

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
  rskCoinToWeiHex(amount) {
    const result = `0x${this.rskCoinToWei(amount).decimalPlaces(0).toString(16)}`;
    return result;
  },
  rskCoinToWei(amount) {
    const result = new BigNumber(amount).times('1e18');
    return result;
  },
  weiToCoin(wei) {
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
  /**
   * convertUnitToCoinAmount, if unitNumber is nil, return null
   * @param {*} symbol
   * @param {*} unitNumber
   */
  convertUnitToCoinAmount(symbol, unitNumber) {
    if (_.isNil(unitNumber)) {
      return null;
    }
    const amount = symbol === 'BTC' ? common.satoshiToBtc(unitNumber) : common.weiToCoin(unitNumber);
    return amount;
  },

  /**
   * getAmountBigNumber, diffrent symbol apply diffrent decimalPlaces, subfix 0 will be omitted.
   * The result will be round down by default.
   * @param {BigNumber | number | string} amount
   * @param {string} symbol
   * @returns number
   */
  getAmountBigNumber(amount, symbol) {
    const decimalPlaces = this.getSymbolDecimalPlaces(symbol);
    if (_.isNull(amount) || !(typeof amount === 'number' || typeof amount === 'string' || BigNumber.isBigNumber(amount))) {
      return null;
    }
    let amountBigNumber = amount;
    if (typeof amount === 'number' || typeof amount === 'string') {
      amountBigNumber = new BigNumber(amount);
    }
    return amountBigNumber.decimalPlaces(decimalPlaces, BigNumber.ROUND_DOWN);
  },

  /**
   * getBalanceString, diffrent symbol apply diffrent decimalPlaces, subfix 0 will be omitted.
   * The balance will be round down by default.
   * @param {BigNumber | number | string} balance
   * @param {string} symbol
   */
  getBalanceString(balance, symbol) {
    const amountBigNumber = this.getAmountBigNumber(balance, symbol);
    return amountBigNumber.toFixed();
  },

  /**
   * formatAmount, diffrent symbol apply diffrent decimalPlaces, subfix 0 will be omitted.
   * The result will be round down by default.
   * @param {BigNumber | number | string} amount
   * @param {string} symbol
   * @returns number
   */
  formatAmount(amount, symbol) {
    const amountBigNumber = this.getAmountBigNumber(amount, symbol);
    return amountBigNumber.toNumber();
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
  getCoinValue(amount, symbol, type, currency, prices) {
    if (type === 'Testnet') {
      return new BigNumber(0);
    }
    if (!amount || !prices || prices.length === 0) {
      return null;
    }
    try {
      const price = this.getCoinPrice(symbol, currency, prices);
      if (!price) {
        return null;
      }
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

  /**
   * getTransactionUrl, returns transaction url
   * @param {*} symbol, coin symbol
   * @param {*} type, coin network type
   * @param {*} hash, transaction hash
   */
  getTransactionUrl(symbol, type, hash) {
    let url = symbol === 'BTC' ? config.transactionUrls[symbol][type] : config.transactionUrls.RBTC[type];
    // BTC has / suffix, RSK does not.
    // For example:
    // BTC, https://live.blockcypher.com/btc-testnet/tx/5c1d076fd99db0313722afdfc4d16221c4f3429cdad2410f6056f5357f569533/
    // RSK, https://explorer.rsk.co/tx/0x1b62fedd34d6d27955997be55703285d004b77d38f345ed0d99f291fcef64358
    url = `${url}/${hash}${symbol === 'BTC' ? '/' : ''}`;
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
   * As long as it can be converted into rsk checksum address, it is a valid rsk address.
   * @param {string} address
   * @param {string} symbol, BTC, RBTC, RIF
   * @param {string} type, MainTest or Testnet
   * @param {string} networkId
   */
  isWalletAddress(address, symbol, type, networkId) {
    if (symbol === 'BTC') {
      return common.isBtcAddress(address, type);
    }
    try {
      Rsk3.utils.toChecksumAddress(address, networkId);
      return true;
    } catch (error) {
      return false;
    }
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
   * getSymbolName
   * @param {string} symbol, BTC, RBTC, RIF...
   * @param {string} type, MainTest or Testnet
   */
  getSymbolName(symbol, type) {
    return `${type === 'Testnet' ? 't' : ''}${symbol}`;
  },

  async isFingerprintAvailable() {
    try {
      const biometryType = await FingerprintScanner.isSensorAvailable();
      if (biometryType === 'Touch ID' || biometryType === 'Fingerprint') {
        return true;
      }
    } catch (error) {
      console.log('The device does not support fingerprint');
    }
    return false;
  },

  getRandom(count) {
    return new Promise((resolve, reject) => randomBytes(count, (err, bytes) => {
      if (err) reject(err);
      else resolve(bytes);
    }));
  },

  /**
   * Add or update tokens' price
   * Returns new prices array
   * @param {*} prices
   */
  addPriceData(prices) {
    if (_.isEmpty(prices)) {
      return [];
    }
    // DOC value is 1 dollar, convert to other currencies by btc price
    const newPrice = _.clone(prices);
    const btcPrice = _.find(newPrice, { symbol: 'BTC' });
    const usdPrice = parseFloat(btcPrice.price.USD);
    const btcPriceKeys = _.keys(btcPrice.price);
    let docPrice = _.find(newPrice, { symbol: 'DOC' });
    if (_.isUndefined(docPrice)) {
      docPrice = { symbol: 'DOC' };
      newPrice.push(docPrice);
    }
    if (_.isUndefined(docPrice.price)) {
      docPrice.price = {};
    }
    docPrice.price.USD = '1';
    _.each(btcPriceKeys, (key) => {
      if (key !== 'USD') {
        const currency = parseFloat(btcPrice.price[key]);
        docPrice.price[key] = (currency / usdPrice).toString();
      }
    });
    return newPrice;
  },

  setLanguage(language) {
    I18n.locale = language;
  },

  setMomentLocale(locale) {
    const newLocale = locale === 'zh' ? 'zh-cn' : locale;
    moment.locale(newLocale);
  },

  estimateBtcSize({
    netType, amount, transactions, fromAddress, destAddress, privateKey, isSendAllBalance,
  }) {
    console.log(`estimateBtcSize, isSendAllBalance: ${isSendAllBalance}`);
    const inputTxs = [];
    let sum = new BigNumber(0);

    // If the transactions is empty, returns the default size
    if (_.isEmpty(transactions)) {
      return DEFAULT_BTC_TX_SIZE;
    }

    // Find out transactions which combines amount
    for (let i = 0; i < transactions.length; i += 1) {
      const tx = transactions[i];
      if (tx.status === definitions.txStatus.SUCCESS) {
        const txAmount = this.convertUnitToCoinAmount('BTC', tx.value);
        sum = sum.plus(txAmount);
        inputTxs.push(tx.hash);
      }
      if (sum.isGreaterThanOrEqualTo(amount)) {
        break;
      }
    }
    console.log(`estimateBtcSize, inputTxs: ${JSON.stringify(inputTxs)}`);

    const outputSize = isSendAllBalance ? 1 : 2;
    const network = netType === 'Mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
    const exParams = { network };
    const key = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), exParams);
    const tx = new bitcoin.TransactionBuilder(network);
    _.each(inputTxs, (inputTx) => {
      tx.addInput(inputTx, outputSize);
    });
    tx.addOutput(destAddress, 0);
    if (isSendAllBalance) {
      tx.addOutput(fromAddress, 0);
    }
    _.each(inputTxs, (inputTx, index) => {
      tx.sign(index, key);
    });
    const result = tx.build().toHex();
    const size = result.length / 2;
    console.log(`estimateBtcSize, inputSize: ${inputTxs.length}, outputSize: ${outputSize}, size: ${size}`);
    return size;
  },

  /**
   * parse account from derivation path.
   * derivation path, // m / purpose' / coin_type' / account' / change / address_index
   * @param {*} derivationPath
   * @returns If derivationPath is valid, returns account, else returns '0'.
   */
  parseAccountFromDerivationPath(derivationPath) {
    if (derivationPath) {
      try {
        const accountField = derivationPath.split('/')[3];
        // BTC: "m/44'/0'/1'/0/0"
        // accountField.length - 1 is for removing the quote in 1'
        return accountField.substr(0, accountField.length - 1);
      } catch (error) {
        console.warn(`derivationPath can't be parsed, derivationPath: ${derivationPath}, error: `, error);
        return '0';
      }
    }
    return '0';
  },
  /**
   * sortTokens
   * sort tokens by config.supportedTokens. If token is custom token, Should be at the end of the list.
   * If two tokens are custom token, compare by unicode of symbol.
   * @param {Array} tokens, array of objects {symbol, token}
   * @returns array of sorted objects
   */
  sortTokens(tokens) {
    return tokens.sort((a, b) => {
      if (a.type !== b.type) {
        return b.type === 'Testnet' ? -1 : 1;
      }
      let symbolIndexA = _.findIndex(supportedTokens, (token) => a.symbol === token);
      // If token is not found in supportedTokens, indicating it is a custom token, Should be at the end of the list
      symbolIndexA = symbolIndexA !== -1 ? symbolIndexA : Number.MAX_SAFE_INTEGER;
      let symbolIndexB = _.findIndex(supportedTokens, (token) => b.symbol === token);
      symbolIndexB = symbolIndexB !== -1 ? symbolIndexB : Number.MAX_SAFE_INTEGER;
      if (symbolIndexA === symbolIndexB) {
        // compare by unicode of symbol
        return a.symbol < b.symbol ? -1 : 1;
      }
      return symbolIndexA - symbolIndexB;
    });
  },

  getSymbolDecimalPlaces(symbol) {
    return config.symbolDecimalPlaces[symbol] || config.symbolDecimalPlaces.CustomToken;
  },

  isValidRnsSubdomain(text) {
    const regex = /(([a-z0-9])+\.)+rsk$/g;
    return regex.test(text);
  },

  /**
   * Get short address, omit middle part of rsk token address.
   * For example, If address is 0xBB18Df33A915A2CFf0cAF0eDd59BD3e7606d0a83,
   * returns 0xBB18Df33...606d0a83.
   * @param {*} address, rsk token address
   * @param {*} length, remains length of head and tail
   */
  getShortAddress(address, length = 8) {
    const prefix = address.substr(0, length + 2);
    const suffix = address.substr(address.length - length, address.length - 1);
    const result = `${prefix}...${suffix}`;
    return result;
  },

  getFullDomain(subdomain) {
    return `${subdomain}.${config.rnsDomain}`;
  },
};

export default common;

import React from 'react';
import { Text, Platform } from 'react-native';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { Toast } from '@ant-design/react-native';
import * as bitcoin from 'bitcoinjs-lib';
import Rsk3 from '@rsksmart/rsk3';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { randomBytes } from 'react-native-randombytes';
import InputDataDecoder from 'rn-ethereum-input-data-decoder';
import moment from 'moment';
// import moment locales
import 'moment/locale/zh-cn';
import 'moment/locale/es';
import 'moment/locale/pt';
import 'moment/locale/pt-br';
import 'moment/locale/ja';
import 'moment/locale/ko';
import 'moment/locale/ru';
import config from '../../config';
import I18n from './i18n';
import { BIOMETRY_TYPES, CustomToken } from './constants';
import cointype from './wallet/cointype';
import { InvalidAddressError, InvalidParamError } from './error';

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
  store: undefined,
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
  rskCoinToWeiHex(amount, precision) {
    return `0x${this.rskCoinToWei(amount, precision).decimalPlaces(0).toString(16)}`;
  },
  /**
   * Transform coin value to wei unit. Throw InvalidParamError If param is not valid.
   * Example: RIF, precision = 18, 0.001 RIF = 1e15 (wei) RIF
   * Example: SOL, precision = 2, 1 SOL = 100 (wei) SOL
   * @param {*} amount
   * @param {*} precision
   */
  rskCoinToWei(amount, precision = 18) {
    if (!(amount
      && (BigNumber.isBigNumber(amount) || _.isNumber(amount) || _.isString(amount)))) {
      throw new InvalidParamError();
    }
    if (!_.isNumber(precision)) {
      throw new InvalidParamError();
    }
    const precisionInteger = _.floor(Number(precision));
    return new BigNumber(amount).times(`1e${precisionInteger}`);
  },

  /**
   * Transform wei unit value to coin value. Throw InvalidParamError If param is not valid.
   * Example: RIF, precision = 18, 1e15 (wei) RIF = 0.001 RIF
   * Example: SOL, precision = 2, 100 (wei) SOL = 1 SOL
   * @param {*} wei
   * @param {*} precision
   */
  weiToCoin(wei, precision = 18) {
    if (!(wei
      && (BigNumber.isBigNumber(wei) || _.isNumber(wei) || (_.isString(wei) && wei.startsWith('0x'))))) {
      throw new InvalidParamError();
    }
    if (!_.isNumber(precision)) {
      throw new InvalidParamError();
    }
    const precisionInteger = _.floor(Number(precision));
    return new BigNumber(wei).div(`1e${precisionInteger}`);
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
   * convertCoinAmountToUnitHex, if coinAmount is nil, return null
   * @param {*} symbol
   * @param {*} coinAmount
   * @param {*} precision
   */
  convertCoinAmountToUnitHex(symbol, coinAmount, precision = 18) {
    if (_.isNil(coinAmount)) {
      return null;
    }

    return symbol === 'BTC' ? common.btcToSatoshiHex(coinAmount) : common.rskCoinToWeiHex(coinAmount, precision);
  },
  /**
   * convertUnitToCoinAmount, if unitNumber is nil, return null
   * @param {*} symbol
   * @param {*} unitNumber
   * @param {*} precision
   */
  convertUnitToCoinAmount(symbol, unitNumber, precision = 18) {
    if (_.isNil(unitNumber)) {
      return null;
    }
    return symbol === 'BTC' ? common.satoshiToBtc(unitNumber) : common.weiToCoin(unitNumber, precision);
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
   * getAddressUrl, returns transaction url
   * @param {*} symbol, coin symbol
   * @param {*} type, coin network type
   * @param {*} hash, transaction hash
   */
  getAddressUrl(type, address) {
    let url = config.addressUrls.RBTC[type];
    // BTC has / suffix, RSK does not.
    // For example:
    // BTC, https://live.blockcypher.com/btc-testnet/tx/5c1d076fd99db0313722afdfc4d16221c4f3429cdad2410f6056f5357f569533/
    // RSK, https://explorer.rsk.co/tx/0x1b62fedd34d6d27955997be55703285d004b77d38f345ed0d99f291fcef64358
    url = `${url}/${address}`;
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
  isWalletAddress(address, symbol, type) {
    if (symbol === 'BTC') {
      return common.isBtcAddress(address, type);
    }
    try {
      const { networkId } = this.getCoinType(symbol, type);
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

  /**
   * Returns the biometry type.
   * iPhone: ("Touch ID", "Face ID"), Android: ("Fingerprint")
   * @returns {string} the device biometry type
   * @returns {null} if this device has no available biometry types
   */
  async getBiometryType() {
    try {
      const biometryType = await FingerprintScanner.isSensorAvailable();
      if (biometryType === BIOMETRY_TYPES.TOUCH_ID || biometryType === BIOMETRY_TYPES.FACE_ID || biometryType === BIOMETRY_TYPES.Biometrics) {
        return biometryType;
      }
    } catch (error) {
      console.log('The device does not support fingerprint, error: ', error);
    }
    return null;
  },

  getRandom(count) {
    return new Promise((resolve, reject) => randomBytes(count, (err, bytes) => {
      if (err) reject(err);
      else resolve(bytes);
    }));
  },

  /**
   * Init price object with { symbol, price: {} }
   * Return new price object
   * @param {symbol} the price symbol
   * @param {priceKeys} the price keys
   */
  initPriceObject(symbol, priceKeys) {
    const priceObject = { symbol, price: {} };
    _.each(priceKeys, (key) => {
      priceObject.price[key] = '0';
    });
    return priceObject;
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

    let rdocPrice = _.find(newPrice, { symbol: 'RDOC' });
    if (_.isUndefined(rdocPrice)) {
      rdocPrice = _.cloneDeep(docPrice);
      rdocPrice.symbol = 'RDOC';
      newPrice.push(rdocPrice);
    }

    let rifPrice = _.find(newPrice, { symbol: 'RIF' });
    if (_.isUndefined(rifPrice)) {
      rifPrice = this.initPriceObject('RIF', btcPriceKeys);
      newPrice.push(rifPrice);
    }

    let rifpPrice = _.find(newPrice, { symbol: 'RIFP' });
    if (_.isUndefined(rifpPrice)) {
      rifpPrice = _.cloneDeep(rifPrice);
      rifpPrice.symbol = 'RIFP';
      newPrice.push(rifpPrice);
    }
    return newPrice;
  },

  setLanguage(language) {
    I18n.locale = language;
  },

  normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
  },

  convertToMomentLocale(locale) {
    let newLocale = this.normalizeLocale(locale);
    // The locale code of Brazilian Portuguese is ptbr in Mi Note 9s and Mi Max.
    // We need to convert it to 'pt-br'.
    newLocale = newLocale === 'ptbr' ? 'pt-br' : newLocale;
    newLocale = newLocale === 'zh' ? 'zh-cn' : newLocale;
    return newLocale;
  },

  setMomentLocale(locale) {
    try {
      // pt-BR will be normalize to pt-br
      const newLocale = this.convertToMomentLocale(locale);
      moment.locale(newLocale);
    } catch (error) {
      console.warn('Failed to set moment locale, locale: ', locale);
    }
  },

  /**
   * estimateBtcTxSize, estimate BTC transaction size
   * @param {object} params, { netType, inputTxs, fromAddress, destAddress, privateKey, isSendAllBalance }
   * @returns {number} BTC transaction size
   */
  estimateBtcTxSize({
    netType, inputTxs, fromAddress, destAddress, privateKey, isSendAllBalance,
  }) {
    console.log(`estimateBtcSize, isSendAllBalance: ${isSendAllBalance}`);
    // If the transactions is empty, returns the default size
    if (_.isEmpty(inputTxs)) {
      return DEFAULT_BTC_TX_SIZE;
    }
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
    console.log(`estimateBtcTxSize, inputSize: ${inputTxs.length}, outputSize: ${outputSize}, size: ${size}`);
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
    const regex = /^(([a-z0-9])+\.)+rsk$/g;
    return regex.test(text);
  },

  getFullDomain(subdomain) {
    return `${subdomain}.${config.rnsDomain}`;
  },

  // set redux store
  setStore(store) {
    this.store = store;
  },

  // get redux store
  getStore() {
    return this.store;
  },

  // get domain from url
  getDomain(url) {
    try {
      let domain = url.toLowerCase();
      if (domain.startsWith('http://')) {
        domain = domain.substring(7, domain.length);
      }
      if (domain.startsWith('https://')) {
        domain = domain.substring(8, domain.length);
      }
      if (domain.startsWith('www.')) {
        domain = domain.substring(4, domain.length);
      }

      // delete sub route
      [domain] = _.split(domain, '/');

      // delete params
      [domain] = _.split(domain, '?');

      return domain;
    } catch (error) {
      return url;
    }
  },

  // completion dapp url with 'http'
  completionUrl(url) {
    try {
      let newUrl = url.toLowerCase();
      newUrl = (newUrl.startsWith('http://') || newUrl.startsWith('https://')) ? newUrl : `https://${newUrl}`;
      return newUrl;
    } catch (error) {
      return url;
    }
  },

  /**
   * Decode ethereum transaction input data
   * return contract function name, types and other info
   * For Example, abi = [{...}], input = '0x12kz....uoisaiw'
   * returns { method: 'registerOffChainDonation', type: ['address', 'unit256', 'uint256', 'string', 'bytes32'], ... }
   * @param {*} abi, contract address abi
   * @param {*} input, transaction's input
   */
  ethereumInputDecoder(abi, input) {
    const decoder = new InputDataDecoder(abi);
    const result = decoder.decodeData(input);
    return result;
  },

  UppercaseFirstLetter(letters) {
    return letters.charAt(0).toUpperCase() + letters.slice(1);
  },

  formatInputData(inputData, symbol) {
    if (!inputData) {
      return null;
    }
    const { inputs, names, types } = inputData;
    const result = {};
    _.forEach(inputs, (value, index) => {
      const key = this.UppercaseFirstLetter(names[index]);
      const type = types[index];
      if (type === 'address') {
        result[key] = this.ellipsisAddress(value);
      } else if (key === 'Value') {
        const unitAmount = new BigNumber(value.toString());
        const amount = this.convertUnitToCoinAmount(symbol, unitAmount);
        result[key] = `${amount} ${symbol}`;
      } else {
        result[key] = value;
      }
    });

    return result;
  },

  /**
   * Ellipsis a rsk address
   * For Example, address = '0xe62278ac258bda2ae6e8EcA32d01d4cB3B631257', showLength = 6, return '0xe62278...631257'
   * @param {*} address, a rsk address
   * @param {*} showLength, the length of shown characters at the start and the end
   */
  ellipsisAddress(address, showLength = 8) {
    if (!address) {
      return '';
    }
    const { length } = address;
    if (length <= (showLength * 2 + 2)) {
      return address;
    }
    if (address.startsWith('0x')) {
      return `0x${this.ellipsisString(address.substr(2, length), showLength)}`;
    }

    return this.ellipsisString(address, showLength);
  },

  /**
   * Ellipsis a string
   * For Example, string = '12aushd9123niasuhdu123', showLength = 6, return '12aush...hdu123'
   * @param {*} string, a string value
   * @param {*} showLength, the length of shown characters at the start and the end
   */
  ellipsisString(string, showLength) {
    if (!string) {
      return '';
    }
    const { length } = string;
    if (length <= (showLength * 2)) {
      return string;
    }
    return `${string.slice(0, showLength)}...${string.slice(length - showLength, length)}`;
  },

  getCoinId(symbol, type) {
    const foundSymbol = _.find(supportedTokens, (token) => token === symbol);
    if (foundSymbol) {
      return type === 'Mainnet' ? symbol : `${symbol}${type}`;
    }
    return type === 'Mainnet' ? CustomToken : `${CustomToken}${type}`;
  },

  getCoinType(symbol, type) {
    const coinId = this.getCoinId(symbol, type);
    return cointype[coinId];
  },

  // Returns a new random alphanumeric string of the given size.
  //
  // Note: to simplify implementation, the result has slight modulo bias,
  // because chars length of 62 doesn't divide the number of all bytes
  // (256) evenly. Such bias is acceptable for most cases when the output
  // length is long enough and doesn't need to be uniform.
  randomString(size, charRange) {
    if (size === 0) {
      throw new Error('Zero-length randomString is useless.');
    }

    const chars = charRange || ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      + 'abcdefghijklmnopqrstuvwxyz'
      + '0123456789');

    let objectId = '';
    const bytes = randomBytes(size);
    for (let i = 0; i < bytes.length; i += 1) {
      objectId += chars[bytes.readUInt8(i) % chars.length];
    }
    return objectId;
  },

  /**
   * getServerUrl, Return the url with the environment prefix. For example, the environment is development, url is development.rwallet.app.
   * @param {*} baseUrl
   * @param {*} environment
   */
  getServerUrl(baseUrl, environment) {
    if (!_.isEmpty(environment) && environment !== 'Production') {
      const regex = /^([\w.]*:\/\/)(.*)\S*/g;
      const matches = regex.exec(baseUrl);
      const url = `${matches[1]}${environment.toLowerCase()}.${matches[2]}`;
      return url;
    }
    return baseUrl;
  },

  toChecksumAddress(address, networkId) {
    let checksumAddress = null;
    try {
      checksumAddress = Rsk3.utils.toChecksumAddress(address, networkId);
    } catch (error) {
      throw new InvalidAddressError();
    }
    return checksumAddress;
  },

  getExplorerName(type) {
    return type === 'Mainnet' ? 'RSK Explorer' : 'RSK Testnet Explorer';
  },
};

export default common;

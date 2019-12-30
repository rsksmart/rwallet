import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { Toast } from '@ant-design/react-native';
import config from '../../config';

const { consts: { currencies } } = config;
const DEFAULT_CURRENCY_SYMBOL = '$';

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
    const result = `0x${new BigNumber(amount).times('1e8').toFixed(0).toString(16)}`;
    return result;
  },
  satoshiToBtc(satoshi) {
    const result = new BigNumber(satoshi).div('1e8');
    return result;
  },
  rbtcToWeiHex(amount) {
    const result = `0x${new BigNumber(amount).times('1e18').toFixed(0).toString(16)}`;
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
    const result = `0x${new BigNumber(amount).times('1e18').toFixed(0).toString(16)}`;
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
   * @param {string} symbol
   * @param {BigNumber | number | string} balance
   */
  getBalanceString(symbol, balance) {
    const decimalPlaces = config.symbolDecimalPlaces[symbol];
    if (balance) {
      let balanceBigNumber = balance;
      if (typeof balance === 'number' || typeof value === 'string') {
        balanceBigNumber = new BigNumber(balance);
      }
      return balanceBigNumber.decimalPlaces(decimalPlaces).toFixed();
    }
    return null;
  },
  /**
   * getAssetValueString, value apply default decimalPlaces, subfix 0 will be omitted.
   * @param {BigNumber | number | string} value
   */
  getAssetValueString(value) {
    if (value) {
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
};

export default common;

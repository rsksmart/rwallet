import Rsk3 from 'rsk3';
import BigNumber from 'bignumber.js';
import { Toast } from '@ant-design/react-native';

const common = {
  currentNavigation: null,
  isIphoneX() {
    // TODO
    // return DeviceInfo.getModel().toLowerCase().indexOf('iphone x') >= 0
    return false;
  },
  btcToSatoshiHex(amount) {
    const satoshi = new BigNumber(amount).times('10e8');
    const value = Rsk3.utils.toHex(satoshi);
    return value;
  },
  satoshiHexToBtc(satoshiHex) {
    const satoshi = new BigNumber(satoshiHex);
    const result = satoshi.dividedBy('10e8');
    return result;
  },
  rbtcToWeiHex(amount) {
    const wei = new BigNumber(amount).times('10e18');
    const value = Rsk3.utils.toHex(wei);
    return value;
  },
  weiHexToRbtc(weiHex) {
    const wei = new BigNumber(weiHex);
    const result = wei.dividedBy('10e18');
    return result;
  },
  rifToWeiHex(amount) {
    const wei = new BigNumber(amount).times('10e18');
    const value = Rsk3.utils.toHex(wei);
    return value;
  },
  weiHexToRif(weiHex) {
    const wei = new BigNumber(weiHex);
    const result = wei.dividedBy('10e18');
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
  convertHexToCoinAmount(symbol, hexNumber) {
    let amount = null;
    switch (symbol) {
      case 'BTC':
        amount = common.satoshiHexToBtc(hexNumber);
        break;
      case 'RBTC':
        amount = common.weiHexToRbtc(hexNumber);
        break;
      case 'RIF':
        // console.log(`wei: ${common.rifToWeiHex(1)}`);
        amount = common.weiHexToRif(hexNumber);
        break;
      default:
    }
    return amount;
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
};

export default common;

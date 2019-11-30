import Rsk3 from 'rsk3';
// import {DeviceInfo} from "./info";
import { Toast } from '@ant-design/react-native';

const common = {
  currentNavigation: null,
  isIphoneX() {
    // TODO
    // return DeviceInfo.getModel().toLowerCase().indexOf('iphone x') >= 0
    return false;
  },
  btcToSatoshiHex(amount) {
    const c = Math.floor(Number(amount) * 10e8);
    const value = Rsk3.utils.toHex(c);
    return value;
  },
  rbtcToWeiHex(amount) {
    const c = Math.floor(Number(amount) * 10e18);
    const value = Rsk3.utils.toHex(c);
    return value;
  },
  rifToWeiHex(amount) {
    const c = Math.floor(Number(amount) * 10e18);
    const value = Rsk3.utils.toHex(c);
    return value;
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
};

export default common;

import Rsk3 from 'rsk3';
// import {DeviceInfo} from "./info";

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
};

export default common;

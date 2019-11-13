// import {DeviceInfo} from "./info";

const common = {
  currentNavigation: null,
  isIphoneX() {
    // return DeviceInfo.getModel().toLowerCase().indexOf('iphone x') >= 0
    return false;
  },
};

export default common;

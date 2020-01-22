import { DEVICE } from './info';

const screenHelper = {
  iphoneXTopHeight: 24,
  iphoneXBottomHeight: 22,
};

screenHelper.topHeight = DEVICE.isIphoneX ? screenHelper.iphoneXTopHeight : 0;
screenHelper.bottomHeight = DEVICE.isIphoneX ? screenHelper.iphoneXBottomHeight : 0;

export default screenHelper;

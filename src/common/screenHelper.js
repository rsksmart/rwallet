import { DEVICE, screen } from './info';

const screenHelper = {
  iphoneXTopHeight: 24,
  iphoneXBottomHeight: 22,
};

screenHelper.topHeight = DEVICE.isIphoneX ? screenHelper.iphoneXTopHeight : 0;
screenHelper.bottomHeight = DEVICE.isIphoneX ? screenHelper.iphoneXBottomHeight : 0;
screenHelper.bottomButtonMargin = screen.height * 0.05;

export default screenHelper;

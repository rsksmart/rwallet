import { DEVICE } from './info';

const o = {
  headerHeight: 350,
  headerMarginTop: DEVICE.isIphoneX ? -150 + 24 : -150,
};

o.bodyMarginTop = o.headerHeight + o.headerMarginTop;

export default o;

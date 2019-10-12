import {Dimensions, Platform, StatusBar} from 'react-native'

let {height,width} =  Dimensions.get('window');
let screen = {
    width : width,
    height : height
};
//iphoneX or Xs
function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((SCREEN_HEIGHT === X_HEIGHT && SCREEN_WIDTH === X_WIDTH) ||
            (SCREEN_HEIGHT === X_WIDTH && SCREEN_WIDTH === X_HEIGHT))
    )
}
// iPhoneX Xs
const X_WIDTH = 375;
const X_HEIGHT = 812;

// iPhoneXR XsMax
const XR_WIDTH = 414;
const XR_HEIGHT = 896;
// screen
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

//iphoneXR or XsMAX
function isIphoneXR() {
    return (
        Platform.OS === 'ios' &&
        ((SCREEN_HEIGHT === XR_HEIGHT && SCREEN_WIDTH === XR_WIDTH) ||
            (SCREEN_HEIGHT === XR_WIDTH && SCREEN_WIDTH === XR_HEIGHT))
    )
}
let screenDim= Dimensions.get("screen");
let DEVICE={
    width:width,
    height:height,
    screenWidth: Platform.OS == 'ios'? width : screenDim.width,
    screenHeight:Platform.OS == 'ios'? height : screenDim.height,
    StatusBarHeight: StatusBar.currentHeight,
    android:Platform.OS === 'android',
    ios:Platform.OS == 'ios',
    isIphoneX:isIphoneX() || isIphoneXR(),
};

//分辨率自适应，避免小分辨率屏幕中UI过大
let scaling=null;
const basePx=375;
function px2db(px) {
    if(scaling===null)
        scaling=width/basePx;
    return px*scaling;
}

export {
    screen,
    DEVICE,
    px2db,
};

import {Text} from "react-native";
import React from "react";

import common from './common'
import BackBtn from '../components/common/buttons/back.btn.stateless'

import Setting from '../pages/mine/setting/mine.setting'
import Version from '../pages/mine/version/mine.version'


import Test1 from '../pages/test/test1'
import Test2 from '../pages/test/test2'
import Test3 from '../pages/test/test3'

import WalletAddIndex from '../pages/wallet/add.index'
import WalletSelectCurrency from '../pages/wallet/select.currency'
import WalletCreate from '../pages/wallet/create'

const defaultNavigationOptions = () => {
    return ({navigation}: any) => {
        common.currentNavigation = navigation;
        return {
            headerTitle: "",
            headerRight: <Text/>,
            headerLeft: <BackBtn navigation={navigation}/>,
            headerForceInset: {
                top: "always" // always/显示、never/隐藏
            },
            headerTitleStyle: {
                alignSelf: "center",
                textAlign: "center",
                flex: 1
            }
        };
    };
};

const routeConfigMap = {
    home: {
        Test1: {
            screen: Test1,
            path: "Test1",
            navigationOptions: () => ({
                headerTitle: "Testing 1 (dev)",
                headerRight: <Text/>,
                headerLeft: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        Test2: {
            screen: Test2,
            path: "Test2",
            navigationOptions: () => ({
                headerTitle: "Testing 2 (dev)",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        WalletAddIndex: {
            screen: WalletAddIndex,
            path: "WalletAddIndex",
            navigationOptions: () => ({
                headerTitle: "Add Wallet",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        WalletSelectCurrency: {
            screen: WalletSelectCurrency,
            path: "WalletSelectCurrency",
            navigationOptions: () => ({
                headerTitle: "Select Wallet Currency",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        WalletCreate: {
            screen: WalletCreate,
            path: "WalletCreate",
            navigationOptions: () => ({
                headerTitle: "BTC Wallet",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
    },
    mine: {
        Test3: {
            screen: Test3,
            path: "Test3",
            navigationOptions: () => ({
                headerTitle: "Testing 3 (dev)",
                headerRight: <Text/>,
                headerLeft: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        Setting: {
            screen: Setting
        },
        Version: {
            screen: Version
        }
    }
};

function _hasEqualKey(obj1, obj2): string | boolean {
    for (let o1 in obj1) {
        for (let o2 in obj2) {
            if (o1 === o2) {
                return o1;
            }
        }
    }
    return false;
}

const routeConfigMaps  = (() => {
    let ret = {};
    for (let key in routeConfigMap) {
        let crt = routeConfigMap[key];
        let equalKey = _hasEqualKey(ret, crt);
        if (equalKey) {
            console.error(`导航配置地图错误，定义了相同名称:${equalKey}`);
        }
        ret = {...ret, ...crt};
    }
    return ret;
})();

export {defaultNavigationOptions, routeConfigMaps};

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
import WalletRecovery from '../pages/wallet/recovery'
import RecoveryPhrase from '../pages/wallet/recovery.phrase'
import WalletTest from '../pages/wallet/test'
import WalletTest2 from '../pages/wallet/test2'
import WalletList from '../pages/wallet/list'
import StartPage from '../pages/start/start'
import TermsPage from '../pages/start/terms'


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
                headerTitle: "Create Wallet",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        WalletRecovery: {
            screen: WalletRecovery,
            path: "WalletRecovery",
            navigationOptions: () => ({
                headerTitle: "Recovery Wallet",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        RecoveryPhrase: {
            screen: RecoveryPhrase,
            path: "RecoveryPhrase",
            navigationOptions: () => ({
                headerTitle: "Recovery Phrase",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        WalletTest: {
            screen: WalletTest,
            path: "WalletTest",
            navigationOptions: () => ({
                headerTitle: "Wallet Test",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        WalletTest2: {
            screen: WalletTest2,
            path: "WalletTest2",
            navigationOptions: () => ({
                headerTitle: "Wallet Test2",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        WalletList: {
            screen: WalletList,
            path: "WalletList",
            navigationOptions: () => ({
                headerTitle: "Wallet List",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        StartPage: {
            screen: StartPage,
            path: "StartPage",
            navigationOptions: () => ({
                headerTitle: "StartPage",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
        TermsPage: {
            screen: TermsPage,
            path: "TermsPage",
            navigationOptions: () => ({
                headerTitle: "TermsPage",
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

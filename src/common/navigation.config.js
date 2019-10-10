import {Text} from "react-native";
import React from "react";

import common from './common'
import BackBtn from '../components/common/back.btn.stateless'

import Test1 from '../pages/test/test1'
import Test2 from '../pages/test/test2'
import Test3 from '../pages/test/test3'
import Test4 from '../pages/test/test4'

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
        }
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
        Test4: {
            screen: Test4,
            path: "Test4",
            navigationOptions: () => ({
                headerTitle: "Testing 4 (dev)",
                headerRight: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
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

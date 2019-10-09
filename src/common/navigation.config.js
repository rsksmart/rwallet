import {Text} from "react-native";
import React from "react";

import BackBtn from '../components/common/back.btn.stateless'

import Test from '../pages/test'

const defaultNavigationOptions = () => {
    return ({navigation}: any) => {
        // common.currentNavigation = navigation;
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
        Home: {
            screen: Test,
            navigationOptions: ({navigation}: any) => ({
                headerTitle: "Home Testing (dev)",
                headerRight: <Text/>,
                headerLeft: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        }
    },
    mine: {
        Mine: {
            screen: Test,
            navigationOptions: ({navigation}: any) => ({
                headerTitle: "My Testing (dev)",
                headerRight: <Text/>,
                headerLeft: <Text/>,
                headerTitleStyle: {
                    alignSelf: "center",
                    textAlign: "center",
                    flex: 1
                }
            })
        },
    }
};

function _hasEqualKey(obj1: any, obj2: any): string | boolean {
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

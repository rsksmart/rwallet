import React, {Component} from 'react';
import {View, Text} from "react-native";
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import {Provider} from "@ant-design/react-native";
import {Root, Toast} from "native-base";

import Start from '../pages/root/start'
import PrimaryTabNavigator from "./tab.primary"
import flex from '../assets/styles/layout.flex'

let SwitchNavi = createAppContainer(createSwitchNavigator(
    {
        Start : {
            screen : Start,
            path: "start"
        },
        PrimaryTabNavigator : {
            screen : PrimaryTabNavigator,
            path : "tab"
        } ,
    },
    {
        initialRouteName: 'Start'
    }
));

class RootComponent extends Component {
    render() {
        return(
            <View style={[flex.flex1]} >
                <Provider>
                    <Root>
                        <SwitchNavi/>
                    </Root>
                </Provider>
            </View>
        );
    }
}

export default RootComponent;
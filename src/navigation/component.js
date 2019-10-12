import React, {Component} from 'react';
import {View, Platform} from "react-native";
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import {Provider} from "@ant-design/react-native";
import {Root, Toast} from "native-base";

import Start from '../pages/root/start'
import PrimaryTabNavigatorComp from "./tab.primary"
import flex from '../assets/styles/layout.flex'

let SwitchNavi = createAppContainer(createSwitchNavigator(
    {
        Start : {
            screen : Start,
            path: "start"
        },
        PrimaryTabNavigator : {
            screen : PrimaryTabNavigatorComp,
            path : "tab"
        } ,
    },
    {
        initialRouteName: 'PrimaryTabNavigator'
    }
));

const uriPrefix =  Platform.OS === 'android' ? 'rwallet://rwallet/' : 'rwallet://rwallet/';

class RootComponent extends Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
    }
    componentWillUnmount() {
    }
    componentWillUpdate(nextProps, nextState, nextContext): void {
    }

    render() {
        return(
            <View style={[flex.flex1]} >
                <Provider>
                    <Root>
                        <SwitchNavi  uriPrefix={uriPrefix}/>
                    </Root>
                </Provider>
            </View>
        );
    }
}

export default RootComponent;
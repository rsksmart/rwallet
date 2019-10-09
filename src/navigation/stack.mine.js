import React from "react";
import {createAppContainer, createStackNavigator} from "react-navigation";

import {defaultNavigationOptions, routeConfigMaps} from "../common/navigation.config";

const StackNavigator = createStackNavigator(
    {...routeConfigMaps},
    {
        initialRouteName: "Mine",
        defaultNavigationOptions: defaultNavigationOptions()
    }
);

const Container = createAppContainer(StackNavigator);

Container.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export default Container
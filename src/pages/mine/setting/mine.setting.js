import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableWithoutFeedback, Platform, Linking} from "react-native";
import { Switch } from "native-base";

import flex from '../../../assets/styles/layout.flex'
import MineSettingIndexHeader from './mine.setting.index.header';
import MineSettingIndexItem from './mine.setting.index.item';


class Setting extends Component {
    static navigationOptions = () => {
        return{
            headerTitle: 'Settings',
        }
    };
    constructor(props){
        super(props);
    }

    async componentDidMount(): void {
    }

    handleChangeSwitch= async () => {
    };

    render() {
        let {navigation} = this.props;

        return (
            <View style={[flex.flex1]}>
                <ScrollView style={[flex.flex1]}>
                    <MineSettingIndexHeader text={"System Setting"}/>
                    <MineSettingIndexItem navigation={navigation} left={"Enable Notification"} right={
                        <Switch value={true} onValueChange={this.handleChangeSwitch}/>
                    }/>
                    <MineSettingIndexHeader text={"R Wallet"}/>
                    <MineSettingIndexItem onPress={()=>{
                        setTimeout(()=>{
                            navigation.navigate("Version");
                        },0);
                    }} navigation={navigation} left={"Version"}/>
                    <MineSettingIndexItem onPress={()=>{
                        setTimeout(()=>{
                        },0)
                    }} navigation={navigation} left={"Give us feedback"}/>
                </ScrollView>
            </View>
        )
    }
}

export default Setting;
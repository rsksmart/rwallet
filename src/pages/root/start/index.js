import React, {Component} from 'react';
import { Text, View, StyleSheet} from "react-native";

import flex from '../../../assets/styles/layout.flex'

export default class Start extends Component{

    toPrimatyTab = async ()=>{
        this.props.navigation.navigate('PrimaryTabNavigator');
    }

    async componentDidMount(){
        await this.toPrimatyTab()
    }

    render() {
        return (
            <View style={[styles.startContainer, flex.flex1]}>
                <Text>This is the temp start screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    startContainer: {

    }
});
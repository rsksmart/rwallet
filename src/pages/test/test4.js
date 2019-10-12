import React, {Component} from 'react';
import {
    View, Text
} from "react-native";

import flex from '../../assets/styles/layout.flex'

class Test4 extends Component {
    static navigationOptions = {
    };
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={[flex.flex1]}>
                <Text>This is the test page 4</Text>
            </View>
        );
    }
};

export default Test4;

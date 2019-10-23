import React, {Component} from 'react';
import {
    View, Text
} from "react-native";

import flex from '../../assets/styles/layout.flex'
import storage from '../../common/storage'

class Test2 extends Component {
    static navigationOptions = {
    };
    constructor(props){
        super(props);
        this.state = {
            num: -1
        }
    }
    async componentDidMount() {
        console.log('componentDidMount');
        let num = await storage.load({
            key: 'TEST2NUM'
        })
        console.log(num);
        this.setState({num})
    }

    render() {
        return (
            <View style={[flex.flex1]}>
                <Text>This is the test page 2 with num: {this.state.num}</Text>
            </View>
        );
    }
};

export default Test2;

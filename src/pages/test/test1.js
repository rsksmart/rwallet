import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet
} from "react-native";

import flex from '../../assets/styles/layout.flex'

class Test1 extends Component {
    static navigationOptions = {
    };
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={[flex.flex1]}>
                <Text>This is the test page 1</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Test2')}>
                    <Text style={styles.text}>Go to Test 2 Tab</Text>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({

    button: {
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 12,
        width: 280,
        marginTop: 12,
    }
});

export default Test1;

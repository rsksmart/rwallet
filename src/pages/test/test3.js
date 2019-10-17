import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet
} from 'react-native';

import flex from '../../assets/styles/layout.flex'

import { strings } from '../../common/i18n';

class Test3 extends Component {
    static navigationOptions = ({ navigation }) => {
        return{
            header: null,
        }
    };
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={[flex.flex1]}>
                <Text>{strings('test3.text')}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Setting')}>
                    <Text style={styles.text}>{strings('test3.button')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
};


const styles = StyleSheet.create({

    button: {
        alignItems: 'center',
        backgroundColor: 'orange',
        padding: 12,
        width: 280,
        marginTop: 12,
    }
});

export default Test3;

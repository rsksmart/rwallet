import React from 'react';
import {
    View, Text
} from "react-native";

import flex from '../../assets/styles/layout.flex'

const Test = () => {
    return (
        <View style={[flex.flex1]}>
            <Text>This is the test page</Text>
        </View>
    );
};

export default Test;

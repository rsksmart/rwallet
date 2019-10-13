import React from 'react';
import {View, TouchableOpacity} from "react-native";

const CommonPress = props => {
    let {onPress,children,style} = props;

    if(onPress){
        return <TouchableOpacity onPress={onPress} style={style}>
            {children}
        </TouchableOpacity>
    }else{
        return  <View style={style}>
            {children}
        </View>
    }
};

export default CommonPress;
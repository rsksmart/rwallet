import React from 'react';
import {View, Image} from "react-native";

import CommonPress from "../common.press";
import style from "../../../assets/styles/style";

const IconBtnStateless = props => {
    let {onPress, rotate, size, radiusFull, defaultImg, disable, img} = props;

    size = size ? size : 24;
    rotate = rotate ? rotate : 0;

    return (
        <CommonPress style={{opacity : disable ? 0.3 : 1}} onPress={disable ? null : onPress}>
            <View style={[{
                transform: [{rotate: `${rotate}deg`}]
            }, radiusFull ? style.borderRadiusFull : {}, style.overHidden]}>
                <Image onError={()=>{
                    this.setState({img : { uri: defaultImg }})
                }} style={[
                    {
                        height : size,
                        width : size
                    },
                ]} source={img}/>
            </View>
        </CommonPress>
    );
};


export default IconBtnStateless;
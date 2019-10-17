import React from 'react';
import {Text, TouchableOpacity, ImageBackground} from "react-native";

import style from "../../../assets/styles/style";
import color from "../../../assets/styles/color";
import flex from "../../../assets/styles/layout.flex";

import BtnBg from "../../../assets/images/common/button.bg.png"

const ImageBtnStateless = props => {
    let { onPress, text, height, image, disable } = props;
    image = image ? image : BtnBg;
    height = height ? height : 42;
    return (
        <TouchableOpacity style={[{ height: height }, style.borderRadiusFull, style.overHidden]} onPress={() => {
            if (!disable) {
                onPress();
            }
        }} >
            <ImageBackground style={[{ width: '100%', height: '100%', opacity: disable ? 0.5 : 1 }, flex.justifyCenter, flex.alignCenter]} source={image}>
                {(() => {
                    if (typeof text === "string") {
                        return <Text style={[color.font.white]}>{text}</Text>
                    } else {
                        return text
                    }
                })()}
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default ImageBtnStateless;
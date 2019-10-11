import React from 'react';
import {
  Image,
  TouchableOpacity
} from "react-native";

import back from "../../assets/images/arrow/back.gray.png"
import space from "../../assets/styles/space";

const BackBtn = props => {
    return (
        <TouchableOpacity style={[space.paddingHorizontal_18, space.paddingVertical_30]} onPress={(e) => {
            if(props.onPress) {
                props.onPress(e);
            } else {
                props.navigation.pop();
            }
        }} >
            <Image source={(this.props && this.props.backSource) || back} style={[space.width_height_21]}/>
        </TouchableOpacity>
    );
};

export default BackBtn;

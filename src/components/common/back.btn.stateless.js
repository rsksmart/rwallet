import React from 'react';
import {
  Image,
  TouchableOpacity
} from "react-native";

import back from "../../assets/images/arrow/back.gray.png"
import {space} from "../../assets/styles/space";

const BackBtn = props => {
    return (
        <TouchableOpacity style={[space.paddingHorizontal_18,space.paddingVertical_30]} onPress={(e) => {
            if(this.props.onPress) {
                this.props.onPress(e);
            } else {
                this.props.navigation.pop();
            }
        }} >
            <Image source={this.props.backSource || back} style={[space.width_height_21]}/>
        </TouchableOpacity>
    );
};

export default BackBtn;

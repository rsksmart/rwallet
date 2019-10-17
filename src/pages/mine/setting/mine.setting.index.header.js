import React, {Component} from 'react';
import {View,Text} from "react-native";
import {Body, ListItem} from "native-base";
import font from "../../../assets/styles/font";
import space from "../../../assets/styles/space";

const MineSettingIndexHeader = (props) => {
    let {text} = props;
    return (
        <ListItem icon style={[space.marginTop_15]}>
            <Body>
                <Text style={[font.color.assist, font.size["12"]]}>{text}</Text>
            </Body>
        </ListItem>
    );
};

export default MineSettingIndexHeader;
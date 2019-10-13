import React from 'react';
import {View, Text} from "react-native";
import { Body, ListItem, Right } from 'native-base';

import IconBtnStateless from "../../../components/common/buttons/icon.btn.stateless";
import flex from "../../../assets/styles/layout.flex";
import font from "../../../assets/styles/font";
import space from "../../../assets/styles/space";
import MoreBig from "../../../assets/images/mine/more.big.png";


const MineSettingIndexItem = (props) => {
    let {left,right,onPress} = props;
    return (
        <ListItem onPress={onPress} icon>
            <Body>
                <Text style={[font.color.imp,font.size["15"]]}>{left}</Text>
            </Body>
            <Right>
                {(()=>{
                    if(typeof right === "string"){    //文字
                        return <View style={[flex.row,flex.alignCenter]}>
                            <Text style={[font.color.normal,font.size["15"],space.marginRight_10]}>{right}</Text>
                            <IconBtnStateless img={MoreBig} size={8}/>
                        </View>
                    }else if(typeof right === "undefined"){   //默认右箭头
                        return <View>
                            <IconBtnStateless img={MoreBig} size={8}/>
                        </View>
                    }else{
                        return right
                    }
                })()}
            </Right>
        </ListItem>
    );
};

export default MineSettingIndexItem;

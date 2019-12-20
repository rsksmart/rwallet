import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Body, ListItem, Right } from 'native-base';

import IconBtnStateless from '../../../components/common/buttons/icon.btn.stateless';
import flex from '../../../assets/styles/layout.flex';
import font from '../../../assets/styles/font.ts';
import space from '../../../assets/styles/space';
import MoreBig from '../../../assets/images/mine/more.big.png';


const MineSettingIndexItem = (props) => {
  const { left, right, onPress } = props;
  return (
    <ListItem onPress={onPress} icon>
      <Body>
        <Text style={[font.color.imp, font.size['15']]}>{left}</Text>
      </Body>
      <Right>
        {(() => {
          if (typeof right === 'string') {
            return (
              <View style={[flex.row, flex.alignCenter]}>
                <Text style={[font.color.normal, font.size['15'], space.marginRight_10]}>{right}</Text>
                <IconBtnStateless img={MoreBig} size={8} />
              </View>
            );
          } if (typeof right === 'undefined') {
            return (
              <View>
                <IconBtnStateless img={MoreBig} size={8} />
              </View>
            );
          }
          return right;
        })()}
      </Right>
    </ListItem>
  );
};

export default MineSettingIndexItem;

MineSettingIndexItem.propTypes = {
  left: PropTypes.string.isRequired,
  right: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

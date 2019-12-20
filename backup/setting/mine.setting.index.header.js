import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { Body, ListItem } from 'native-base';
import font from '../../../assets/styles/font.ts';
import space from '../../../assets/styles/space';

const MineSettingIndexHeader = (props) => {
  const { text } = props;
  return (
    <ListItem icon style={[space.marginTop_15]}>
      <Body>
        <Text style={[font.color.assist, font.size['12']]}>{text}</Text>
      </Body>
    </ListItem>
  );
};

export default MineSettingIndexHeader;

MineSettingIndexHeader.propTypes = {
  text: PropTypes.string.isRequired,
};

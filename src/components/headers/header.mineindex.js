import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, ImageBackground, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import screenHelper from '../../common/screenHelper';
import ResponsiveText from '../common/misc/responsive.text';
import color from '../../assets/styles/color';

const header = require('../../assets/images/misc/header.png');

const AVATAR_SIZE = 129;
const headerHeight = 160 + screenHelper.topHeight;

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatarView: {
    left: 20,
    bottom: -40,
    position: 'absolute',
    borderColor: color.alto,
    borderBottomWidth: 0,
    borderRadius: AVATAR_SIZE / 2,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
    backgroundColor: color.white,
  },
  nameView: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 160,
    right: 15,
    bottom: 5,
  },
  name: {
    width: '100%',
    paddingBottom: 6,
  },
  nameText: {
    fontWeight: '900',
    color: color.white,
  },
  nameEditView: {
    marginLeft: 10,
    marginBottom: -5,
  },
  nameEdit: {
    color: color.white,
  },
  headerView: {
    height: headerHeight,
  },
});

export default function MineIndexHeader({ avatar, onEditNamePress, usernameText }) {
  return (
    <ImageBackground source={header} style={styles.headerView}>
      <View style={styles.avatarView}><Image source={avatar} style={styles.avatar} /></View>
      <View style={styles.nameView}>
        <ResponsiveText
          layoutStyle={styles.name}
          fontStyle={styles.nameText}
          maxFontSize={20}
          suffixElement={(
            <TouchableOpacity style={styles.nameEditView} onPress={onEditNamePress}>
              <FontAwesome name="edit" size={25} style={styles.nameEdit} />
            </TouchableOpacity>
          )}
          suffixElementWidth={35}
        >
          {usernameText}
        </ResponsiveText>
      </View>
    </ImageBackground>
  );
}

MineIndexHeader.propTypes = {
  avatar: PropTypes.number.isRequired,
  onEditNamePress: PropTypes.func.isRequired,
  usernameText: PropTypes.string.isRequired,
};

import React from 'react';
import {
  StyleSheet, ImageBackground, TouchableOpacity, View,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import screenHelper from '../../common/screenHelper';
import Loc from '../common/misc/loc';
import color from '../../assets/styles/color.ts';

const header = require('../../assets/images/misc/header.png');

const headerHeight = 100 + screenHelper.topHeight;

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: headerHeight,
  },
  titleView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    left: 14,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    letterSpacing: 0.39,
    marginLeft: 12,
    marginBottom: 2,
  },
  chevronView: {
    width: 10,
    height: 43,
  },
  chevron: {
    color: color.component.navBackIndicator.color,
    marginTop: -1.5,
    marginLeft: -14,
    fontSize: 40,
  },
  cross: {
    color: color.component.navBackIndicator.color,
    marginTop: -1.5,
    marginLeft: -20,
    fontSize: 40,
  },
  list: {
    color: color.component.navBackIndicator.color,
    marginTop: -1.5,
    marginLeft: -20,
    fontSize: 40,
  },
});

export default function BrowerHeader({
  title, onBackButtonPress, onCloseButtonPress, onSwitchButtonPress = null,
}) {
  return (
    <ImageBackground source={header} style={styles.headerImage}>
      <View style={styles.titleView}>
        <TouchableOpacity onPress={onBackButtonPress} style={styles.chevronView}><Entypo name="chevron-small-left" style={styles.chevron} /></TouchableOpacity>
        <TouchableOpacity onPress={onCloseButtonPress} style={[styles.chevronView, { marginLeft: 30 }]}><Entypo name="cross" style={styles.cross} /></TouchableOpacity>
        <TouchableOpacity onPress={onSwitchButtonPress} style={[styles.chevronView, { marginLeft: 30 }]}><Entypo name="list" style={styles.list} /></TouchableOpacity>
        <Loc style={styles.headerTitle} text={title} />
      </View>
    </ImageBackground>
  );
}

BrowerHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
  onCloseButtonPress: PropTypes.func.isRequired,
  onSwitchButtonPress: PropTypes.func.isRequired,
};

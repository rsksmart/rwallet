import React from 'react';
import {
  Text, StyleSheet, TouchableOpacity, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import screenHelper from '../../common/screenHelper';
import Loc from '../common/misc/loc';

const header = require('../../assets/images/misc/header.png');

const headerHeight = 350;
const headerMarginTop = -150 + screenHelper.topHeight;

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: headerHeight,
    marginTop: headerMarginTop,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '900',
    position: 'absolute',
    bottom: 65,
    left: 24,
    color: '#FFF',
  },
  headerText: {
    fontSize: 15,
    fontWeight: '900',
    position: 'absolute',
    bottom: 45,
    left: 24,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 9,
    bottom: 97,
  },
  chevron: {
    color: '#FFF',
  },
});

export default function KeySettingsHeader({ title, assetsCount, onBackButtonPress }) {
  return (
    <ImageBackground source={header} style={[styles.headerImage]}>
      <Loc style={[styles.headerTitle]} text={title} />
      <Text style={[styles.headerText]}>
        <Loc text="page.mine.keySettings.walletContains" interpolates={{ count: assetsCount }} />
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackButtonPress}
      >
        <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
      </TouchableOpacity>
    </ImageBackground>
  );
}

KeySettingsHeader.propTypes = {
  onBackButtonPress: PropTypes.func.isRequired,
  assetsCount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

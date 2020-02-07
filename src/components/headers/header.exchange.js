import React from 'react';
import {
  StyleSheet, View, TouchableOpacity, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Loc from '../common/misc/loc';
import presetStyles from '../../assets/styles/style';

const header = require('../../assets/images/misc/header.earn.png');

const styles = StyleSheet.create({
  headerImage: {
    marginTop: -200,
    height: 630,
  },
  titleView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 350,
    left: 10,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    letterSpacing: 0.39,
    marginLeft: -2,
    marginBottom: 2,
  },
  rightButtonView: {
    position: 'absolute',
    bottom: 430,
    right: 20,
  },
});

export default function ExchangeHeader({ title, onBackButtonPress, rightButton }) {
  return (
    <View>
      <ImageBackground source={header} style={[styles.headerImage]}>
        <View style={styles.titleView}>
          <TouchableOpacity onPress={onBackButtonPress}>
            <EvilIcons name="chevron-left" size={40} style={presetStyles.navBackIndicator} />
          </TouchableOpacity>
          <Loc style={styles.headerTitle} text={title} />
        </View>
        <View style={styles.rightButtonView}>
          {rightButton}
        </View>
      </ImageBackground>
    </View>
  );
}

ExchangeHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
  rightButton: PropTypes.element.isRequired,
};

import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, ImageBackground, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import screenHelper from '../../common/screenHelper';

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
  chevron: {
    color: '#FFF',
  },
});

export default function OperationHeader({ title, onBackButtonPress }) {
  return (
    <ImageBackground source={header} style={styles.headerImage}>
      <View style={styles.titleView}>
        <TouchableOpacity onPress={onBackButtonPress}>
          <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {title}
        </Text>
      </View>
    </ImageBackground>
  );
}

OperationHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
};

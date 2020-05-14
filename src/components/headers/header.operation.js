import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import screenHelper from '../../common/screenHelper';
import BackButton from './back.button';

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
  },
});

export default function OperationHeader({ title, onBackButtonPress }) {
  return (
    <ImageBackground source={header} style={styles.headerImage}>
      <BackButton title={title} style={styles.titleView} onBackButtonPress={onBackButtonPress} />
    </ImageBackground>
  );
}

OperationHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
};

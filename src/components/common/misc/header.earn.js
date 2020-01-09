import React from 'react';
import {
  StyleSheet, ImageBackground, Image, View,
} from 'react-native';
import PropTypes from 'prop-types';
import Loc from './loc';
import { DEVICE } from '../../../common/info';
import screenHelper from '../../../common/screenHelper';


const header = require('../../../assets/images/misc/header.earn.png');

const headerHeight = 585;
const headerMarginTop = DEVICE.isIphoneX ? -100 + screenHelper.iphoneXTopHeight : -100;
export const headerBottomY = headerHeight + headerMarginTop;

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: headerHeight,
    marginTop: headerMarginTop,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    position: 'absolute',
    left: 24,
    right: 50,
    color: '#FFF',
  },
  title: {
    bottom: 350,
  },
  coming: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    position: 'absolute',
    left: 24,
    bottom: 42,
  },
  titleImage: {
    marginVertical: 32,
    width: 286,
    height: 159,
  },
  titleImageView: {
    position: 'absolute',
    width: '100%',
    bottom: 90,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default function EarnHeader({ title, imageSource, imageBgColor }) {
  return (
    <ImageBackground source={header} style={[styles.headerImage]}>
      <Loc style={[styles.headerTitle, styles.title]} text={title} />
      <View style={[styles.titleImageView, { backgroundColor: imageBgColor }]}>
        <Image style={styles.titleImage} source={imageSource} />
      </View>
      <Loc style={[styles.coming]} text="Coming soon..." />
    </ImageBackground>
  );
}

EarnHeader.propTypes = {
  title: PropTypes.string.isRequired,
  imageSource: PropTypes.number.isRequired,
  imageBgColor: PropTypes.string.isRequired,
};

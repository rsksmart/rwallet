import React from 'react';
import { Image, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import flex from '../../assets/styles/layout.flex';
import Loc from './misc/loc';
import presetStyles from '../../assets/styles/style';

const rsk = require('../../assets/images/mine/rsk.png');

const styles = StyleSheet.create({
  logoView: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 50,
    width: '100%',
  },
  powerby: {
    color: '#727372',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 5,
  },
});

const RSKAd = () => (
  <LinearGradient
    colors={['#ffffff00', '#ffffff']}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 0.85 }}
    style={[flex.justifyEnd, styles.logoView]}
  >
    <Loc style={[styles.powerby]} text="Powered by" />
    <Image style={presetStyles.rskIcon} source={rsk} />
  </LinearGradient>
);

export default RSKAd;

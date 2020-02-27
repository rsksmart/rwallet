import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import flex from '../../assets/styles/layout.flex';
import presetStyles from '../../assets/styles/style';
import color from '../../assets/styles/color.ts';

const rsk = require('../../assets/images/mine/rsk.png');

const styles = StyleSheet.create({
  logoView: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 78,
    right: 0,
    height: 80,
    width: '100%',
  },
  powerby: {
    color: color.midGrey,
    fontFamily: 'Avenir-Black',
    fontSize: 17,
    fontWeight: '500',
    marginTop: 5,
  },
});

const RSKAd = () => (
  <LinearGradient
    colors={['rgba(255, 255, 255, 0.25)', 'rgb(255, 255, 255)']}
    start={{ x: 0, y: 0 }}
    // end.y param is gradient proportion in y axis. It is seted to 0.85 more comfortable.
    end={{ x: 0, y: 0.85 }}
    style={[flex.justifyEnd, styles.logoView]}
    // Keep it from blocking user touch
    pointerEvents="box-none"
  >
    <Text style={[styles.powerby]}>Powered by</Text>
    <Image style={presetStyles.rskIcon} source={rsk} />
  </LinearGradient>
);

export default RSKAd;

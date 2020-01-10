import React from 'react';
import {
  StyleSheet, Image, View,
} from 'react-native';
import PropTypes from 'prop-types';
import Loc from './loc';
import FullWidthImage from './full.width.image';


const header = require('../../../assets/images/misc/header.earn.png');

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontFamily: 'Avenir-Black',
    fontSize: 32,
    letterSpacing: -0.7,
    position: 'absolute',
    left: 24,
    right: 50,
    color: '#FFF',
  },
  title: {
    bottom: 350,
  },
  coming: {
    fontFamily: 'Avenir-Black',
    fontSize: 20,
    letterSpacing: -0.44,
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
    <View>
      <FullWidthImage source={header} style={[styles.headerImage]} />
      <Loc style={[styles.headerTitle, styles.title]} text={title} />
      <View style={[styles.titleImageView, { backgroundColor: imageBgColor }]}>
        <Image style={styles.titleImage} source={imageSource} />
      </View>
      <Loc style={[styles.coming]} text="Coming soon..." />
    </View>
  );
}

EarnHeader.propTypes = {
  title: PropTypes.string.isRequired,
  imageSource: PropTypes.number.isRequired,
  imageBgColor: PropTypes.string.isRequired,
};

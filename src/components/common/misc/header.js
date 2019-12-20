import React from 'react';
import {
  StyleSheet, TouchableOpacity, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Loc from './loc';
import screenHelper from '../../../common/screenHelper';

const header = require('../../../assets/images/misc/header.png');

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: screenHelper.headerHeight,
    marginTop: screenHelper.headerMarginTop,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '900',
    position: 'absolute',
    bottom: 50,
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
  noGobackTitleStyle: {
    fontSize: 20,
    marginBottom: 70,
  },
});

export default function Header({ title, goBack }) {
  let backButton = null;
  let titleStyle = null;
  if (goBack) {
    backButton = (
      <TouchableOpacity
        style={styles.backButton}
        onPress={goBack}
      >
        <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
      </TouchableOpacity>
    );
  } else {
    titleStyle = styles.noGobackTitleStyle;
  }
  return (
    <ImageBackground source={header} style={[styles.headerImage]}>
      <Loc style={[styles.headerTitle, titleStyle]} text={title} />
      { backButton }
    </ImageBackground>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  goBack: PropTypes.func,
};

Header.defaultProps = {
  goBack: null,
};

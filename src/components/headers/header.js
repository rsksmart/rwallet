import React from 'react';
import {
  StyleSheet, TouchableOpacity, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import screenHelper from '../../common/screenHelper';
import ResponsiveText from '../common/misc/responsive.text';
import { strings } from '../../common/i18n';

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
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
  },
  headerTitleText: {
    color: '#FFFFFF',
    fontFamily: 'Avenir-Black',
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

function Header({
  title, isShowBackButton, onBackButtonPress, rightBtn,
}) {
  let backButton = null;
  if (isShowBackButton) {
    backButton = (
      <TouchableOpacity style={styles.backButton} onPress={onBackButtonPress}>
        <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
      </TouchableOpacity>
    );
  }
  return (
    <ImageBackground source={header} style={[styles.headerImage]}>
      <ResponsiveText layoutStyle={[styles.headerTitle]} fontStyle={styles.headerTitleText} maxFontSize={32}>{strings(title)}</ResponsiveText>
      { backButton }
      { rightBtn && rightBtn() }
    </ImageBackground>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  isShowBackButton: PropTypes.bool,
  onBackButtonPress: PropTypes.func,
  rightBtn: PropTypes.func,
};

Header.defaultProps = {
  isShowBackButton: true,
  onBackButtonPress: null,
  rightBtn: null,
};

const mapStateToProps = (state) => ({
  currentLocale: state.App.get('language'),
});

export default connect(mapStateToProps)(Header);

import React from 'react';
import {
  StyleSheet, TouchableOpacity, ImageBackground, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import screenHelper from '../../common/screenHelper';
import ResponsiveText from '../common/misc/responsive.text';
import { strings } from '../../common/i18n';
import color from '../../assets/styles/color';
import fontFamily from '../../assets/styles/font.family';

const header = require('../../assets/images/misc/header.png');

const headerHeight = 350;
const headerMarginTop = -150 + screenHelper.topHeight;
export const headerVisibleHeight = headerHeight + headerMarginTop;

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: headerHeight,
    marginTop: headerMarginTop,
  },
  headerTitle: {
    position: 'absolute',
    bottom: 52,
    left: 24,
    right: 24,
  },
  headerText: {
    position: 'absolute',
    bottom: 37,
    left: 24,
    right: 24,
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    color: color.white,
  },
  headerTitleText: {
    color: color.white,
    fontFamily: fontFamily.AvenirBlack,
  },
  backButton: {
    position: 'absolute',
    left: 9,
    bottom: 97,
  },
  chevron: {
    color: color.white,
  },
  noGobackTitleStyle: {
    fontSize: 20,
    marginBottom: 70,
  },
});

function Header({
  title, isShowBackButton, onBackButtonPress, rightBtn, subTitle,
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
      { subTitle && (
      <Text style={[styles.headerText]}>
        {strings(subTitle)}
      </Text>
      )}
      { backButton }
      { rightBtn && rightBtn() }
    </ImageBackground>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  isShowBackButton: PropTypes.bool,
  onBackButtonPress: PropTypes.func,
  rightBtn: PropTypes.func,
};

Header.defaultProps = {
  isShowBackButton: true,
  onBackButtonPress: null,
  rightBtn: null,
  subTitle: null,
};

const mapStateToProps = (state) => ({
  currentLocale: state.App.get('language'),
});

export default connect(mapStateToProps)(Header);

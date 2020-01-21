import React from 'react';
import {
  StyleSheet, TouchableOpacity, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import screenHelper from '../../../common/screenHelper';
import ResponsiveText from './responsive.text';
import { strings } from '../../../common/i18n';

const header = require('../../../assets/images/misc/header.png');

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: screenHelper.headerHeight,
    marginTop: screenHelper.headerMarginTop,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Avenir-Black',
    fontSize: 32,
    letterSpacing: 0,
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
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
  title, goBack, customRightBtn, headerStyle,
}) {
  let customStyleHeaderTitle = null;
  if (headerStyle && headerStyle.customStyleHeaderTitle) {
    customStyleHeaderTitle = headerStyle.customStyleHeaderTitle;
  }
  let backButton = null;
  let titleStyle = null;

  if (customRightBtn) {
    backButton = customRightBtn;
  } else if (goBack) {
    backButton = (
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
      </TouchableOpacity>
    );
  } else {
    titleStyle = styles.noGobackTitleStyle;
  }
  return (
    <ImageBackground source={header} style={[styles.headerImage]}>
      <ResponsiveText style={[customStyleHeaderTitle || styles.headerTitle, titleStyle]}>{strings(title)}</ResponsiveText>
      { backButton }
    </ImageBackground>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  goBack: PropTypes.func,
  customRightBtn: PropTypes.shape({}),
  headerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Header.defaultProps = {
  goBack: null,
  customRightBtn: null,
  headerStyle: null,
};

const mapStateToProps = (state) => ({
  currentLocale: state.App.get('language'),
});

export default connect(mapStateToProps)(Header);

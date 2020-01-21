import React from 'react';
import {
  StyleSheet, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import screenHelper from '../../../common/screenHelper';
import Loc from './loc';
import { DEVICE } from '../../../common/info';

const header = require('../../../assets/images/misc/header.png');

const headerHeight = 350;
const headerTopOffset = -150;
const headerMarginTop = DEVICE.isIphoneX ? headerTopOffset + screenHelper.iphoneXTopHeight : headerTopOffset;
export const bodyMarginTop = screenHelper.headerHeight + headerMarginTop;

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: headerHeight,
    marginTop: headerMarginTop,
  },
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
    letterSpacing: 0.39,
    lineHeight: 28,
    position: 'absolute',
    bottom: 120,
    left: 24,
  },
});

function ListPageHeader({ title, customRightButton }) {
  return (
    <ImageBackground source={header} style={[styles.headerImage]}>
      <Loc style={styles.headerTitle} text={title} />
      {customRightButton}
    </ImageBackground>
  );
}

ListPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  customRightButton: PropTypes.string,
};

ListPageHeader.defaultProps = {
  customRightButton: null,
};

const mapStateToProps = (state) => ({
  currentLocale: state.App.get('language'),
});

export default connect(mapStateToProps)(ListPageHeader);

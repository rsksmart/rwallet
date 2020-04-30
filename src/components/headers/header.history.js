import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import screenHelper from '../../common/screenHelper';
import BackButton from './back.button';

const header = require('../../assets/images/misc/header.png');

const headerHeight = 350;
const headerMarginTop = -150 + screenHelper.topHeight;

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: headerHeight,
    marginTop: headerMarginTop,
  },
  titleView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 105,
    left: 21,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
});

function HistoryHeader({ title, onBackButtonPress }) {
  return (
    <ImageBackground source={header} style={[styles.headerImage]}>
      <BackButton title={title} style={styles.titleView} onBackButtonPress={onBackButtonPress} />
    </ImageBackground>
  );
}

HistoryHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentLocale: state.App.get('language'),
});

export default connect(mapStateToProps)(HistoryHeader);

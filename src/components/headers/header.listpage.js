import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import screenHelper from '../../common/screenHelper';
import FullWidthImage from '../common/misc/full.width.image';
// import Loc from '../common/misc/loc';
import references from '../../assets/references';

// const headerHeight = 259;
const headerTopOffset = 0;
const headerMarginTop = headerTopOffset;
// export const defaultPageMarginTop = 350 + headerTopOffset;

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
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
  headerView: {
    // paddingTop: screenHelper.topHeight,
  },
});

function ListPageHeader({ /* title,  */ customRightButton }) {
  return (
    <View style={styles.headerView}>
      <FullWidthImage source={references.images.listHeader} style={[styles.headerImage]} />
      {customRightButton}
    </View>
  );
}

ListPageHeader.propTypes = {
  // title: PropTypes.string.isRequired,
  customRightButton: PropTypes.element,
};

ListPageHeader.defaultProps = {
  customRightButton: null,
};

const mapStateToProps = (state) => ({
  currentLocale: state.App.get('language'),
});

export default connect(mapStateToProps)(ListPageHeader);

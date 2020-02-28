import React from 'react';
import {
  StyleSheet, View, Image,
} from 'react-native';
// import screenHelper from '../../common/screenHelper';
// import Loc from '../common/misc/loc';
import references from '../../assets/references';
import { screen } from '../../common/info';

const IMAGE_WIDTH = 375;
const IMAGE_HEIGHT = 259;

// const headerHeight = 259;
const headerTopOffset = 0;
const headerMarginTop = headerTopOffset;
// export const defaultPageMarginTop = 350 + headerTopOffset;

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: screen.width * (IMAGE_HEIGHT / IMAGE_WIDTH),
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

export default function ListPageHeader() {
  return (
    <View style={styles.headerView}>
      <Image source={references.images.listHeader} style={[styles.headerImage]} />
    </View>
  );
}

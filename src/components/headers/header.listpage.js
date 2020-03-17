import React from 'react';
import {
  StyleSheet, View, Image,
} from 'react-native';
import references from '../../assets/references';
import { screen } from '../../common/info';

const IMAGE_WIDTH = 375;
const IMAGE_HEIGHT = 259;

// const headerHeight = 259;
const headerTopOffset = -40;
const headerMarginTop = headerTopOffset;
// export const defaultPageMarginTop = 350 + headerTopOffset;

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: screen.width * (IMAGE_HEIGHT / IMAGE_WIDTH),
    marginTop: headerMarginTop,
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

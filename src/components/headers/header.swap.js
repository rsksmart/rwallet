import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import screenHelper from '../../common/screenHelper';
import BackButton from './back.button';

const header = require('../../assets/images/misc/header.earn.png');

const headerHeight = 630;
const headerTopOffset = -200;
const headerMarginTop = headerTopOffset + screenHelper.topHeight;
export const headerVisibleHeight = headerHeight + headerMarginTop;

const styles = StyleSheet.create({
  headerImage: {
    height: headerHeight,
    marginTop: headerMarginTop,
  },
  titleView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 350,
    left: 16,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  rightButtonView: {
    position: 'absolute',
    bottom: 350,
    right: 20,
  },
});

export default function SwapHeader({ title, onBackButtonPress, rightButton }) {
  return (
    <View>
      <ImageBackground source={header} style={[styles.headerImage]}>
        <BackButton title={title} style={styles.titleView} onBackButtonPress={onBackButtonPress} />
        <View style={styles.rightButtonView}>
          {rightButton}
        </View>
      </ImageBackground>
    </View>
  );
}

SwapHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
  rightButton: PropTypes.element,
};

SwapHeader.defaultProps = {
  rightButton: null,
};

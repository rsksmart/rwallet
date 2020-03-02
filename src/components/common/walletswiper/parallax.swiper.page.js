import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },
  foregroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});

const ParallaxSwiperPage = (props) => {
  const { component, width, isFirstPage } = props;
  const viewWidth = width + (isFirstPage ? 10 : 0);
  return (
    <View style={[styles.container, { width: viewWidth }, isFirstPage === 0 ? { marginLeft: -10 } : null]}>
      <View pointerEvents="box-none" style={styles.foregroundContainer}>
        {component}
      </View>
    </View>
  );
};

ParallaxSwiperPage.propTypes = {
  component: PropTypes.element,
  width: PropTypes.number.isRequired,
  isFirstPage: PropTypes.bool,
};

ParallaxSwiperPage.defaultProps = {
  component: null,
  isFirstPage: false,
};

export default ParallaxSwiperPage;

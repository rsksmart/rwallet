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
  const { component, width, index } = props;
  const viewWidth = width + (index === 0 ? 10 : 0);
  return (
    <View style={[styles.container, { width: viewWidth }, index === 0 ? { marginLeft: -10 } : null]}>
      <View pointerEvents="box-none" style={styles.foregroundContainer}>
        {component}
      </View>
    </View>
  );
};

ParallaxSwiperPage.propTypes = {
  component: PropTypes.element,
  width: PropTypes.number.isRequired,
  index: PropTypes.number,
};

ParallaxSwiperPage.defaultProps = {
  component: null,
  index: undefined,
};

export default ParallaxSwiperPage;

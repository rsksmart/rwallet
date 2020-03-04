import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import flex from '../../../assets/styles/layout.flex';

/**
 * ParallaxSwiperPage is wrapper for ParallaxSwiper
 * Fisrt page will hide left side, so width add 10, marginLeft set to -10.
 */
const ParallaxSwiperPage = (props) => {
  const { component, width, index } = props;
  const viewWidth = width + (index === 0 ? 10 : 0);
  return (
    <View style={[flex.flex1, { width: viewWidth }, index === 0 ? { marginLeft: -10 } : null]}>
      <View pointerEvents="box-none" style={flex.flex1}>
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
  index: null,
};

export default ParallaxSwiperPage;

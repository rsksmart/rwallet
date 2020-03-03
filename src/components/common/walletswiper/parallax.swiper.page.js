import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import flex from '../../../assets/styles/layout.flex';

const ParallaxSwiperPage = (props) => {
  const { component, width, isFirstPage } = props;
  const viewWidth = width + (isFirstPage ? 10 : 0);
  return (
    <View style={[flex.flex1, { width: viewWidth }, isFirstPage === 0 ? { marginLeft: -10 } : null]}>
      <View pointerEvents="box-none" style={flex.flex1}>
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

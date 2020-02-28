import React, { Component } from 'react';
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

class ParallaxSwiperPage extends Component {
  componentWillMount(nextProps) {
    console.log(this, nextProps);
  }

  render() {
    const { component, width } = this.props;
    return (
      <View style={[styles.container, { width }]}>
        <View pointerEvents="box-none" style={styles.foregroundContainer}>
          {component}
        </View>
      </View>
    );
  }
}

ParallaxSwiperPage.propTypes = {
  component: PropTypes.element,
  width: PropTypes.number.isRequired,
};

ParallaxSwiperPage.defaultProps = {
  component: null,
};

ParallaxSwiperPage.defaultProps = {};

export default ParallaxSwiperPage;

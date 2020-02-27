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
    const { BackgroundComponent, ForegroundComponent, width } = this.props;
    return (
      <View style={[styles.container, { width }]}>
        <View>
          {BackgroundComponent}
        </View>
        <View pointerEvents="box-none" style={styles.foregroundContainer}>
          {ForegroundComponent}
        </View>
      </View>
    );
  }
}

ParallaxSwiperPage.propTypes = {
  BackgroundComponent: PropTypes.element,
  ForegroundComponent: PropTypes.element,
  width: PropTypes.number.isRequired,
};

ParallaxSwiperPage.defaultProps = {
  BackgroundComponent: null,
  ForegroundComponent: null,
};

ParallaxSwiperPage.defaultProps = {};

export default ParallaxSwiperPage;

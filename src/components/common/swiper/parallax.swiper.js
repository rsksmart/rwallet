import React, { Component } from 'react';
import {
  View, ScrollView, StyleSheet, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

import ParallaxSwiperPage from './parallax.swiper.page';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  pageOuterContainer: {
    flexDirection: 'row',
  },
  progressBar: {
    ...StyleSheet.absoluteFillObject,
  },
});

class ParallaxSwiper extends Component {
  constructor(props) {
    super(props);
    const { children } = props;
    this.state = {
      width: deviceWidth,
      height: deviceHeight,
    };
    this.scrollViewHasScrolled = false;
    this.pageIndex = 0;
    this.pageWidths = [];

    React.Children.map(children, (child) => {
      this.pageWidths.push(child.props.width);
    });
  }

  componentDidMount() {
    const { scrollToIndex } = this.props;

    if (scrollToIndex) {
      setTimeout(() => {
        this.scrollToIndex(scrollToIndex, false);
      });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const { scrollToIndex } = nextProps;
  //   this.scrollToIndex(scrollToIndex);
  // }

  onScrollEndDrag(e) {
    const { width } = this.state;
    const { onMomentumScrollEnd } = this.props;
    const contentOffset = e.nativeEvent.contentOffset.x;

    // Divide content offset by size of the view to see which page is visible
    let widthSum = 0;
    let i = 0;
    // Find the page whose left side distance is larger than half width of screen.
    for (; i < this.pageWidths.length; i += 1) {
      const pageWidth = this.pageWidths[i];
      if (widthSum - contentOffset > width / 2) {
        break;
      }
      widthSum += pageWidth;
    }
    this.pageIndex = i - 1;
    const focusPageWidth = this.pageWidths[this.pageIndex];
    // Calculates new contentOffset, and scroll to it.
    const x = widthSum - focusPageWidth / 2 - width / 2;
    this.scrollView.scrollTo({
      x, y: 0, animated: true,
    });
    onMomentumScrollEnd(this.pageIndex);
  }

  scrollToIndex(index, animated = true) {
    const { width } = this.state;
    const pageWidth = width;
    const scrollOffset = index * pageWidth;

    if (!this.scrollViewHasScrolled) {
      this.scrollViewHasScrolled = true;
    }

    this.scrollView.scrollTo({
      x: scrollOffset, y: 0, animated,
    });
  }

  render() {
    const { height, width } = this.state;
    const {
      children, speed, backgroundColor, /* animatedValue, */scrollEnabled,
    } = this.props;

    return (
      <View pointerEvents="box-none">
        <ScrollView
          ref={(scrollView) => { this.scrollView = scrollView; }}
          scrollEnabled={scrollEnabled}
          style={{ width, height, backgroundColor }}
          horizontal
          scrollEventThrottle={1}
          onScroll={(syntheticEvent) => {
            console.log('onScroll, syntheticEvent: ', syntheticEvent);
          }}
          onScrollEndDrag={(e) => this.onScrollEndDrag(e)}
        >
          {
            React.Children.map(children, (child, i) => (
              <View key={i.toString()} style={[styles.pageOuterContainer, { zIndex: -i }]}>
                <ParallaxSwiperPage
                  width={child.props.width}
                  index={i}
                  speed={speed}
                  BackgroundComponent={child.props.BackgroundComponent}
                  ForegroundComponent={child.props.ForegroundComponent}
                  setPageWidth={this.setPageWidth}
                />
              </View>
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

ParallaxSwiper.propTypes = {
  backgroundColor: PropTypes.string,
  speed(props, propName, componentName) {
    const { speed: speedValue } = props;
    if (speedValue < 0 || speedValue > 1) {
      return new Error(
        `Invalid 'speed' prop for ${componentName}. Number should be between 0 and 1.`,
      );
    }
    return null;
  },
  onMomentumScrollEnd: PropTypes.func,
  children: PropTypes.arrayOf((propValue, key, componentName) => {
    const childComponentName = propValue[key].type.displayName;
    if (!/ParallaxSwiperPage/.test(childComponentName)) {
      return new Error(
        `Invalid component '${childComponentName}' supplied to ${componentName}. Use 'ParallaxSwiperPage' instead.`,
      );
    }
    return null;
  }),
  scrollEnabled: PropTypes.bool,
  scrollToIndex: PropTypes.number,
};

ParallaxSwiper.defaultProps = {
  backgroundColor: 'black',
  speed: 0.25,
  onMomentumScrollEnd: () => null,
  scrollToIndex: 0,
  scrollEnabled: true,
  children: null,
};

export default ParallaxSwiper;

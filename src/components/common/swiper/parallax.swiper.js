import React, { Component } from 'react';
import {
  View, ScrollView, StyleSheet, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ParallaxSwiperPage from './parallax.swiper.page';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const dividerWidth = 12;

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
      isShowAddPage: false,
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

  onScrollEndDrag(syntheticEvent) {
    const { width, isShowAddPage } = this.state;
    const { onMomentumScrollEnd } = this.props;
    const contentOffset = syntheticEvent.nativeEvent.contentOffset.x;

    if (!isShowAddPage && contentOffset < 0) {
      this.pageIndex = 0;
      this.scrollView.scrollTo({
        x: 0, y: 0, animated: true,
      });
      this.setState({ isShowAddPage: true });
    } else {
      // Divide content offset by size of the view to see which page is visible
      let widthSum = 0;
      let i = 0;
      // Find the page whose left side distance is larger than half width of screen.
      for (; i < this.pageWidths.length; i += 1) {
        if (i > 1 && widthSum - contentOffset > width / 2) {
          break;
        }
        const pageWidth = this.pageWidths[i];
        widthSum += (i === 0 ? 0 : dividerWidth / 2) + pageWidth + dividerWidth / 2;
      }
      this.pageIndex = i - 1;
      const focusPageWidth = this.pageWidths[this.pageIndex];
      // Calculates new contentOffset, and scroll to it.
      const x = widthSum - focusPageWidth / 2 - dividerWidth / 2 - width / 2;
      this.scrollView.scrollTo({
        x, y: 0, animated: true,
      });
      this.setState({ isShowAddPage: false });
    }
    onMomentumScrollEnd(this.pageIndex);
  }

  scrollToIndex(index, animated = true) {
    console.log(this);
    let i = 0;
    let widthSum = 0;
    // Find the page whose right side distance is larger than half width of screen.
    for (; i <= index; i += 1) {
      const pageWidth = this.pageWidths[i];
      widthSum += (i === 0 ? 0 : dividerWidth / 2) + pageWidth + dividerWidth / 2;
    }
    const x = widthSum - this.pageWidths[index] / 2 - deviceWidth / 2;
    this.scrollView.scrollTo({
      x, y: 0, animated,
    });
  }

  render() {
    const { height, width } = this.state;
    const {
      children, speed, /* animatedValue, */scrollEnabled,
    } = this.props;
    const endPageIndex = children.length;
    const endPageWidth = (deviceWidth - this.pageWidths[children.length - 1]) / 2 - dividerWidth;
    return (
      <View pointerEvents="box-none">
        <ScrollView
          ref={(scrollView) => { this.scrollView = scrollView; }}
          scrollEnabled={scrollEnabled}
          style={{ width, height }}
          horizontal
          scrollEventThrottle={1}
          onScrollEndDrag={(syntheticEvent) => this.onScrollEndDrag(syntheticEvent)}
        >
          {
            React.Children.map(children, (child, i) => (
              <View key={i.toString()} style={[styles.pageOuterContainer, { zIndex: -i }]}>
                <ParallaxSwiperPage
                  width={child.props.width}
                  index={i}
                  speed={speed}
                  component={child.props.component}
                />
                <View
                  style={{
                    width: dividerWidth,
                    height,
                  }}
                />
              </View>
            ))
          }
          <View key={endPageIndex.toString()} style={[styles.pageOuterContainer, { zIndex: -endPageIndex }]}>
            <ParallaxSwiperPage
              width={endPageWidth}
              index={endPageIndex}
              speed={speed}
              component={<View />}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

ParallaxSwiper.propTypes = {
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
    const checkChildComponent = (item) => {
      const { childComponentName } = item.type.displayName;
      if (!/ParallaxSwiperPage/.test(childComponentName)) {
        return new Error(
          `Invalid component '${childComponentName}' supplied to ${componentName}. Use 'ParallaxSwiperPage' instead.`,
        );
      }
      return null;
    };
    if (_.isArray(propValue[key])) {
      const childList = propValue[key];
      _.each(childList, (child) => {
        checkChildComponent(child);
      });
    } else {
      checkChildComponent(propValue[key]);
    }
    return null;
  }),
  scrollEnabled: PropTypes.bool,
  scrollToIndex: PropTypes.number,
};

ParallaxSwiper.defaultProps = {
  speed: 0.25,
  onMomentumScrollEnd: () => null,
  scrollToIndex: 0,
  scrollEnabled: true,
  children: null,
};

export default ParallaxSwiper;

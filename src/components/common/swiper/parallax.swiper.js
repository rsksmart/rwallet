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
    const { pageIndex } = this.props;

    if (pageIndex) {
      setTimeout(() => {
        this.scrollToIndex(pageIndex, false);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { pageIndex, children } = nextProps;
    this.scrollToIndex(pageIndex);
    this.pageWidths = [];
    React.Children.map(children, (child) => {
      this.pageWidths.push(child.props.width);
    });
  }

  onScrollEndDrag(syntheticEvent) {
    // const decelerationRate = 0.998;
    const { width, isShowAddPage } = this.state;
    const { onMomentumScrollEnd } = this.props;
    const { /* velocity, */ contentOffset } = syntheticEvent.nativeEvent;
    const offsetX = contentOffset.x;
    // const vx = velocity.x;
    // const sign = vx === 0 ? 1 : vx / Math.abs(vx);
    // const s = vx * 500;
    // offsetX += s;
    // const contentOffset = syntheticEvent.nativeEvent.contentOffset.x;

    if (!isShowAddPage && offsetX < 0) {
      this.pageIndex = 0;
    } else {
      // Divide content offset by size of the view to see which page is visible
      let widthSum = 0;
      let i = 0;
      // Find the page whose left side distance is larger than half width of screen.
      for (; i < this.pageWidths.length; i += 1) {
        if (i > 1 && widthSum - offsetX > width / 2) {
          break;
        }
        const pageWidth = this.pageWidths[i];
        widthSum += (i === 0 ? 0 : dividerWidth / 2) + pageWidth + dividerWidth / 2;
      }
      this.pageIndex = i - 1;
    }
    this.scrollToIndex(this.pageIndex);
    onMomentumScrollEnd(this.pageIndex);
  }

  scrollToIndex(index, animated = true) {
    this.setState({ isShowAddPage: index === 0 });
    let x = 10;
    if (index !== 0) {
      let i = 0;
      let widthSum = 0;
      // Find the page whose right side distance is larger than half width of screen.
      for (; i <= index; i += 1) {
        const pageWidth = this.pageWidths[i];
        widthSum += (i === 0 ? 0 : dividerWidth / 2) + pageWidth + dividerWidth / 2;
      }
      x = widthSum - this.pageWidths[index] / 2 - dividerWidth / 2 - deviceWidth / 2;
    }
    this.scrollView.scrollTo({
      x, y: 0, animated,
    });
  }

  render() {
    const { height, width } = this.state;
    const {
      children, scrollEnabled,
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
              component={<View />}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

ParallaxSwiper.propTypes = {
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
  pageIndex: PropTypes.number,
};

ParallaxSwiper.defaultProps = {
  onMomentumScrollEnd: () => null,
  pageIndex: 0,
  scrollEnabled: true,
  children: null,
};

export default ParallaxSwiper;

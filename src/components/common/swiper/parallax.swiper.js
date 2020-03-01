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
      isScrolling: false,
    };
    this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
    this.pageWidths = [];
    React.Children.map(children, (child) => {
      this.pageWidths.push(child.props.width);
    });
    this.calculatePageOffsets();
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
    const { isScrolling } = this.state;
    if (!isScrolling) {
      this.scrollToIndex(pageIndex);
    }
    this.pageWidths = [];
    React.Children.map(children, (child) => {
      this.pageWidths.push(child.props.width);
    });
    this.calculatePageOffsets();
  }

  onMomentumScrollEnd(syntheticEvent) {
    const { onMomentumScrollEnd } = this.props;
    const { contentOffset } = syntheticEvent.nativeEvent;
    const offsetX = contentOffset.x;
    const newPageIndex = _.findIndex(this.pageOffsets, (pageOffset) => pageOffset === offsetX);
    if (newPageIndex !== -1) {
      onMomentumScrollEnd(newPageIndex);
    }
    this.setState({ isScrolling: false });
  }

  onScrollBeginDrag() {
    const { isScrolling } = this.state;
    if (!isScrolling) {
      this.setState({ isScrolling: true });
    }
  }

  calculatePageOffsets() {
    const { width } = this.state;
    this.pageOffsets = [0];
    let widthSum = this.pageWidths[0] + dividerWidth / 2;
    for (let i = 1; i < this.pageWidths.length; i += 1) {
      const pageWidth = this.pageWidths[i];
      widthSum += dividerWidth / 2 + pageWidth + dividerWidth / 2;
      const offsetX = widthSum - this.pageWidths[i] / 2 - dividerWidth / 2 - width / 2;
      this.pageOffsets.push(offsetX);
    }
    console.log(this.pageOffsets);
  }

  scrollToIndex(index, animated = true) {
    this.scrollView.scrollTo({
      x: this.pageOffsets[index], y: 0, animated,
    });
  }

  render() {
    const { height, width } = this.state;
    const {
      children, scrollEnabled,
    } = this.props;
    const endPageIndex = children.length;
    const endPageWidth = (width - this.pageWidths[children.length - 1]) / 2 - dividerWidth;
    return (
      <View pointerEvents="box-none">
        <ScrollView
          ref={(scrollView) => { this.scrollView = scrollView; }}
          scrollEnabled={scrollEnabled}
          style={{ width, height }}
          horizontal
          scrollEventThrottle={1}
          decelerationRate="fast"
          snapToOffsets={this.pageOffsets}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onMomentumScrollEnd={(syntheticEvent) => this.onMomentumScrollEnd(syntheticEvent)}
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
      const { childComponentName } = item.type.name;
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

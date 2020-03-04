import React, { Component } from 'react';
import {
  View, ScrollView, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ParallaxSwiperPage from './parallax.swiper.page';
import { screen } from '../../../common/info';
import flex from '../../../assets/styles/layout.flex';

const dividerWidth = 12;

const styles = StyleSheet.create({
  pageOuterContainer: {
    flexDirection: 'row',
  },
});

/**
 * ParallaxSwiper is a swiper based on scrollview.
 * It contains one allWallet page, many wallet page and one end page.
 */

class ParallaxSwiper extends Component {
  constructor(props) {
    super(props);
    const { children } = props;
    this.width = screen.width;
    this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
    this.pageWidths = [];
    this.pageOffsets = [];
    React.Children.map(children, (child) => {
      this.pageWidths.push(child.props.width);
    });
    this.calculatePageOffsets(this.width);
    this.endPageIndex = children.length;
    this.endPageWidth = (this.width - this.pageWidths[children.length - 1]) / 2 - dividerWidth;
    this.isScrolling = false;
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
    const { pageIndex: lastPageIndex, children: lastChildren } = this.props;
    const { isScrolling, width } = this;
    // update page index
    if (pageIndex !== lastPageIndex && !isScrolling) {
      this.scrollToIndex(pageIndex);
    }
    // update width of pages
    if (children !== lastChildren) {
      this.pageWidths = [];
      React.Children.map(children, (child) => {
        this.pageWidths.push(child.props.width);
      });
      this.calculatePageOffsets(width);
    }
  }

  onMomentumScrollEnd(syntheticEvent) {
    const { onMomentumScrollEnd } = this.props;
    const { contentOffset } = syntheticEvent.nativeEvent;
    const offsetX = contentOffset.x;
    // Because we use snapToOffsets, scrollview will stop at page offsets.
    // We can find out its page index by offset.
    const newPageIndex = _.findIndex(this.pageOffsets, (pageOffset) => pageOffset === offsetX);
    if (newPageIndex !== -1) {
      onMomentumScrollEnd(newPageIndex);
    }
    this.isScrolling = false;
  }

  onScrollBeginDrag() {
    if (!this.isScrolling) {
      this.isScrolling = true;
    }
  }

  calculatePageOffsets(width) {
    this.pageOffsets = [0];
    let widthSum = this.pageWidths[0] + dividerWidth / 2;
    for (let i = 1; i < this.pageWidths.length; i += 1) {
      const pageWidth = this.pageWidths[i];
      // 1. Calculates right side of page
      widthSum += dividerWidth / 2 + pageWidth + dividerWidth / 2;
      // 2. Calculates a offset which leed to the middle of page in the middle of screen.
      const offsetX = widthSum - pageWidth / 2 - dividerWidth / 2 - width / 2;
      this.pageOffsets.push(offsetX);
    }
  }

  scrollToIndex(index, animated = true) {
    this.scrollView.scrollTo({ x: this.pageOffsets[index], y: 0, animated });
  }

  render() {
    const { children, scrollEnabled } = this.props;
    const {
      endPageIndex, endPageWidth,
    } = this;
    return (
      <View pointerEvents="box-none" style={flex.flex1}>
        <ScrollView
          ref={(scrollView) => { this.scrollView = scrollView; }}
          scrollEnabled={scrollEnabled}
          horizontal
          scrollEventThrottle={1}
          decelerationRate="fast"
          snapToOffsets={this.pageOffsets}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onMomentumScrollEnd={(syntheticEvent) => this.onMomentumScrollEnd(syntheticEvent)}
          showsHorizontalScrollIndicator={false}
        >
          {
            React.Children.map(children, (child, i) => (
              <View key={i.toString()} style={[styles.pageOuterContainer, { zIndex: -i }]}>
                <ParallaxSwiperPage
                  width={child.props.width}
                  index={i}
                  component={child.props.component}
                />
                <View style={{ width: dividerWidth }} />
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

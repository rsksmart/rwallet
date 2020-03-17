import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Dimensions,
  ViewPropTypes,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {},
  itemContainer: { justifyContent: 'center' },
  button: {},
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.scrollToIndex = this.scrollToIndex.bind(this);
    this.itemAnimatedStyles = this.itemAnimatedStyles.bind(this);
    this.renderItemContainer = this.renderItemContainer.bind(this);
    this.handleOnScrollBeginDrag = this.handleOnScrollBeginDrag.bind(this);
    this.handleOnScrollEndDrag = this.handleOnScrollEndDrag.bind(this);
    this.getItemLayout = this.getItemLayout.bind(this);
    this.initialize();
    this.setScrollHandler();
  }

  componentDidMount() {
    const { initialIndex } = this.props;
    this.scrollToIndex(initialIndex, false);
  }

  setScrollHandler() {
    this.handleOnScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { x: this.xOffset } } }],
      {
        useNativeDriver: true,
        listener: (event) => {
          this.scrollX = event.nativeEvent.contentOffset.x;
        },
      },
    );
  }

  getItemLayout(data, index) {
    const { itemWidth, separatorWidth } = this.props;
    let offset;
    if (index === 0) {
      offset = 0;
    } else {
      offset = (index - 0.5) * (itemWidth + separatorWidth) + this.halfItemWidth - this.halfContainerWidth;
    }
    return {
      offset,
      length: (index === 0 ? 0.5 : 1) * (itemWidth + separatorWidth),
      index,
    };
  }

  handleOnScrollBeginDrag() {
    const { onScrollBeginDrag } = this.props;
    if (onScrollBeginDrag) onScrollBeginDrag();
    this.scrollXBegin = this.scrollX;
  }

  handleOnScrollEndDrag() {
    const { minScrollDistance, onScrollEndDrag } = this.props;
    if (onScrollEndDrag) onScrollEndDrag();

    if (this.scrollX < 0) {
      return;
    }
    const scrollDistance = this.scrollX - this.scrollXBegin;
    this.scrollXBegin = 0;
    if (Math.abs(scrollDistance) < minScrollDistance) {
      this.scrollToIndex(this.currentIndex);
      return;
    }
    if (scrollDistance < 0) {
      this.scrollToIndex(this.currentIndex - 1);
    } else {
      this.scrollToIndex(this.currentIndex + 1);
    }
  }

  scrollToIndex(index, animated = true) {
    const {
      onScrollEnd, data, itemWidth, separatorWidth,
    } = this.props;
    if (index < 0 || index >= data.length) return;
    onScrollEnd(data[index], index);
    this.currentIndex = index;
    setTimeout(() => {
      this.scrollView.getNode().scrollToOffset({
        offset: index === 0 ? 0 : (index - 0.5) * (itemWidth + separatorWidth) + this.halfItemWidth - this.halfContainerWidth,
        animated,
      });
    });
  }

  initialize() {
    const {
      itemWidth,
      containerWidth,
      initialIndex,
    } = this.props;

    this.currentIndex = initialIndex;
    this.scrollXBegin = 0;
    this.xOffset = new Animated.Value(0);
    this.halfContainerWidth = containerWidth / 2;
    this.halfItemWidth = itemWidth / 2;
    this.containerPadding = this.halfContainerWidth - this.halfItemWidth;
  }

  itemAnimatedStyles(index) {
    const {
      data,
      inActiveScale,
      inActiveOpacity,
      itemWidth,
      separatorWidth,
      containerWidth,
    } = this.props;
    // console.log('index: ', index);

    let startPoint; let midPoint; let endPoint;
    if (index === 0) {
      midPoint = 0;
      startPoint = midPoint - itemWidth * 0.5 - separatorWidth;
      endPoint = itemWidth * 0.5;
    } else {
      const animatedOffset = this.halfContainerWidth;
      midPoint = (index - 0.5) * (itemWidth + separatorWidth)
        + this.halfItemWidth
        - animatedOffset;
      // console.log('midPoint: ', midPoint);

      if (index === 1) {
        startPoint = this.halfItemWidth - this.halfContainerWidth;
      } else if (index === data.length - 1) {
        startPoint = (data.length - 2 - 0.5) * (itemWidth + separatorWidth) + this.halfItemWidth - this.halfContainerWidth;
      } else {
        startPoint = midPoint - itemWidth - separatorWidth;
      }
      // console.log('startPoint: ', startPoint);

      if (index === data.length - 2) {
        endPoint = (data.length - 1 - 0.5) * (itemWidth + separatorWidth) + itemWidth - containerWidth;
      } else {
        endPoint = midPoint + itemWidth + separatorWidth;
      }
      // console.log('endPoint: ', endPoint);
    }

    const animatedOpacity = {
      opacity: this.xOffset.interpolate({
        inputRange: [startPoint, midPoint, endPoint],
        outputRange: [inActiveOpacity, 1, inActiveOpacity],
      }),
    };

    let animatedScale;
    if (index === 0) {
      animatedScale = {
        transform: [
          {
            scaleX: this.xOffset.interpolate({
              inputRange: [startPoint, midPoint, endPoint],
              outputRange: [inActiveScale * 0.88, 1, inActiveScale * 0.88],
            }),
          }, {
            scaleY: this.xOffset.interpolate({
              inputRange: [startPoint, midPoint, endPoint],
              outputRange: [inActiveScale, 1, inActiveScale],
            }),
          },
        ],
      };
    } else {
      animatedScale = {
        transform: [
          {
            scale: this.xOffset.interpolate({
              inputRange: [startPoint, midPoint, endPoint],
              outputRange: [inActiveScale, 1, inActiveScale],
            }),
          },
        ],
      };
    }
    return {
      ...animatedOpacity,
      ...animatedScale,
    };
  }

  renderItemContainer({ item, index }) {
    const {
      data,
      renderItem,
      inverted,
      itemWidth,
      separatorWidth,
      itemContainerStyle,
    } = this.props;
    const marginWidth = index !== data.length - 1 ? separatorWidth : 0;
    const marginStyle = inverted
      ? { marginLeft: marginWidth }
      : { marginRight: marginWidth };
    return (
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.itemContainer,
          itemContainerStyle,
          { width: index === 0 ? itemWidth / 2 : itemWidth },
          marginStyle,
          this.itemAnimatedStyles(index),
        ]}
      >
        {renderItem({ item, index })}
      </Animated.View>
    );
  }

  render() {
    const {
      data,
      bounces,
      style,
      itemWidth,
      containerWidth,
      initialIndex,
      keyExtractor,
      ...otherProps
    } = this.props;
    return (
      <AnimatedFlatList
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...otherProps}
        bounces={bounces}
        horizontal
        data={data}
        decelerationRate={0}
        automaticallyAdjustContentInsets={false}
        keyExtractor={keyExtractor}
        ref={(ref) => { this.scrollView = ref; }}
        renderItem={this.renderItemContainer}
        style={[styles.container, { width: containerWidth }, style]}
        contentContainerStyle={{ paddingRight: this.containerPadding }}
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={this.handleOnScrollBeginDrag}
        onScroll={this.handleOnScroll}
        onScrollEndDrag={this.handleOnScrollEndDrag}
        getItemLayout={this.getItemLayout}
      />
    );
  }
}

Carousel.propTypes = {
  style: ViewPropTypes.style,
  bounces: PropTypes.bool,
  itemWidth: PropTypes.number,
  separatorWidth: PropTypes.number,
  containerWidth: PropTypes.number,
  itemContainerStyle: ViewPropTypes.style,
  inActiveScale: PropTypes.number,
  inActiveOpacity: PropTypes.number,
  keyExtractor: PropTypes.func,
  renderItem: PropTypes.func,
  onScrollEnd: PropTypes.func,
  pagingEnable: PropTypes.bool,
  initialIndex: PropTypes.number,
  minScrollDistance: PropTypes.number,
  onScrollBeginDrag: PropTypes.func,
  onScrollEndDrag: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object),
  inverted: PropTypes.bool,
};

Carousel.defaultProps = {
  inActiveScale: 0.92,
  inActiveOpacity: 0.8,
  separatorWidth: 0,
  containerWidth: width,
  itemWidth: 0.9 * width,
  bounces: true,
  data: [],
  style: {},
  initialIndex: 0,
  pagingEnable: true,
  inverted: false,
  minScrollDistance: 25,
  itemContainerStyle: {},
  keyExtractor: (item, index) => index.toString(),
  renderItem: () => {},
  onScrollEnd: () => {},
  onScrollBeginDrag: () => {},
  onScrollEndDrag: () => {},
};

export default Carousel;

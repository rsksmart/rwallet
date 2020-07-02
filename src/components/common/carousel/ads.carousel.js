import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width } = Dimensions.get('window');
const viewWidth = width * 0.9;

export default class AdsCarousel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
    };
  }

  render() {
    const {
      style, data, renderItem, sliderWidth, itemWidth,
    } = this.props;
    const { activeSlide } = this.state;
    const sourceData = data || [];
    return (
      <View style={style}>
        <Carousel
          layout="default"
          data={sourceData}
          renderItem={renderItem}
          sliderWidth={sliderWidth || width}
          itemWidth={itemWidth || viewWidth}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
        />

        <Pagination
          dotsLength={sourceData.length}
          activeDotIndex={activeSlide}
          containerStyle={{ position: 'absolute', bottom: -21 }}
          dotStyle={{
            width: 16,
            height: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
          }}
          dotContainerStyle={{ marginHorizontal: 4 }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1}
        />
      </View>
    );
  }
}

AdsCarousel.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  renderItem: PropTypes.func.isRequired,
  sliderWidth: PropTypes.number,
  itemWidth: PropTypes.number,
};

AdsCarousel.defaultProps = {
  style: null,
  sliderWidth: null,
  itemWidth: null,
};

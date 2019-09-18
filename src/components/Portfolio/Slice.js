import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as Svg from 'react-native-svg';
import * as shape from 'd3-shape';
import { PropTypes } from 'prop-types';


const d3 = { shape };


class Slice extends Component {
  generateArc = d3.shape.arc()
    .outerRadius(this.props.outerRadius)
    .padAngle(0)
    .innerRadius(60 + this.props.innerRadiusDiff);

  createPieArc = (index, endAngle, data) => {
    const arcs = d3.shape.pie()
      .value(item => item.number)
      .startAngle(0)
      .endAngle(endAngle)(data);
    return this.generateArc(arcs[index]);
  };

  render() {
    const {
      endAngle,
      color,
      index,
      data,
      onPress,
    } = this.props;

    return (
      <Svg.Path
        onPress={() => onPress(data[index])}
        d={this.createPieArc(index, endAngle, data)}
        fill={color}
      />
    );
  }
}

Slice.propTypes = {
  endAngle: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    network: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
  })).isRequired,
  onPress: PropTypes.func.isRequired,
  outerRadius: PropTypes.number.isRequired,
  innerRadiusDiff: PropTypes.number.isRequired,
};

export default Animated.createAnimatedComponent(Slice);

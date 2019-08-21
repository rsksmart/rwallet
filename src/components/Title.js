import React from 'react';
import { Text, View, H1 } from 'native-base';
import { PropTypes } from 'prop-types';


const title = props => (
  <View>
    <H1 adjustsFontSizeToFit style={props.titleStyle}>{props.title}</H1>
    <Text note style={props.subtitleStyle}>{props.subtitle}</Text>
  </View>
);

title.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  subtitleStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.any,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.any,
      ]),
    )]),
  titleStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.any,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.any,
      ]),
    )]),
};

title.defaultProps = {
  subtitle: '',
  subtitleStyle: [],
  titleStyle: [],
};

export default title;

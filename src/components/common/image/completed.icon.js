
import React from 'react';
import { Dimensions } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import PropTypes from 'prop-types';
import references from '../../../assets/references';

const screenWidth = Dimensions.get('window').width;

const CompletedIcon = ({ style, percent }) => (<AutoHeightImage style={style} source={references.images.completed} width={screenWidth * percent} />);

CompletedIcon.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  percent: PropTypes.number,
};

CompletedIcon.defaultProps = {
  style: undefined,
  percent: 0.28,
};

export default CompletedIcon;

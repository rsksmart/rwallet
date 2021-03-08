import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const CommonPress = (props) => {
  const { onPress, children, style } = props;

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        {children}
      </TouchableOpacity>
    );
  }
  return (
    <View style={style}>
      {children}
    </View>
  );
};

CommonPress.propTypes = {
  onPress: PropTypes.func.isRequired,
  children: PropTypes.shape({}).isRequired,
  style: PropTypes.string.isRequired,
};


export default CommonPress;

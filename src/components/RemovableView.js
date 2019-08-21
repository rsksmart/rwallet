import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const removableView = (props) => {
  const { children, hidden } = props;
  if (hidden) {
    return <View />;
  }
  return (
    <View {...props}>
      {children}
    </View>
  );
};

removableView.propTypes = {
  children: PropTypes.node.isRequired,
  hidden: PropTypes.bool,
};

removableView.defaultProps = {
  hidden: false,
};

export default removableView;

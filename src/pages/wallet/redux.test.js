import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import flex from '../../assets/styles/layout.flex';

const ReduxTest = () => <View style={[flex.flex1]} />;

ReduxTest.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};

export default ReduxTest;

import React from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import SwapSelection from './swap.selection';

const SwapIndex = (props) => {
  const { navigation } = props;

  return <SwapSelection navigation={navigation} headless bottomPaddingComponent={<View style={[{ height: 80 }]} />} />;
};

SwapIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

export default withNavigation(SwapIndex);

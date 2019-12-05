import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

const FullWidthImage = ({ source }) => {
  const [wrapperWidth, setWrapperWidth] = useState(0);
  return (
    <View
      style={{ display: 'flex', flexDirection: 'row' }}
      onLayout={(event) => setWrapperWidth(event.nativeEvent.layout.width)}
    >
      <AutoHeightImage
        width={wrapperWidth}
        source={source}
      />
    </View>
  );
};

FullWidthImage.propTypes = {
  source: PropTypes.number.isRequired,
};

export default FullWidthImage;

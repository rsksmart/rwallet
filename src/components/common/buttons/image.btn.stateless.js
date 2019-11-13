import React from 'react';
import { Text, TouchableOpacity, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import style from '../../../assets/styles/style.ts';
import color from '../../../assets/styles/color.ts';
import flex from '../../../assets/styles/layout.flex';

import BtnBg from '../../../assets/images/common/button.bg.png';

const ImageBtnStateless = (props) => {
  const {
    onPress, text, disable,
  } = props;
  let {
    height, image,
  } = props;
  image = image || BtnBg;
  height = height || 42;
  return (
    <TouchableOpacity
      style={[{ height }, style.borderRadiusFull, style.overHidden]}
      onPress={() => {
        if (!disable) {
          onPress();
        }
      }}
    >
      <ImageBackground style={[{ width: '100%', height: '100%', opacity: disable ? 0.5 : 1 }, flex.justifyCenter, flex.alignCenter]} source={image}>
        {(() => {
          if (typeof text === 'string') {
            return <Text style={[color.font.white]}>{text}</Text>;
          }
          return text;
        })()}
      </ImageBackground>
    </TouchableOpacity>
  );
};

ImageBtnStateless.propTypes = {
  height: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  disable: PropTypes.bool.isRequired,
  onPress: PropTypes.func,
};

ImageBtnStateless.defaultProps = {
  onPress: null,
};

export default ImageBtnStateless;

import React, { Component } from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';

import CommonPress from '../common.press';
import style from '../../../assets/styles/style';

export default class IconBtnStateless extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: props.img,
    };
  }

  render() {
    const {
      onPress, disable, defaultImg, radiusFull,
    } = this.props;
    let { rotate, size } = this.props;

    size = size || 24;
    rotate = rotate || 0;
    const { img } = this.state;
    return (
      <CommonPress style={{ opacity: disable ? 0.3 : 1 }} onPress={disable ? null : onPress}>
        <View
          style={[
            {
              transform: [{ rotate: `${rotate}deg` }],
            },
            radiusFull ? style.borderRadiusFull : {},
            style.overHidden,
          ]}
        >
          <Image
            onError={() => {
              this.setState({ img: { uri: defaultImg } });
            }}
            style={[
              {
                height: size,
                width: size,
              },
            ]}
            source={img}
          />
        </View>
      </CommonPress>
    );
  }
}

IconBtnStateless.propTypes = {
  rotate: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  radiusFull: PropTypes.string.isRequired,
  defaultImg: PropTypes.string.isRequired,
  disable: PropTypes.bool.isRequired,
  img: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

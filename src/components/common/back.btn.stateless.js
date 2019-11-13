import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import back from '../../assets/images/arrow/back.gray.png';
import space from '../../assets/styles/space';

const BackBtn = (props) => {
  const { navigation, onPress, backSource } = props;
  return (
    <TouchableOpacity
      style={[space.paddingHorizontal_18, space.paddingVertical_30]}
      onPress={(e) => {
        if (onPress) {
          onPress(e);
        } else {
          navigation.pop();
        }
      }}
    >
      <Image
        source={(props && backSource) || back}
        style={[space.width_height_21]}
      />
    </TouchableOpacity>
  );
};

BackBtn.propTypes = {
  backSource: PropTypes.string,
  onPress: PropTypes.func,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

BackBtn.defaultProps = {
  onPress: null,
  backSource: null,
};

export default BackBtn;

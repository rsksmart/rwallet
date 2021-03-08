import React from 'react';
import {
  StyleSheet, View, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Loc from '../common/misc/loc';
import color from '../../assets/styles/color';
import fontFamily from '../../assets/styles/font.family';

const styles = StyleSheet.create({
  headerTitle: {
    color: color.whiteA90,
    fontFamily: fontFamily.AvenirMedium,
    fontSize: 20,
    letterSpacing: 0.39,
    marginLeft: 12,
    marginBottom: 2,
  },
  chevronView: {
    width: 10,
    height: 43,
  },
  chevron: {
    color: color.component.navBackIndicator.color,
    marginTop: -1.5,
    marginLeft: -14,
    fontSize: 40,
  },
});

const BackButton = ({ onBackButtonPress, title, style }) => (
  <TouchableOpacity style={style} onPress={onBackButtonPress}>
    <View style={styles.chevronView}><Entypo name="chevron-small-left" style={styles.chevron} /></View>
    <Loc style={styles.headerTitle} text={title} />
  </TouchableOpacity>
);

BackButton.propTypes = {
  title: PropTypes.string.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

BackButton.defaultProps = {
  style: undefined,
};

export default BackButton;

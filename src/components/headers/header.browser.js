import React from 'react';
import {
  ImageBackground, TouchableOpacity, View, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import browserHeaderStyles from '../../assets/styles/header.browser.styles';
import references from '../../assets/references';

export default function BrowserHeader({
  title, onBackButtonPress, onCloseButtonPress,
}) {
  return (
    <ImageBackground source={references.images.header} style={browserHeaderStyles.headerImage}>
      <View style={browserHeaderStyles.titleView}>
        <TouchableOpacity onPress={onBackButtonPress} style={browserHeaderStyles.chevronView}><Entypo name="chevron-small-left" style={browserHeaderStyles.chevron} /></TouchableOpacity>
        <TouchableOpacity onPress={onCloseButtonPress} style={[browserHeaderStyles.chevronView, { marginLeft: 30 }]}><Ionicons name="md-close" style={browserHeaderStyles.cross} /></TouchableOpacity>
        <Text style={browserHeaderStyles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>
    </ImageBackground>
  );
}

BrowserHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
  onCloseButtonPress: PropTypes.func.isRequired,
};

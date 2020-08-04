import React from 'react';
import {
  ImageBackground, TouchableOpacity, View,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loc from '../common/misc/loc';
import browserHeaderStyles from '../../assets/styles/header.browser.styles';
import references from '../../assets/references';

export default function BrowserHeader({
  title, onBackButtonPress, onCloseButtonPress, onSwitchButtonPress = null,
}) {
  return (
    <ImageBackground source={references.images.header} style={browserHeaderStyles.headerImage}>
      <View style={browserHeaderStyles.titleView}>
        <TouchableOpacity onPress={onBackButtonPress} style={browserHeaderStyles.chevronView}><Entypo name="chevron-small-left" style={browserHeaderStyles.chevron} /></TouchableOpacity>
        <TouchableOpacity onPress={onCloseButtonPress} style={[browserHeaderStyles.chevronView, { marginLeft: 30 }]}><Ionicons name="md-close" style={browserHeaderStyles.cross} /></TouchableOpacity>
        <TouchableOpacity onPress={onSwitchButtonPress} style={[browserHeaderStyles.chevronView, { marginLeft: 30 }]}><Entypo name="list" style={browserHeaderStyles.list} /></TouchableOpacity>
        <Loc style={browserHeaderStyles.headerTitle} text={title} numberOfLines={1} />
      </View>
    </ImageBackground>
  );
}

BrowserHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
  onCloseButtonPress: PropTypes.func.isRequired,
  onSwitchButtonPress: PropTypes.func.isRequired,
};

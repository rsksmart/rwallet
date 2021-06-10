import React from 'react';
import { ActivityIndicator } from 'react-native';

export default class RefreshHeader extends React.Component {
    // "height" is the react-native-spring-scrollview/RefreshHeader's static variable，overwrite it can control the refresh header's height
    static height = 50;

    render() {
      return <ActivityIndicator style={{ alignSelf: 'center' }} />;
    }
}

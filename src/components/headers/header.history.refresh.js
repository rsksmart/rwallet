import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RefreshHeader as Header } from 'react-native-spring-scrollview';

export default class RefreshHeader extends Header {
    // "height" is the react-native-spring-scrollview/RefreshHeader's static variable，overwrite it can control the refresh header's height
    static height = 50;

    render() {
      return <ActivityIndicator style={{ alignSelf: 'center' }} />;
    }
}

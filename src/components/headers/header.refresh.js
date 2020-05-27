import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RefreshHeader as Header } from 'react-native-spring-scrollview';

export default class RefreshHeader extends Header {
    static height = 50;

    render() {
      return <ActivityIndicator style={{ alignSelf: 'center' }} />;
    }
}

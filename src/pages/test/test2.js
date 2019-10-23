import React, { Component } from 'react';
import {
  View, Image, StyleSheet,
} from 'react-native';
import flex from '../../assets/styles/layout.flex';

const styles = StyleSheet.create({
  scanView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#9B9B9B',
  },
});
class Test2 extends Component {
    static navigationOptions = {};

    render() {
      return (
        <View style={[flex.flex1, styles.container]}>
          <View style={styles.scanView}>
            <Image source={require('../../assets/images/misc/scan.png')} />
          </View>
        </View>
      );
    }
}
export default Test2;

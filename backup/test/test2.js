import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text,
}
  from 'react-native';
import flex from '../../assets/styles/layout.flex';
import storage from '../../common/storage';

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

const scan = require('../../assets/images/misc/scan.png');

class Test2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: -1,
    };
  }

  async componentDidMount() {
    const num = await storage.load({
      key: 'TEST2NUM',
    });
    this.setState({ num });
  }

  static navigationOptions = {};

  render() {
    const { num } = this.state;
    return (
      <View style={[flex.flex1, styles.container]}>
        <Text>
          This is the test page 2 with num:
          {num}
        </Text>
        <View style={styles.scanView}>
          <Image source={scan} />
        </View>
      </View>
    );
  }
}
export default Test2;

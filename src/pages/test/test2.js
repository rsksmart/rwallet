import React, { Component } from 'react';
import {
  View, Image, StyleSheet,
} from 'react-native';
import flex from '../../assets/styles/layout.flex';
import storage from '../../common/storage'

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
    constructor(props){
        super(props);
        this.state = {
            num: -1
        }
    }
    async componentDidMount() {
        console.log('componentDidMount');
        let num = await storage.load({
            key: 'TEST2NUM'
        })
        console.log(num);
        this.setState({num})
    }
    render() {
      return (
        <View style={[flex.flex1, styles.container]}>
          <Text>This is the test page 2 with num: {this.state.num}</Text>
          <View style={styles.scanView}>
            <Image source={require('../../assets/images/misc/scan.png')} />
          </View>
        </View>
      );
    }
}
export default Test2;

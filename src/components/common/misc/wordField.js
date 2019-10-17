import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text} from 'react-native';
import DashLine from './dashLine';


export default class WordField extends Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <View style={styles.frame}>
        <View style={styles.dashView}>
          <DashLine width={100} />
        </View>
        <View style={styles.textView}>
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  frame: {
    borderColor:'#00B520',
    backgroundColor:'#F3F3F3',
    borderRadius: 4,
    borderWidth: 1,
    width: 163,
    height: 107,
  },
  textView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dashView: {
    position: 'absolute',
    width:'100%',
    height: '100%',
    paddingTop: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center'
  },
  text: {
    width: '70%',
    textAlign: 'center',
  },
  item: {
    backgroundColor: 'yellow',
    width: 50,
    height: 50,
  }
});

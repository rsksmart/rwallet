import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text} from 'react-native';

export default class Tags extends Component {

  constructor(props){
    super(props)
  }

  render() {
    let length: any = this.props.data.length;
    let res = [];
    for(var i = 0; i < length; i++) {
      res.push(<Text style={styles.item}>{i+1}) {this.props.data[i]}</Text>)
    }

    return (
      <View style={styles.tags}>
        {res}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    backgroundColor: '#0AB627',
    marginLeft: 10,
    padding: 5,
    color: '#FFF',
    borderRadius: 2,
    marginBottom: 10,
  }
});

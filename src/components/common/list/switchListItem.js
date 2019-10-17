import React, { Component } from 'react';
import { StyleSheet, View, Switch, Text} from 'react-native';

export default class SwitchListItem extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Switch value={this.props.value}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 5,
    borderBottomColor: '#bbb',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    // backgroundColor: 'red',
  },
  title: {
    flex: 1,
  }
});

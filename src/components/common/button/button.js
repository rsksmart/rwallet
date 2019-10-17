import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Alert, Text, View } from 'react-native';

export default class Button extends Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor="white">
        <View style={styles.button}>
          <Text style={styles.buttonText}>{this.props.text}</Text>
        </View>
      </TouchableHighlight>
    );
  }

}

const styles = StyleSheet.create({
  button: {
    width: 260,
    alignItems: 'center',
    backgroundColor: '#00b520',
    borderRadius: 27,
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Avenir Black',
    fontWeight: "900"
  }
});

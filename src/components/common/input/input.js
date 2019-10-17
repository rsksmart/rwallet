import React, { Component } from 'react';
import { StyleSheet, View, TextInput} from 'react-native';

export default class Input extends Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <View style={styles.textInput} >
        <TextInput 
          placeholder={this.props.placeholder} 
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  textInput:{
    borderColor:'rgba(144,144,144,0.2)',
    backgroundColor:'#F3F3F3',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 15,
    height: 40,
    marginTop: 10,
    paddingHorizontal: 10,
  }
});

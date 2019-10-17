import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Image} from 'react-native';

import searchIcon from '../../../assets/images/icon/search.png';

export default class SearchInput extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <View style={styles.textInput}>
        <View style={{flexDirection: 'row'}}>
          <Image style={{marginTop:7}} source={searchIcon} />
          <TextInput style={{flex:1}} placeholder={this.props.placeholder} />
        </View>
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

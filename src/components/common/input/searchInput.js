import React from 'react';
import {
  StyleSheet, View, TextInput, Image,
} from 'react-native';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  textInput: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 15,
    height: 40,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default function SearchInput({placeholder}) {
  return (
    <View style={styles.textInput}>
      <View style={{ flexDirection: 'row' }}>
        <Image style={{ marginTop: 7 }} source={require('../../../assets/images/icon/search.png')} />
        <TextInput style={{ flex: 1 }} placeholder={placeholder} />
      </View>
    </View>
  );
}

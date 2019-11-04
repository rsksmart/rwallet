import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity
} from 'react-native';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    backgroundColor: color.component.tags.backgroundColor,
    marginLeft: 10,
    padding: 5,
    color: color.component.tags.color,
    borderRadius: 2,
    marginTop: 10,
  },
});

export default function Tags({ data, onPress }) {
  const { length } = data;
  const res = [];
  for (let i = 0; i < length; i += 1) {
    res.push(
      <TouchableOpacity onPress={()=>{
        if(onPress){
          onPress(i);
        }
      }} key={i}>
        <Text style={styles.item}>
          {i + 1}
  )
          {' '}
          {data[i]}
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.tags}>
      {res}
    </View>
  );
}

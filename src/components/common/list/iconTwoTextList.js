import React from 'react';
import {
  StyleSheet, View, Image, FlatList, Text, TouchableHighlight,
} from 'react-native';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  item: {
    padding: 5,
    borderBottomColor: color.component.iconTwoTextList.borderBottomColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {

  },
  right: {
    marginLeft: 20,
    height: 66,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 7,
  },
  textView: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: color.component.iconTwoTextList.title.color,
    fontSize: 22,
    flex: 1,
  },
  text: {
    color: color.component.iconList.color,
    fontSize: 15,
    flex: 1,
  },
  arrow: {
    aspectRatio: 1.05,
  },
});

function Item({ title, onPress }) {
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.item}>
        <Image source={require('../../../assets/images/icon/RIF.png')} />
        <View style={[styles.right]}>
          <View style={styles.textView}>
            <Text style={[styles.title]}>{title}</Text>
            <Text style={[styles.text]}>{title}</Text>
          </View>
          <Image style={styles.arrow} source={require('../../../assets/images/arrow/more.black.png')} />
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default function IconTwoTextList({ data }) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Item title={item.title} onPress={item.onPress} />}
      keyExtractor={(item) => item.id}
    />
  );
}

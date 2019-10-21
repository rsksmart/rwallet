import React from 'react';
import {
  StyleSheet, View, Image, FlatList, Text, TouchableOpacity,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  item: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    marginLeft: 20,
    height: 45,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.component.iconList.borderBottomColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 9,
  },
  title: {
    fontSize: 16,
    flex: 1,
    color: color.component.iconList.title.color,
  },
  chevron: {
    color: color.component.iconList.chevron.color,
  },
});

function Item({ title, icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <Image source={icon} />
        <View style={[styles.right]}>
          <Text style={[styles.title]}>{title}</Text>
          <Entypo name="chevron-small-right" size={35} style={styles.chevron} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function IconList({ data }) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Item title={item.title} icon={item.icon} onPress={item.onPress} />}
      keyExtractor={(item) => item.id}
    />
  );
}

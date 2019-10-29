import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
const header = require('../../../assets/images/misc/header.png')

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 10,
    top: 70,
  },
  headerView: {
    position: 'absolute',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    position: 'absolute',
    top: 132,
    left: 24,
    color: '#FFF',
  },
  chevron: {
    color: '#FFF',
  },
});

export default function Header({title, goBack}) {
  return (
    <View>
      <Image source={header} />
      <View style={styles.headerView}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            goBack();
          }}
        >
          <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

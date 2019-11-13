import React from 'react';
import {
  StyleSheet, View, Image, FlatList, Text, TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../assets/styles/color.ts';

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

const RIF = require('../../../assets/images/icon/RIF.png');
const moreBlack = require('../../../assets/images/arrow/more.black.png');

function Item({ title, onPress }) {
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.item}>
        <Image source={RIF} />
        <View style={[styles.right]}>
          <View style={styles.textView}>
            <Text style={[styles.title]}>{title}</Text>
            <Text style={[styles.text]}>{title}</Text>
          </View>
          <Image style={styles.arrow} source={moreBlack} />
        </View>
      </View>
    </TouchableHighlight>
  );
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};


export default function IconTwoTextList({ data }) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Item title={item.title} onPress={item.onPress} />}
      keyExtractor={(item) => item.id}
    />
  );
}

IconTwoTextList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Item.propTypes)).isRequired,
};

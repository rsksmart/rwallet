import React, { Component } from 'react';
import { StyleSheet, View, Image, FlatList, Text, TouchableHighlight} from 'react-native';

import rifIcon from '../../../assets/images/icon/RIF.png';
import moreBlackIcon from '../../../assets/images/arrow/more.black.png';

function Item({title, onPress}) {
  // alert(onPress);
  return (
    <TouchableHighlight onPress={onPress}>
    <View style={styles.item}>
      <Image source={rifIcon} />
      <View style={[styles.right]}>
        <Text style={[styles.title]}>{title}</Text>
        <Image style={styles.arrow} source={moreBlackIcon} />
      </View>
    </View>
    </TouchableHighlight>
  );
}

export default class IconList extends Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <FlatList data={this.props.data}
        renderItem={({item})=><Item title={item.title} onPress={item.onPress} />}
        keyExtractor={item=>item.id}
      />
    );
  }

}

const styles = StyleSheet.create({
  item: {
    padding: 5,
    borderBottomColor: '#bbb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    marginLeft: 20,
    height: 45,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 7,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  arrow: {
    aspectRatio: 1.05,
  }
});

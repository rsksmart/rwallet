import React, { Component } from 'react';

import {
  StyleSheet, View, Image, FlatList, Text, TouchableHighlight,
} from 'react-native';
import color from '../../../assets/styles/color';

const styles = StyleSheet.create({
  item: {
    borderBottomColor: color.component.iconTwoTextList.borderBottomColor,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 30,
  },
  title: {
    fontSize: 16,
    flex: 1,
    color: color.component.selectionList.color,
  },
  arrow: {
    aspectRatio: 1.05,
  },
});

function Item({ title, selected, onPress }) {
  let arrow = null;
  if (selected) {
    arrow = <Image style={styles.arrow} source={require('../../../assets/images/arrow/more.black.png')} />;
  }
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={[styles.title]}>{title}</Text>
          {arrow}
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default class SelectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null,
    };
    this.onPress = this.onPress.bind(this);
  }

  onPress(index) {
    this.setState({ selectedIndex: index });
  }

  render() {
    const { selectedIndex } = this.state;
    const { data } = this.props;
    return (
      <FlatList
        data={data}
        extraData={this.state}
        renderItem={({ item, index }) => {
          let selected = false;
          if (selectedIndex === index) {
            selected = true;
          }
          return (
            <Item
              title={item.title}
              onPress={() => {
                this.onPress(index);
              }}
              selected={selected}
            />
          );
        }}
        keyExtractor={(item) => item.id}
      />
    );
  }
}

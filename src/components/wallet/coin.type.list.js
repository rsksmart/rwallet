import React, {Component} from 'react';
import {
  StyleSheet, View, Image, FlatList, Text, TouchableOpacity, Switch
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import color from '../../assets/styles/color';

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
});

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.data.selected };
  }
  render(){
    const { data } = this.props;
    return (
      <View style={styles.item}>
        <Image source={data.icon} />
        <View style={[styles.right]}>
            <Text style={[styles.title]}>{data.title}</Text>
          <Switch
            value={this.state.value}
            onValueChange={(v) => {
              this.setState({ value: v });
              data.selected = v;
            }}
          />
        </View>
      </View>
    );
  }
}

export default class CoinTypeList extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    let {data} = this.props;
    return (
      <FlatList
        data={data}
        renderItem={({ item }) => <Item data={item} />}
        keyExtractor={(item) => item.id}
      />
    );
  }
}

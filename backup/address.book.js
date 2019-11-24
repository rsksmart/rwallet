import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import flex from '../../assets/styles/layout.flex';
import Header from '../../components/common/misc/header';
import color from '../../assets/styles/color.ts';

const styles = StyleSheet.create({
  input: {
    height: 50,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  walletName: {
    fontSize: 20,
  },
  sectionContainer: {
    marginTop: 10,
    marginHorizontal: 25,
    paddingBottom: 10,
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  bottomBorder: {
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: {
    color: '#242B33',
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    color: color.component.iconList.chevron.color,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowMid: {
    marginLeft: 10,
  },
  textInput: {
    color: '#B5B5B5',
    fontSize: 12,
    fontWeight: '300',
    paddingVertical: 0,
    marginLeft: 20,
  },
  textInputView: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    flex: 1,
    justifyContent: 'center',
  },
  searchRow: {
    marginTop: 30,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  add: {
    color: '#00B520',
    marginLeft: 15,
  },
  searchIcon: {
    position: 'absolute',
  },
});

function Item({
  icon, name, address, onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Image source={icon} />
          <View style={styles.rowMid}>
            <Text style={[styles.name]}>{name}</Text>
            <Text style={[]}>{address}</Text>
          </View>
        </View>
        <Entypo name="chevron-small-right" size={35} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}


Item.propTypes = {
  icon: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

Item.defaultProps = {
  onPress: null,
};

const avatar01 = require('../../assets/images/avatar/avatar01.png');
const avatar02 = require('../../assets/images/avatar/avatar02.png');
const avatar03 = require('../../assets/images/avatar/avatar03.png');
const avatar04 = require('../../assets/images/avatar/avatar04.png');

export default class AddressBook extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  recent = [
    { name: 'Vương Mộng Nhi', address: 'bc1q6qk4k9rmttf5gref30u2...', icon: avatar01 },
    { name: 'Harinder Mondi', address: 'bc1q8vu8078t7ll6wy44xe5x...', icon: avatar02 },
    { name: 'Harinder Bharwal', address: '1N6BNo7asEfe1kuPSHZETB...', icon: avatar03 },
  ];

  all = [
    { name: 'Vương Mộng Nhi', address: 'bc1q6qk4k9rmttf5gref30u2...', icon: avatar01 },
    { name: 'Harinder Mondi', address: 'bc1q8vu8078t7ll6wy44xe5x...', icon: avatar02 },
    { name: 'Harinder Bharwal', address: '1N6BNo7asEfe1kuPSHZETB...', icon: avatar03 },
    { name: 'Olivia Evans', address: '3H6wabC6YsCTeVyuRHY2v8...', icon: avatar04 },
  ];

  render() {
    const { navigation } = this.props;
    return (
      <ScrollView style={[flex.flex1]}>
        <Header title="Address Book" goBack={navigation.goBack} />
        <View style={[styles.sectionContainer, styles.searchRow]}>
          <View style={styles.textInputView}>
            <TextInput style={[styles.textInput]} placeholder="Search a contact…" />
            <EvilIcons style={styles.searchIcon} name="search" size={20} />
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons style={styles.add} name="ios-add" size={30} />
          </TouchableOpacity>
        </View>
        <View style={[styles.sectionContainer]}>
          <Text style={[styles.sectionTitle]}>RECENT</Text>
          <FlatList
            data={this.recent}
            renderItem={({ item }) => (
              <Item
                name={item.name}
                address={item.address}
                icon={item.icon}
                onPress={item.onPress}
              />
            )}
            keyExtractor={() => `${Math.random()}`}
          />
        </View>
        <View style={[styles.sectionContainer]}>
          <Text style={[styles.sectionTitle]}>ALL</Text>
          <FlatList
            data={this.all}
            renderItem={({ item }) => (
              <Item
                name={item.name}
                address={item.address}
                icon={item.icon}
                onPress={item.onPress}
              />
            )}
            keyExtractor={() => `${Math.random()}`}
          />
        </View>
      </ScrollView>
    );
  }
}

AddressBook.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

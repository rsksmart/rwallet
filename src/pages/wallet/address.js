import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import flex from '../../assets/styles/layout.flex';

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  sectionContainer: {
    paddingHorizontal: 30,
  },
  headerView: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 48,
    left: 55,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 37,
  },
  chevron: {
    color: '#FFF',
  },
  headImage: {
    position: 'absolute',
  },
  body: {
    paddingTop: 65,
  },
  scrollView: {},
  avatar: {
    position: 'absolute',
    left: 20,
    top: 70,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  title: {
    color: '#9B9B9B',
    fontSize: 16,
    fontWeight: '300',
  },
  address: {
    color: '#4A4A4A',
    fontSize: 16,
  },
  right: {
    marginLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    paddingVertical: 20,
    flex: 1,
  },
  logoView: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  powerby: {
    color: '#727372',
    fontSize: 17,
    fontWeight: '900',
  },
  nameView: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 160,
    top: 130,
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.39,
    color: '#FFFFFF',
    paddingBottom: 6,
  },
  nameEditView: {
    padding: 5,
  },
  nameEdit: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
  emailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    paddingBottom: 15,
  },
  remove: {
    color: '#D0021B',
    fontSize: 16,
    marginTop: 30,
  },
  send: {
    color: '#00B520',
    fontSize: 16,
    marginTop: 30,
  },
  addressTitle: {
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: '300',
    marginTop: 20,
    marginBottom: 10,
  },
  emailTitle: {
    flex: 1,
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: '300',
  },
  email: {
    flex: 1,
    color: '#9B9B9B',
    fontSize: 16,
    fontWeight: '300',
  },
});

const header = require('../../assets/images/misc/header.png');
const avatar = require('../../assets/images/mine/avatar.png');

function Item({ data }) {
  return (
    <View style={[styles.row]}>
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
        <Text style={(styles.title, { width: 70 })}>{data.name}</Text>
        <Text style={styles.title}>{data.type}</Text>
      </View>
      <Text style={styles.address}>{data.address}</Text>
    </View>
  );
}

Item.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

class MineIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  listData = [
    {
      name: 'BTC',
      type: 'Livenet',
      address: 'bc1q6qk4k9rmttf...',
    },
    {
      name: 'BTC',
      type: 'Testnet',
      address: 'bc1q8vu8078t7ll...',
    },
    {
      name: 'RSK',
      type: 'Livenet',
      address: '1N6BNo7asEfe1k...',
    },
    {
      name: 'RSK',
      type: 'Testnet',
      address: '3H6wabC6YsCTe...',
    },
  ];

  render() {
    return (
      <ScrollView style={[flex.flex1, styles.scrollView]}>
        <ImageBackground source={header} style={[{ height: 160, backgroundColor: 'red' }]} />
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.nameView}>
          <Text style={styles.name}>Vương Mộng Nhi</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <View style={[styles.emailRow]}>
              <Text style={styles.emailTitle}>Email</Text>
              <Text>jean@payne.com</Text>
            </View>
            <View>
              <Text style={styles.addressTitle}>Address</Text>
            </View>
            <FlatList
              data={this.listData}
              renderItem={({ item }) => <Item data={item} />}
              keyExtractor={() => `${Math.random()}`}
            />
            <TouchableOpacity>
              <Text style={styles.send}>Send Money</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default MineIndex;

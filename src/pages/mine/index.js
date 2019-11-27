import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loc from '../../components/common/misc/loc';
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
    paddingLeft: 10,
  },
  title: {
    color: '#0B0B0B',
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
});

const header = require('../../assets/images/misc/header.png');
const avatar = require('../../assets/images/mine/avatar.png');
const rsk = require('../../assets/images/mine/rsk.png');

function Item({ data }) {
  return (
    <TouchableOpacity
      style={[styles.row]}
      onPress={() => {
        if (data.onPress) {
          data.onPress();
        }
      }}
    >
      {data.icon}
      <View style={styles.right}>
        <Loc style={[styles.title]} text={data.title} />
      </View>
    </TouchableOpacity>
  );
}

Item.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    onPress: PropTypes.func,
  }),
};

Item.defaultProps = {
  data: { onPress: null },
};


const iconSize = 20;

export default class MineIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  settings = [
    {
      title: 'Language',
      icon: <MaterialIcons name="language" size={iconSize} style={{ color: '#4A4A4A' }} />,
      onPress: () => {
        const { navigation } = this.props;
        navigation.navigate('Language');
      },
    },
    {
      title: 'Currency',
      icon: (
        <MaterialCommunityIcons name="currency-usd" size={iconSize} style={{ color: '#4A4A4A' }} />
      ),
      onPress: () => {
        const { navigation } = this.props;
        navigation.navigate('Currency');
      },
    },
    {
      title: 'Two-Factor Authentication',
      icon: (
        <MaterialCommunityIcons
          name="two-factor-authentication"
          size={iconSize}
          style={{ color: '#4A4A4A' }}
        />
      ),
      onPress: () => {
        const { navigation } = this.props;
        navigation.navigate('TwoFactorAuth');
      },
    },
  ];

  render() {
    return (
      <View style={flex.flex1}>
        <ScrollView style={[flex.flex1, styles.scrollView]}>
          <ImageBackground source={header} style={[{ height: 160, backgroundColor: 'red' }]} />
          <Image source={avatar} style={styles.avatar} />
          <View style={styles.nameView}>
            <Text style={styles.name}>Jean Payene</Text>
            <TouchableOpacity style={styles.nameEditView}>
              <FontAwesome name="edit" size={25} style={styles.nameEdit} />
            </TouchableOpacity>
          </View>
          <View style={[styles.body]}>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.sectionTitle]} text="Settings" />
              <FlatList
                data={this.settings}
                renderItem={({ item }) => <Item data={item} />}
                keyExtractor={() => `${Math.random()}`}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.logoView}>
          <Text style={styles.powerby}>Powered by</Text>
          <Image source={rsk} />
        </View>
      </View>
    );
  }
}

MineIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

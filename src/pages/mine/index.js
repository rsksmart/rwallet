import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, ImageBackground, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Loc from '../../components/common/misc/loc';
import flex from '../../assets/styles/layout.flex';
import { DEVICE } from '../../common/info';
import { strings } from '../../common/i18n';
import ScreenHelper from '../../common/screenHelper';

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
  body: {
    paddingTop: 65,
  },
  avatar: {
    position: 'absolute',
    left: 20,
    bottom: -40,
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
    marginTop: 5,
  },
  nameView: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 160,
    bottom: 5,
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

function Item({ data, title }) {
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
        <Text>{title}</Text>
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
  title: PropTypes.string.isRequired,
};

Item.defaultProps = {
  data: { onPress: null },
};


const iconSize = 20;

class MineIndex extends Component {
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

  joins = [
    {
      title: 'Twitter',
      icon: <FontAwesome name="twitter" size={30} style={{ color: '#039BE5' }} />,
      onPress: () => {
        Linking.openURL('https://twitter.com');
      },
    },
    {
      title: 'Telegram',
      icon: <FontAwesome name="telegram" size={30} style={{ color: '#6FC062' }} />,
      onPress: () => {
        Linking.openURL('https://telegram.org');
      },
    },
    {
      title: 'Facebook',
      icon: <Entypo name="facebook-with-circle" size={30} style={{ color: '#3F51B5' }} />,
      onPress: () => {
        Linking.openURL('https://facebook.com');
      },
    },
    {
      title: 'Discord',
      icon: <FontAwesome5 name="discord" size={30} style={{ color: '#8C9EFF' }} />,
      onPress: () => {
        Linking.openURL('https://discordapp.com/');
      },
    },
    {
      title: 'Reddit',
      icon: <FontAwesome name="reddit" size={30} style={{ color: '#FF4500' }} />,
      onPress: () => {
        Linking.openURL('https://reddit.com/');
      },
    },
    {
      title: 'YouTube',
      icon: <Entypo name="youtube-with-circle" size={30} style={{ color: '#D2142B' }} />,
      onPress: () => {
        Linking.openURL('https://youtube.com/');
      },
    },
  ];

  render() {
    let headerHeight = 160;
    if (DEVICE.isIphoneX) {
      headerHeight += ScreenHelper.iphoneXExtendedHeight;
    }
    const { language } = this.props;
    return (
      <View style={flex.flex1}>
        <ScrollView style={[flex.flex1]}>
          <ImageBackground source={header} style={[{ height: headerHeight }]}>
            <Image source={avatar} style={styles.avatar} />
            <View style={styles.nameView}>
              <Text style={styles.name}>Jean Payene</Text>
              <TouchableOpacity style={styles.nameEditView}>
                <FontAwesome name="edit" size={25} style={styles.nameEdit} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <View style={[styles.body]}>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.sectionTitle]} text="Settings" />
              <FlatList
                data={this.settings}
                extraData={language}
                renderItem={({ item }) => <Item data={item} title={strings(item.title)} />}
                keyExtractor={() => `${Math.random()}`}
              />
            </View>
          </View>
          <View style={[styles.sectionContainer, { marginTop: 10 }]}>
            <Text style={styles.sectionTitle}>Join Community</Text>
            <FlatList
              data={this.joins}
              renderItem={({ item }) => <Item data={item} title={item.title} />}
              keyExtractor={() => `${Math.random()}`}
            />
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


MineIndex.propTypes = {
  language: PropTypes.string.isRequired,
};

Loc.defaultProps = {
  style: null,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

export default connect(mapStateToProps)(MineIndex);

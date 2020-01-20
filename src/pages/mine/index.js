import _ from 'lodash';
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
import RSKad from '../../components/common/rsk.ad';
import ResponsiveText from '../../components/common/misc/responsive.text';
import config from '../../../config';

const AVATAR_SIZE = 129;

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
  avatarView: {
    left: 20,
    bottom: -40,
    position: 'absolute',
    borderColor: '#ddd',
    borderBottomWidth: 0,
    borderRadius: AVATAR_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    right: 15,
    bottom: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.39,
    color: '#FFFFFF',
    width: '100%',
    paddingBottom: 6,
  },
  nameEditView: {
    marginLeft: 10,
    marginBottom: -5,
  },
  nameEdit: {
    color: '#FFFFFF',
  },
  communityIcon: {
    marginLeft: -5.5,
    width: 30,
    textAlign: 'center',
  },
  keyListView: {
    marginLeft: 10,
    marginBottom: 20,
  },
  keyListRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyListRowRight: {
    alignItems: 'center',
  },
  keyIcon: {
    color: '#4A4A4A', transform: [{ rotate: '90deg' }, { rotateX: '180deg' }],
  },
  keyTitle: {
    marginLeft: 10,
  },
  keyWallets: {
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    padding: 5,
    color: '#000',
    position: 'absolute',
    right: 0,
  },
  createWalletButtonView: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  createWalletButtonText: {
    color: '#00B520',
    fontSize: 16,
  },
  lastBlockMarginBottom: {
    marginBottom: 15,
  },
});

const header = require('../../assets/images/misc/header.png');
const avatar = require('../../assets/images/mine/avatar.png');

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


const ICON_SIZE = 20;

class MineIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static createKeyListData(wallets) {
    const listData = [];
    wallets.forEach((wallet) => {
      const item = {
        name: wallet.name,
        walletCount: wallet.coins.length,
        wallet,
      };
      listData.push(item);
    });
    return listData;
  }

  static renderKeyListView(listData, navigation) {
    if (_.isEmpty(listData)) {
      return null;
    }
    return (
      <FlatList
        style={styles.keyListView}
        data={listData}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.keyListRow}
            onPress={() => navigation.navigate('KeySettings', { key: item.wallet })}
          >
            <FontAwesome5 name="key" size={20} style={styles.keyIcon} />
            <View style={styles.right}>
              <Text>{item.name}</Text>
              <Text style={styles.keyWallets}>
                {`${item.walletCount} `}
                <Loc text="Wallets" />
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  settings = [
    {
      title: 'Language',
      icon: <MaterialIcons name="language" size={ICON_SIZE} style={{ color: '#4A4A4A' }} />,
      onPress: () => {
        const { navigation } = this.props;
        navigation.navigate('Language');
      },
    },
    {
      title: 'Currency',
      icon: (
        <MaterialCommunityIcons name="currency-usd" size={ICON_SIZE} style={{ color: '#4A4A4A' }} />
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
          size={ICON_SIZE}
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
      icon: <FontAwesome name="twitter" size={30} style={[styles.communityIcon, { color: '#039BE5' }]} />,
      onPress: () => {
        Linking.openURL('https://twitter.com/rsksmart');
      },
    },
    {
      title: 'Telegram',
      icon: <FontAwesome name="telegram" size={30} style={[styles.communityIcon, { color: '#3B9DD8' }]} />,
      onPress: () => {
        Linking.openURL('https://t.me/rskofficialcommunity');
      },
    },
    {
      title: 'Facebook',
      icon: <Entypo name="facebook-with-circle" size={30} style={[styles.communityIcon, { color: '#3F51B5' }]} />,
      onPress: () => {
        Linking.openURL('https://www.facebook.com/RSKsmart/');
      },
    },
    {
      title: 'Gitter',
      icon: <FontAwesome5 name="gitter" size={26} style={[styles.communityIcon]} />,
      onPress: () => {
        Linking.openURL('https://gitter.im/rsksmart');
      },
    },
    {
      title: 'Reddit',
      icon: <FontAwesome name="reddit" size={30} style={[styles.communityIcon, { color: '#FF4500' }]} />,
      onPress: () => {
        Linking.openURL('https://www.reddit.com/r/rootstock/');
      },
    },
    {
      title: 'YouTube',
      icon: <Entypo name="youtube-with-circle" size={30} style={[styles.communityIcon, { color: '#D2142B' }]} />,
      onPress: () => {
        Linking.openURL('https://www.youtube.com/rsksmart');
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      keyListData: [],
      settings: [],
      joins: [],
    };
    this.onEditNamePress = this.onEditNamePress.bind(this);
  }

  componentWillMount() {
    const { wallets } = this.props;
    const keyListData = MineIndex.createKeyListData(wallets);
    this.setState({
      keyListData,
      settings: this.settings,
      joins: this.joins,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { isWalletsUpdated, isWalletNameUpdated, wallets } = nextProps;
    if ((isWalletsUpdated || isWalletNameUpdated) && wallets) {
      const keyListData = MineIndex.createKeyListData(wallets);
      this.setState({ keyListData });
    }
  }

  onEditNamePress() {
    const { navigation } = this.props;
    navigation.navigate('Rename');
  }

  render() {
    let headerHeight = 160;
    if (DEVICE.isIphoneX) {
      headerHeight += ScreenHelper.iphoneXTopHeight;
    }
    const { language, navigation, username } = this.props;
    const { keyListData, settings, joins } = this.state;
    const { defaultSettings: { username: defaultUsername } } = config;
    // Translate If username is default user name
    const usernameText = username === defaultUsername ? strings(defaultUsername) : username;
    return (
      <View style={flex.flex1}>
        <ScrollView style={[flex.flex1]}>
          <ImageBackground source={header} style={[{ height: headerHeight }]}>
            <View style={styles.avatarView}><Image source={avatar} style={styles.avatar} /></View>
            <View style={styles.nameView}>
              <ResponsiveText
                style={[styles.name]}
                suffixElement={(
                  <TouchableOpacity style={styles.nameEditView} onPress={this.onEditNamePress}>
                    <FontAwesome name="edit" size={25} style={styles.nameEdit} />
                  </TouchableOpacity>
                )}
                suffixElementWidth={35}
              >
                {usernameText}
              </ResponsiveText>
            </View>
          </ImageBackground>
          <View style={[styles.body]}>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.sectionTitle]} text="Settings" />
              <FlatList
                data={settings}
                extraData={language}
                renderItem={({ item }) => <Item data={item} title={strings(item.title)} />}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
          <View style={[styles.sectionContainer, { marginTop: 10 }]}>
            <Loc style={[styles.sectionTitle]} text="Keys" />
            {MineIndex.renderKeyListView(keyListData, navigation)}
            <View style={styles.createWalletButtonView}>
              <TouchableOpacity onPress={() => navigation.navigate('WalletAddIndex')}>
                <Loc style={[styles.createWalletButtonText]} text="Create or Import a Key" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.sectionContainer, styles.lastBlockMarginBottom, { marginTop: 10 }]}>
            <Loc style={[styles.sectionTitle]} text="Join RSK's Community" />
            <FlatList
              data={joins}
              renderItem={({ item }) => <Item data={item} title={item.title} />}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>
        <RSKad />
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
  isWalletsUpdated: PropTypes.bool.isRequired,
  isWalletNameUpdated: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  wallets: PropTypes.arrayOf(PropTypes.object),
  username: PropTypes.string.isRequired,
};

MineIndex.defaultProps = {
  wallets: undefined,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  isWalletNameUpdated: state.Wallet.get('isWalletNameUpdated'),
  username: state.App.get('username'),
});

export default connect(mapStateToProps)(MineIndex);

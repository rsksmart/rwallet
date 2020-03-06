import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Loc from '../../components/common/misc/loc';
import { strings } from '../../common/i18n';
import RSKad from '../../components/common/rsk.ad';
import BasePageGereral from '../base/base.page.general';
import HeaderMineIndex from '../../components/headers/header.mineindex';
import presetStyles from '../../assets/styles/style';

const avatar = require('../../assets/images/mine/avatar.png');

const ICON_SIZE = 20;

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
    marginTop: 60,
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
  keyIcon: {
    color: '#4A4A4A', transform: [{ rotate: '90deg' }, { rotateX: '180deg' }],
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
    marginBottom: 173,
  },
});

function Item({ data, title, isHasBottomBorder }) {
  return (
    <TouchableOpacity style={[styles.row]} onPress={data.onPress}>
      {data.icon}
      <View style={[styles.right, isHasBottomBorder ? null : presetStyles.noBottomBorder]}>
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
  isHasBottomBorder: PropTypes.bool.isRequired,
};

Item.defaultProps = {
  data: { onPress: null },
};

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
                <Loc text="page.mine.index.wallets" />
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
      title: 'page.mine.language.title',
      icon: <MaterialIcons name="language" size={ICON_SIZE} style={{ color: '#4A4A4A' }} />,
      onPress: () => {
        const { navigation } = this.props;
        navigation.navigate('Language');
      },
    },
    {
      title: 'page.mine.currency.title',
      icon: (
        <MaterialCommunityIcons name="currency-usd" size={ICON_SIZE} style={{ color: '#4A4A4A' }} />
      ),
      onPress: () => {
        const { navigation } = this.props;
        navigation.navigate('Currency');
      },
    },
    {
      title: 'page.mine.2fa.title',
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
    const { language, navigation, username } = this.props;
    const { keyListData, settings, joins } = this.state;
    // Translate If username is default user name
    const usernameText = _.isEmpty(username) ? strings('page.mine.index.anonymousUser') : username;

    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        renderAccessory={() => <RSKad />}
        headerComponent={<HeaderMineIndex avatar={avatar} usernameText={usernameText} onEditNamePress={this.onEditNamePress} />}
      >
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle]} text="page.mine.index.settings" />
            <FlatList
              data={settings}
              extraData={language}
              renderItem={({ item, index }) => <Item data={item} title={strings(item.title)} isHasBottomBorder={index !== settings.length - 1} />}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={[styles.sectionContainer, { marginTop: 10 }]}>
            <Loc style={[styles.sectionTitle]} text="page.mine.index.keys" />
            {MineIndex.renderKeyListView(keyListData, navigation)}
            <View style={styles.createWalletButtonView}>
              <TouchableOpacity onPress={() => navigation.navigate('WalletAddIndex')}>
                <Loc style={[styles.createWalletButtonText]} text="page.mine.index.createKey" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.sectionContainer, styles.lastBlockMarginBottom, { marginTop: 10 }]}>
            <Loc style={[styles.sectionTitle]} text="page.mine.index.joinRSKCommunity" />
            <FlatList
              data={joins}
              renderItem={({ item, index }) => <Item data={item} title={item.title} isHasBottomBorder={index !== joins.length - 1} />}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </BasePageGereral>
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
  username: PropTypes.string,
};

MineIndex.defaultProps = {
  wallets: undefined,
  username: undefined,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  isWalletNameUpdated: state.Wallet.get('isWalletNameUpdated'),
  username: state.App.get('username'),
});

export default connect(mapStateToProps)(MineIndex);

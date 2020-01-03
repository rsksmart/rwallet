import React, { Component } from 'react';
import {
  View, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Text, FlatList, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import flex from '../../assets/styles/layout.flex';
import screenHelper from '../../common/screenHelper';
import Loc from '../../components/common/misc/loc';
import walletActions from '../../redux/wallet/actions';
import appActions from '../../redux/app/actions';
import createInfoConfirmation from '../../common/confirmation.controller';

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: screenHelper.headerHeight,
    marginTop: screenHelper.headerMarginTop,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '900',
    position: 'absolute',
    bottom: 65,
    left: 24,
    color: '#FFF',
  },
  headerText: {
    fontSize: 15,
    fontWeight: '900',
    position: 'absolute',
    bottom: 45,
    left: 24,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 9,
    bottom: 97,
  },
  chevron: {
    color: '#FFF',
  },
  sectionContainer: {
    paddingHorizontal: 30,
  },
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 17,
  },
  keyNameView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
    paddingVertical: 20,
  },
  keyNameLabel: {
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: '#000',
    position: 'absolute',
    right: 0,
  },
  keyName: {
    fontSize: 15,
  },
  keyTitle: {
    fontSize: 15,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
    paddingVertical: 10,
  },
  walletRowTitle: {
    marginLeft: 15,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
    paddingVertical: 20,
  },
  listRowTitle: {
    marginLeft: 5,
  },
  warningText: {
    color: '#DF5264',
    fontWeight: '500',
  },
});

const header = require('../../assets/images/misc/header.png');
const BTC = require('../../assets/images/icon/BTC.png');
const RBTC = require('../../assets/images/icon/RBTC.png');
const RIF = require('../../assets/images/icon/RIF.png');


const getIcon = (symbol) => {
  const icons = { BTC, RBTC, RIF };
  return icons[symbol];
};

const ListRow = ({ title, onPress }) => {
  const listRow = (
    <TouchableOpacity style={styles.listRow} onPress={onPress}>
      <Loc style={[styles.listRowTitle]} text={title} />
    </TouchableOpacity>
  );
  return listRow;
};

class KeySettings extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    static createWalletListData(coins) {
      const listData = [];
      coins.forEach((coin) => {
        const icon = getIcon(coin.symbol);
        const item = {
          icon,
          title: coin.id,
          onPress: () => {
            console.log('onPress, coin: ', coin);
          },
        };
        listData.push(item);
      });
      return listData;
    }

    static renderWalletList(listData) {
      return (
        <FlatList
          data={listData}
          extraData={listData}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.walletRow} onPress={item.onPress}>
              <Image source={item.icon} />
              <Text style={styles.walletRowTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    }

    static renderAdvancedList(listData) {
      return (
        <FlatList
          data={listData}
          extraData={listData}
          renderItem={({ item }) => (
            <ListRow title={item.title} onPress={item.onPress} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    }

    constructor(props) {
      super(props);
      this.state = {
        walletCount: 0,
        name: '',
        isConfirmDeleteKey: false,
      };
      this.onDeleteConfirm = this.onDeleteConfirm.bind(this);
    }

    componentWillMount() {
      const { navigation } = this.props;
      const { key } = navigation.state.params;
      const { coins, name } = key;
      const walletListData = KeySettings.createWalletListData(coins);
      this.key = key;
      this.setState({
        walletCount: coins.length,
        name,
        walletListData,
      });
      this.onBackupPress = this.onBackupPress.bind(this);
      this.onKeyNamePress = this.onKeyNamePress.bind(this);
      this.onDeletePress = this.onDeletePress.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      const {
        isWalletsUpdated, navigation, resetWalletsUpdated, isWalletNameUpdated,
      } = nextProps;
      const { key } = navigation.state.params;
      const { name, coins } = key;
      const { isConfirmDeleteKey } = this.state;

      // If isWalletsUpdated, wallet is deleted.
      if (isWalletsUpdated && resetWalletsUpdated) {
        const walletListData = KeySettings.createWalletListData(coins);
        this.setState({ walletListData });
        resetWalletsUpdated();
        if (isConfirmDeleteKey) {
          navigation.goBack();
        }
      }

      if (isWalletNameUpdated) {
        this.setState({ name });
      }
    }

    static renderBackButton(navigation) {
      const backButton = (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
        </TouchableOpacity>
      );
      return backButton;
    }

    onBackupPress() {
      const { navigation } = this.props;
      navigation.navigate('RecoveryPhrase', { wallet: this.key });
    }

    onKeyNamePress() {
      const { navigation } = this.props;
      navigation.navigate('KeyName', { key: this.key });
    }

    onDeleteConfirm() {
      const { deleteKey, walletManager } = this.props;
      deleteKey(this.key, walletManager);
      this.setState({ isConfirmDeleteKey: true });
      console.log('Delete, key: ', this.key);
    }

    onDeletePress() {
      const { addConfirmation } = this.props;
      const infoConfirmation = createInfoConfirmation(
        'Warning!',
        'Are you sure you want to delete all wallets using this key?',
        this.onDeleteConfirm,
      );
      addConfirmation(infoConfirmation);
    }

    render() {
      const { navigation } = this.props;
      const {
        walletCount, name, walletListData,
      } = this.state;
      return (
        <ScrollView style={[flex.flex1]}>
          <ImageBackground source={header} style={[styles.headerImage]}>
            <Loc style={[styles.headerTitle]} text="Key Settings" />
            <Text style={[styles.headerText]}>
              <Loc text="This key contains" />
              {` ${walletCount} `}
              <Loc text="wallets" />
            </Text>
            { KeySettings.renderBackButton(navigation) }
          </ImageBackground>
          <View style={screenHelper.styles.body}>
            <View style={[styles.sectionContainer, { marginTop: 10 }]}>
              <TouchableOpacity style={styles.keyNameView} onPress={this.onKeyNamePress}>
                <Loc style={[styles.keyTitle]} text="Key Name" />
                <View style={styles.keyNameLabel}><Text style={styles.keyName}>{name}</Text></View>
              </TouchableOpacity>
            </View>
            <View style={[styles.sectionContainer, { marginTop: 10 }]}>
              <Loc style={[styles.sectionTitle]} text="Wallets" />
              {KeySettings.renderWalletList(walletListData)}
            </View>
            <View style={[styles.sectionContainer, { marginTop: 10 }]}>
              <Loc style={[styles.sectionTitle]} text="Security" />
              <ListRow title="Backup" onPress={this.onBackupPress} />
            </View>
            <View style={[styles.sectionContainer, { marginTop: 10, marginBottom: 10 }]}>
              <Loc style={[styles.sectionTitle]} text="Advanced" />
              <TouchableOpacity style={styles.listRow} onPress={this.onDeletePress}>
                <Loc style={[styles.listRowTitle, styles.warningText]} text="Delete" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      );
    }
}

KeySettings.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({}),
  deleteKey: PropTypes.func.isRequired,
  isWalletsUpdated: PropTypes.bool.isRequired,
  addConfirmation: PropTypes.func.isRequired,
  confirmation: PropTypes.shape({}),
  resetWalletsUpdated: PropTypes.func.isRequired,
  isWalletNameUpdated: PropTypes.bool.isRequired,
};

KeySettings.defaultProps = {
  walletManager: undefined,
  confirmation: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  isWalletNameUpdated: state.Wallet.get('isWalletNameUpdated'),
  confirmation: state.App.get('confirmation'),
});

const mapDispatchToProps = (dispatch) => ({
  deleteKey: (key, walletManager) => dispatch(walletActions.deleteKey(key, walletManager)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(KeySettings);

import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, FlatList, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loc from '../../components/common/misc/loc';
import walletActions from '../../redux/wallet/actions';
import appActions from '../../redux/app/actions';
import { createInfoConfirmation } from '../../common/confirmation.controller';
import KeysettingsHeader from '../../components/headers/header.keysettings';
import BasePageGereral from '../base/base.page.general';
import common from '../../common/common';
import screenHelper from '../../common/screenHelper';
import color from '../../assets/styles/color.ts';

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 30,
    marginTop: 30,
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
    color: color.warningText,
    fontWeight: '500',
  },
  advancedBlock: {
    marginBottom: 60 + screenHelper.bottomHeight,
  },
});

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
        const coinType = common.getSymbolName(coin.symbol, coin.type);
        const item = { icon: coin.icon, title: coinType };
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
            <View style={styles.walletRow}>
              <Image source={item.icon} />
              <Text style={styles.walletRowTitle}>{item.title}</Text>
            </View>
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
      this.onBackupPress = this.onBackupPress.bind(this);
      this.onKeyNamePress = this.onKeyNamePress.bind(this);
      this.onDeletePress = this.onDeletePress.bind(this);
      this.deleteKey = this.deleteKey.bind(this);
      this.backup = this.backup.bind(this);
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

    onBackupPress() {
      const { callAuthVerify } = this.props;
      callAuthVerify(this.backup, () => {});
    }

    onKeyNamePress() {
      const { navigation } = this.props;
      navigation.navigate('KeyName', { key: this.key });
    }

    onDeleteConfirm() {
      const { callAuthVerify } = this.props;
      callAuthVerify(this.deleteKey, () => {});
    }

    onDeletePress() {
      const { addConfirmation } = this.props;
      const infoConfirmation = createInfoConfirmation(
        'modal.deleteKey.title',
        'modal.deleteKey.body',
        () => this.onDeleteConfirm(),
      );
      addConfirmation(infoConfirmation);
    }

    backup() {
      const { navigation } = this.props;
      // Backup flow will skip phrase and wallet creation.
      navigation.navigate('RecoveryPhrase', { phrase: this.key.mnemonic, shouldCreatePhrase: false, shouldVerifyPhrase: false });
    }

    deleteKey() {
      const { deleteKey, walletManager } = this.props;
      deleteKey(this.key, walletManager);
      this.setState({ isConfirmDeleteKey: true });
    }

    render() {
      const { navigation } = this.props;
      const {
        walletCount, name, walletListData,
      } = this.state;
      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={<KeysettingsHeader title="page.mine.keySettings.title" walletCount={walletCount} onBackButtonPress={() => navigation.goBack()} />}
        >
          <View style={styles.sectionContainer}>
            <TouchableOpacity style={styles.keyNameView} onPress={this.onKeyNamePress}>
              <Loc style={[styles.keyTitle]} text="page.mine.keySettings.keyName" />
              <View style={styles.keyNameLabel}><Text style={styles.keyName}>{name}</Text></View>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle]} text="page.mine.keySettings.Wallets" />
            {KeySettings.renderWalletList(walletListData)}
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.sectionTitle]} text="page.mine.keySettings.security" />
            <ListRow title="page.mine.keySettings.backup" onPress={this.onBackupPress} />
          </View>
          <View style={[styles.sectionContainer, styles.advancedBlock]}>
            <Loc style={[styles.sectionTitle]} text="page.mine.keySettings.advanced" />
            <TouchableOpacity style={styles.listRow} onPress={this.onDeletePress}>
              <Loc style={[styles.listRowTitle, styles.warningText]} text="page.mine.keySettings.delete" />
            </TouchableOpacity>
          </View>
        </BasePageGereral>
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
  callAuthVerify: PropTypes.func.isRequired,
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
  passcode: state.App.get('passcode'),
});

const mapDispatchToProps = (dispatch) => ({
  deleteKey: (key, walletManager) => dispatch(walletActions.deleteKey(key, walletManager)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  callAuthVerify: (callback, fallback) => dispatch(appActions.callAuthVerify(callback, fallback)),
  showPasscode: (category, callback, fallback) => dispatch(
    appActions.showPasscode(category, callback, fallback),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(KeySettings);

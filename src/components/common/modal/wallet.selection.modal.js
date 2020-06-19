import React, { PureComponent } from 'react';

import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import color from '../../../assets/styles/color.ts';
import appActions from '../../../redux/app/actions';
import Loc from '../misc/loc';

const tokenRowWidth = (Dimensions.get('window').width * 0.87 - 90);
const tokenItemWidth = (tokenRowWidth - 30) / 2;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: 'rgba(8, 9, 18, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 6,
    width: '87%',
  },
  title: {
    marginTop: 36,
    marginBottom: 36,
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Avenir-Heavy',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#DDDDDD',
  },
  flatlist: {
    marginHorizontal: 15,
    padding: 15,
    paddingTop: 0,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noWalletText: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
  },
  wallets: {
    height: 100,
  },
  btnView: {
    width: '80%',
    height: 44,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.app.theme,
    borderRadius: 27,
    marginTop: 10,
  },
  btnFont: {
    color: 'white',
    fontFamily: 'Avenir-Heavy',
    fontWeight: 'bold',
    fontSize: 16,
  },
  walletItem: {
    marginTop: 15,
  },
  selection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  circle: {
    width: 13,
    height: 13,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBC6C6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  isSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.app.theme,
  },
  tokenRow: {
    flexDirection: 'row',
    width: tokenRowWidth,
  },
  tokenItem: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    width: tokenItemWidth,
    justifyContent: 'space-between',
  },
  mainnet: {
    backgroundColor: '#028CFF',
    borderRadius: 4,
  },
  testnet: {
    backgroundColor: '#9B9B9B',
    borderRadius: 4,
  },
  network: {
    fontFamily: 'Avenir-Book',
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  address: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 16,
    fontFamily: 'Avenir-Book',
    fontWeight: 'bold',
  },
  tokenText: {
    fontFamily: 'Avenir-Roman',
    color: '#4A4A4A',
    fontSize: 10,
  },
});

class WalletSelection extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedWallet: null,
      supportWallets: [],
    };
  }

  componentDidMount() {
    this.initWallets();
  }

  componentWillReceiveProps(nextProps) {
    const { dapp } = nextProps;
    if (dapp) {
      this.initWallets(dapp);
    }
  }

  initWallets = (dapp = null) => {
    const supportWallets = this.getSupportWallets(dapp);
    if (supportWallets.length) {
      this.setState({ selectedWallet: supportWallets[0], supportWallets });
    }
  }

  createBtnPress = () => {
    const { navigation, closeFunction } = this.props;
    closeFunction();
    setTimeout(() => {
      navigation.navigate('WalletAddIndex');
    }, 500);
  }

  confirmBtnPress = () => {
    const {
      closeFunction, dapp, addRecentDapp,
    } = this.props;
    const { selectedWallet } = this.state;
    addRecentDapp(dapp);
    closeFunction();
    setTimeout(() => {
      this.openBrowser(selectedWallet, dapp);
    }, 500);
  }

  openBrowser = (selectedWallet, dapp) => {
    const { navigation } = this.props;
    navigation.navigate('DAppBrowser', { wallet: selectedWallet, dapp });
  }

  ellipsisAddress = (address) => {
    const { length } = address;
    if (length > 14) {
      return `${address.slice(0, 8)}....${address.slice(length - 6, length)}`;
    }
    return address;
  }

  getWalletInfo = (wallet) => ({ address: wallet.coins[0].address, network: wallet.coins[0].type })

  getTokenView = (tokens) => {
    const result = [];
    let row = [];
    _.forEach(tokens, (token, index) => {
      const canModTwo = !((index + 1) % 2);
      row.push(
        <View style={styles.tokenItem}>
          <Text style={styles.tokenText}>{token.symbol}</Text>
          <Text style={styles.tokenText}>{(token.balance && token.balance.toString()) || 0}</Text>
        </View>,
      );
      if (canModTwo) {
        result.push(
          <View style={styles.tokenRow}>
            {row}
          </View>,
        );
        row = [];
      }
    });
    if (row.length) {
      result.push(
        <View style={styles.tokenRow}>
          {row}
        </View>,
      );
      row = [];
    }
    return result;
  }

  getWalletItem = ({ item }) => {
    const { dapp } = this.props;
    const { selectedWallet } = this.state;
    const tokens = (dapp && dapp.tokens) || [];
    const { address: selectedAddress } = this.getWalletInfo(selectedWallet);
    const { address, network } = this.getWalletInfo(item);
    return (
      <TouchableOpacity activeOpacity={1} style={styles.walletItem} onPress={() => { this.setState({ selectedWallet: item }); }}>
        <View style={styles.selection}>
          <View style={[{ padding: 5 }, network === 'Mainnet' ? styles.mainnet : styles.testnet]}>
            <Text style={styles.network}>{network}</Text>
          </View>
          <Text style={styles.address}>{this.ellipsisAddress(address)}</Text>
          <View style={styles.circle}>
            <View style={selectedAddress === address ? styles.isSelected : {}} />
          </View>
        </View>

        <View style={{ alignSelf: 'center' }}>
          {selectedAddress === address && this.getTokenView(selectedWallet.coins, tokens)}
        </View>
      </TouchableOpacity>
    );
  }

  getSupportWallets = (dapp) => {
    const supportTokens = (dapp && dapp.tokens) || [];
    const { walletManager } = this.props;
    const { wallets } = walletManager;
    const supportWallets = [];
    _.forEach(wallets, (wallet) => {
      const { coins } = wallet;
      const rskTokens = _.filter(coins, (coin) => coin.symbol !== 'BTC');
      const tokens = supportTokens.length ? _.filter(rskTokens, (coin) => supportTokens.includes(coin.symbol)) : rskTokens;
      if (tokens.length) {
        supportWallets.push({
          ...wallet,
          coins: tokens,
        });
      }
    });

    return supportWallets;
  }

  render() {
    const {
      visible, closeFunction, confirmButtonPress: propConfirmButtonPress,
    } = this.props;
    const { selectedWallet, supportWallets } = this.state;
    const title = supportWallets.length ? 'modal.walletSelection.title' : 'modal.noWalletAvailable.title';
    const confirmButtonPress = supportWallets.length ? this.confirmBtnPress : this.createBtnPress;
    const confirmButtonText = supportWallets.length ? 'page.dapp.button.confirm' : 'page.dapp.button.createOrImport';
    return (
      <Modal
        animationType="none"
        transparent
        visible={visible}
      >
        <View style={styles.backgroundView}>
          <View style={styles.modalView}>
            <Loc style={styles.title} text={title} />

            <View style={styles.line} />
            <View style={styles.flatlist}>
              {
                supportWallets.length ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    data={supportWallets}
                    extraData={this.state}
                    renderItem={this.getWalletItem}
                    keyExtractor={(item, index) => `list-${index}`}
                  />
                ) : <Loc style={styles.noWalletText} text="modal.noWalletAvailable.body" />
              }
            </View>
            <View style={styles.line} />

            <TouchableOpacity
              style={[styles.btnView, { backgroundColor: color.app.theme, marginTop: 30 }]}
              onPress={() => {
                if (propConfirmButtonPress) {
                  propConfirmButtonPress(selectedWallet);
                } else {
                  confirmButtonPress();
                }
              }}
            >
              <Loc style={[styles.btnFont, { color: 'white' }]} text={confirmButtonText} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnView, { backgroundColor: 'rgba(0, 0, 0, 0)' }]} onPress={closeFunction}>
              <Loc style={[styles.btnFont, { color: '#B1B1B1' }]} text="page.dapp.button.cancel" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

WalletSelection.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  visible: PropTypes.bool,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }).isRequired,
  closeFunction: PropTypes.func,
  dapp: PropTypes.shape({
    name: PropTypes.shape({
      en: PropTypes.string.isRequired,
      zh: PropTypes.string.isRequired,
      es: PropTypes.string.isRequired,
      pt: PropTypes.string.isRequired,
    }).isRequired,
    url: PropTypes.string.isRequired,
    tokens: PropTypes.arrayOf(PropTypes.string),
  }),
  addRecentDapp: PropTypes.func,
  confirmButtonPress: PropTypes.func,
};

WalletSelection.defaultProps = {
  visible: false,
  dapp: {
    name: null,
    url: null,
    tokens: null,
  },
  closeFunction: () => null,
  addRecentDapp: () => null,
  confirmButtonPress: null,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  addRecentDapp: (dapp) => dispatch(appActions.addRecentDapp(dapp)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelection);

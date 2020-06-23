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
    borderRadius: 12,
    width: '87%',
  },
  title: {
    marginTop: 36,
    marginBottom: 36,
    alignSelf: 'center',
    fontSize: 17,
    fontFamily: 'Avenir-Heavy',
    color: 'black',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#DDDDDD',
  },
  flatlist: {
    marginHorizontal: 15,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noWalletText: {
    fontFamily: 'Avenir-Book',
    fontSize: 16,
    color: 'black',
  },
  confirmBtnView: {
    width: '80%',
    height: 44,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.app.theme,
    borderRadius: 27,
    marginTop: 10,
  },
  confirmBtnFont: {
    color: '#F3F3F3',
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
  },
  cancelBtnView: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  cancelBtnFont: {
    color: '#B1B1B1',
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
  },
  separator: {
    height: 15,
    width: '100%',
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
        <View style={styles.tokenItem} key={`${token.address}-${token.symbol}`}>
          <Text style={styles.tokenText}>{token.symbol}</Text>
          <Text style={styles.tokenText}>{Number((token.balance && token.balance.toString())).toFixed(4) || 0}</Text>
        </View>,
      );
      if (canModTwo) {
        result.push(
          <View style={styles.tokenRow} key={`${token.address}-row-${index}`}>
            {row}
          </View>,
        );
        row = [];
      }
    });
    if (row.length) {
      result.push(
        <View style={styles.tokenRow} key={`${tokens[row.length]}-row-${row.length}`}>
          {row}
        </View>,
      );
      row = [];
    }
    return result;
  }

  getWalletItem = ({ item }) => {
    const { selectedWallet } = this.state;
    const { address: selectedAddress } = this.getWalletInfo(selectedWallet);
    const { address, network } = this.getWalletInfo(item);
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ selectedWallet: item }); }}>
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
          {selectedAddress === address && this.getTokenView(selectedWallet.coins)}
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
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
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
              style={[styles.confirmBtnView, { backgroundColor: color.app.theme, marginTop: 30 }]}
              onPress={() => {
                if (propConfirmButtonPress) {
                  propConfirmButtonPress(selectedWallet);
                } else {
                  confirmButtonPress();
                }
              }}
            >
              <Loc style={[styles.confirmBtnFont]} text={confirmButtonText} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtnView} onPress={closeFunction}>
              <Loc style={[styles.cancelBtnFont]} text="page.dapp.button.cancel" />
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

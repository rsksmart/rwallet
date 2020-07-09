import React, { PureComponent } from 'react';

import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import color from '../../../assets/styles/color.ts';
import appActions from '../../../redux/app/actions';
import Loc from '../misc/loc';
import CONSTANTS from '../../../common/constants.json';
import common from '../../../common/common';

// Get modal view width
const MODAL_WIDTH = Dimensions.get('window').width * 0.87;
// Get row's width, 90 is FlatList's padding and margin size
const TOKEN_ROW_WIDTH = (MODAL_WIDTH - 90);
// One row has two tokens, 50 is token's separate size
const TOKEN_ITEM_WIDTH = (TOKEN_ROW_WIDTH - 50) / 2;

const { EVENT: { TOKENS_UPDATE } } = CONSTANTS;

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
    width: MODAL_WIDTH,
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
    marginTop: 30,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
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
    width: TOKEN_ROW_WIDTH,
    justifyContent: 'space-between',
  },
  tokenItem: {
    flexDirection: 'row',
    marginTop: 10,
    width: TOKEN_ITEM_WIDTH,
    justifyContent: 'space-between',
  },
  mainnet: {
    backgroundColor: 'rgba(2, 140, 255, 0.65)',
    borderRadius: 4,
    padding: 5,
    width: 49,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testnet: {
    backgroundColor: color.component.listItemIndicator.color,
    borderRadius: 4,
    padding: 5,
    width: 49,
    alignItems: 'center',
    justifyContent: 'center',
  },
  network: {
    fontFamily: 'Avenir-Book',
    fontSize: 10,
    color: 'white',
  },
  address: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 16,
    fontFamily: 'Avenir-Book',
    marginLeft: 11,
  },
  tokenText: {
    fontFamily: 'Avenir-Roman',
    color: color.component.word,
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

    this.listener = DeviceEventEmitter.addListener(TOKENS_UPDATE, (isTokensUpdated) => {
      if (isTokensUpdated) {
        const { dapp } = this.props;
        this.initWallets(dapp);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dapp } = nextProps;
    if (dapp) {
      this.initWallets(dapp);
    }
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  initWallets = (dapp = null) => {
    const supportWallets = this.getSupportWallets(dapp);
    if (!_.isEmpty(supportWallets)) {
      this.setState({ selectedWallet: supportWallets[0] });
    }
    this.setState({ supportWallets });
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
    }, 300);
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

  getTokenView = (tokens) => {
    const result = [];
    let row = [];
    _.forEach(tokens, (token, index) => {
      const canModTwo = !((index + 1) % 2);
      const tokenBalance = token.balance ? common.getBalanceString(token.balance, token.symbol) : '0';
      row.push(
        <View style={styles.tokenItem} key={`${token.objectId}-${token.symbol}`}>
          <Text style={styles.tokenText}>{token.symbol}</Text>
          <Text style={styles.tokenText}>{tokenBalance}</Text>
        </View>,
      );
      if (canModTwo) {
        result.push(
          <View style={styles.tokenRow} key={`${token.objectId}-row-${index}`}>
            {row}
          </View>,
        );
        row = [];
      }
    });
    if (!_.isEmpty(row)) {
      result.push(
        <View style={styles.tokenRow} key={`${tokens[result.length].objectId}-row-${row.length}`}>
          {row}
        </View>,
      );
      row = [];
    }
    return result;
  }

  getWalletItem = ({ item }) => {
    const { selectedWallet } = this.state;
    const { address: selectedAddress } = selectedWallet;
    const { address, network } = item;
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ selectedWallet: item }); }}>
        <View style={styles.selection}>
          <View style={styles.row}>
            <View style={[network === 'Mainnet' ? styles.mainnet : styles.testnet]}>
              <Text style={styles.network}>{network}</Text>
            </View>
            <Text style={styles.address}>{this.ellipsisAddress(address)}</Text>
          </View>
          <View style={styles.circle}>
            <View style={selectedAddress === address ? styles.isSelected : {}} />
          </View>
        </View>

        <View style={{ width: '100%' }}>
          {selectedAddress === address && this.getTokenView(selectedWallet.coins)}
        </View>
      </TouchableOpacity>
    );
  }

  // Get the wallet which wallet's coins in Dapp's support token list
  getSupportWallets = (dapp) => {
    if (dapp) {
      const supportTokens = dapp.tokens || [];
      const { walletManager } = this.props;
      const { wallets } = walletManager;
      const supportWallets = [];
      let { networks } = dapp;
      if (_.isEmpty(networks)) {
        networks = ['Mainnet', 'Testnet'];
      }
      _.forEach(networks, (network) => {
        _.forEach(wallets, (wallet) => {
          const { coins } = wallet;

          // Get all rsk tokens
          const rskTokens = _.filter(coins, (coin) => coin.symbol !== 'BTC' && coin.type === network);
          // If dapp support token list is empty, needs to show all rsk tokens
          const tokens = _.isEmpty(supportTokens) ? rskTokens : _.filter(rskTokens, (coin) => supportTokens.includes(coin.symbol));
          if (!_.isEmpty(tokens)) {
            supportWallets.push({
              ...wallet,
              coins: tokens,
              address: tokens[0].address,
              network,
            });
          }
        });
      });

      return supportWallets;
    }
    return [];
  }

  render() {
    const {
      visible, closeFunction, confirmButtonPress: propConfirmButtonPress,
    } = this.props;
    const { selectedWallet, supportWallets } = this.state;
    const title = _.isEmpty(supportWallets) ? 'modal.noWalletAvailable.title' : 'modal.walletSelection.title';
    const confirmButtonPress = _.isEmpty(supportWallets) ? this.createBtnPress : this.confirmBtnPress;
    const confirmButtonText = _.isEmpty(supportWallets) ? 'page.dapp.button.createOrImport' : 'page.dapp.button.confirm';
    return (
      <Modal
        animationType="fade"
        transparent
        visible={visible}
      >
        <View style={styles.backgroundView}>
          <View style={styles.modalView}>
            <Loc style={styles.title} text={title} />

            <View style={styles.line} />
            <View style={styles.flatlist}>
              {
                _.isEmpty(supportWallets)
                  ? <Loc style={styles.noWalletText} text="modal.noWalletAvailable.body" />
                  : (
                    <FlatList
                      ItemSeparatorComponent={() => <View style={styles.separator} />}
                      showsVerticalScrollIndicator={false}
                      bounces={false}
                      data={supportWallets}
                      extraData={this.state}
                      renderItem={this.getWalletItem}
                      keyExtractor={(item, index) => `list-${index}`}
                    />
                  )
              }
            </View>
            <View style={styles.line} />

            <TouchableOpacity
              style={styles.confirmBtnView}
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

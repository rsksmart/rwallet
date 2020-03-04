import React, { Component } from 'react';
import {
  StyleSheet, FlatList, TouchableOpacity, Text, Image, View, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import BasePageGereral from '../../base/base.page.general';
import Header from '../../../components/headers/header';
import common from '../../../common/common';
import coinListItemStyles from '../../../assets/styles/coin.listitem.styles';
import presetStyles from '../../../assets/styles/style';
import walletActions from '../../../redux/wallet/actions';
import Loc from '../../../components/common/misc/loc';
// import CoinswitchHelper from '../../../common/coinswitch.helper';
import config from '../../../../config';

const styles = StyleSheet.create({
  body: {
    marginHorizontal: 18,
    marginTop: -20,
  },
  board: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  walletName: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Avenir-Heavy',
    letterSpacing: 0.27,
    marginTop: 10,
    marginBottom: 7,
  },
  coinName: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Avenir-Roman',
    letterSpacing: 0.4,
    flex: 1,
  },
  rowRightView: {
    paddingTop: 0,
    paddingBottom: 0,
    height: 50,
  },
  icon: {
    marginLeft: -7,
    marginRight: 10,
  },
  row: {
    marginBottom: 5,
  },
  indicatorView: {
    width: 30,
    justifyContent: 'center',
  },
  listItemIndicator: {
    color: '#D5D5D5',
    marginLeft: -3,
  },
  rowTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    fontFamily: 'Avenir-Roman',
    fontSize: 12,
    color: '#77869E',
    letterSpacing: 1,
  },
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    letterSpacing: 0.39,
  },
  noCoinInfoText: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  noCoinInfoContainer: {
    paddingLeft: 5,
  },
});

class SwapSelection extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      contentComponent: null,
    };
  }

  async componentDidMount() {
    const { navigation, resetSwap } = this.props;
    this.initSelectData(navigation, resetSwap);
    this.willFocusSubscription = navigation.addListener(
      'willFocus',
      () => {
        this.initSelectData(navigation, resetSwap);
      },
    );
  }

  componentWillUnmount(): void {
    this.willFocusSubscription.remove();
  }

  initSelectData = (navigation, resetSwap) => {
    this.setState({ loading: true });
    if (!navigation.state.params) {
      resetSwap();
    }
    setTimeout(() => {
      this.updateSelectionInfo();
      this.setState({ loading: false });
    }, 0);
  };

  updateSelectionInfo = () => {
    let contentComponent;
    const {
      navigation, walletManager,
    } = this.props;
    const { wallets } = walletManager;
    const { selectionType } = navigation.state.params || { selectionType: 'source' };
    // let rawList;
    // let filters = [];
    // if (selectionType === 'source' && swapDest) {
    //   try {
    //     rawList = await CoinswitchHelper.getPairs(null, swapDest.coin.symbol.toLowerCase());
    //   } catch {
    //     rawList = [];
    //   }
    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < rawList.length; i += 1) {
    //     const item = rawList[i];
    //     if (item.isActive) {
    //       filters.push(item.depositCoin);
    //     }
    //   }
    // } else if (selectionType === 'dest') {
    //   try {
    //     rawList = await CoinswitchHelper.getPairs(swapSource.coin.symbol.toLowerCase(), null);
    //   } catch {
    //     rawList = [];
    //   }
    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < rawList.length; i += 1) {
    //     const item = rawList[i];
    //     if (item.isActive) {
    //       filters.push(item.destinationCoin);
    //     }
    //   }
    // } else {
    //   filters = null;
    // }

    const coinList = this.createListData(wallets, navigation, selectionType, null);
    if (coinList.length) {
      contentComponent = (
        <FlatList
          data={coinList}
          renderItem={({ item }) => (
            <View style={[presetStyles.board, styles.board, coinListItemStyles.itemView]}>
              <Text style={[styles.walletName]}>{item.name}</Text>
              {this.renderWalletList(item.coins)}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    } else {
      contentComponent = (
        <View style={[styles.noCoinInfoContainer]}>
          <Loc text="page.wallet.swapSelection.please" style={[styles.noCoinInfoText]} />
          <View style={[{ flexDirection: 'row' }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Loc text="page.wallet.swapSelection.create" style={[styles.noCoinInfoText, styles.underlineText]} />
            </TouchableOpacity>
            <Loc text="page.wallet.swapSelection.or" style={[styles.noCoinInfoText]} suffix="&space&" prefix="&space&" />
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Loc text="page.wallet.swapSelection.import" style={[styles.noCoinInfoText, styles.underlineText]} />
            </TouchableOpacity>
            <Loc text="page.wallet.swapSelection.aWallet" style={[styles.noCoinInfoText]} prefix="&space&" />
          </View>
          <Loc text="page.wallet.swapSelection.startSwap" style={[styles.noCoinInfoText]} />
        </View>
      );
    }
    this.setState({ contentComponent });
  };

  renderWalletList = (listData) => (
    <FlatList
      data={listData}
      extraData={listData}
      renderItem={({ item, index }) => {
        const isLastRow = index === listData.length - 1;
        return (
          <TouchableOpacity style={[coinListItemStyles.row, styles.row]} onPress={() => item.onPress()}>
            <Image style={styles.icon} source={item.icon} />
            <View style={[coinListItemStyles.rowRightView, styles.rowRightView, isLastRow ? presetStyles.noBottomBorder : {}]}>
              <View style={[coinListItemStyles.rowTitleView, styles.rowTitleView]}>
                <Text style={styles.coinName}>{item.title}</Text>
                <Text style={styles.balance}>{item.amount}</Text>
              </View>
              <View style={styles.indicatorView}>
                <EvilIcons name="chevron-right" size={37} style={[presetStyles.listItemIndicator, styles.listItemIndicator]} />
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  createListData = (wallets, navigation, selectionType, filters) => {
    const {
      setSwapSource, setSwapDest, swapSource, swapDest, switchSwap, resetSwap,
    } = this.props;

    const { init } = navigation.state.params || { init: true };

    if (!_.isArray(wallets)) {
      return [];
    }

    const listData = [];
    // Create element for each wallet (e.g. key 0)
    wallets.forEach((wallet) => {
      const wal = { name: wallet.name, coins: [] };
      // Create element for each Token (e.g. BTC, RBTC, RIF)
      wallet.coins.forEach((coin) => {
        if (coin.type !== 'Mainnet') {
          return;
        }
        if (!config.coinswitch.initPairs[coin.id]) {
          return;
        }
        if (selectionType === 'dest' && (coin.id === swapSource.coin.id || !config.coinswitch.initPairs[swapSource.coin.id].includes(coin.id))) {
          return;
        }
        if (filters && (filters.length === 0 || !filters.includes(coin.id.toLowerCase()))) {
          return;
        }
        const coinType = common.getSymbolFullName(coin.id, coin.type);
        const amountText = coin.balance ? common.getBalanceString(coin.id, coin.balance) : '';
        const item = {
          title: coinType,
          amount: amountText,
          icon: coin.icon,
          onPress: () => {
            if (swapSource && swapDest
              && ((selectionType === 'source' && coin.id === swapSource.coin.id && wallet.name === swapSource.walletName)
                || (selectionType === 'dest' && coin.id === swapDest.coin.id && wallet.name === swapDest.walletName))
            ) {
              navigation[navigation.state.params && init ? 'replace' : 'navigate']('Swap', {
                type: selectionType,
                coin,
                init,
                noUpdate: true,
              });
            } else {
              if (selectionType === 'source') {
                if (swapDest && wallet.name === swapDest.walletName && coin.id === swapDest.coin.id) {
                  switchSwap();
                } else if (swapDest && !config.coinswitch.initPairs[coin.id].includes(swapDest.coin.id)) {
                  setSwapSource(wallet.name, coin);
                  resetSwap();
                } else {
                  setSwapSource(wallet.name, coin);
                }
                if (init) {
                  const targetArray = config.coinswitch.initPairs[coin.id];
                  for (let i = 0; i < wallets.length; i += 1) {
                    const candidate = wallets[i].coins.find((walletCoin) => targetArray.includes(walletCoin.id));
                    if (candidate) {
                      setSwapDest(wallets[i].name, candidate);
                      break;
                    }
                  }
                }
              } else {
                setSwapDest(wallet.name, coin);
              }
              navigation[navigation.state.params && init ? 'replace' : 'navigate']('Swap', { type: selectionType, coin, init });
            }
          },
        };
        wal.coins.push(item);
      });
      if (wal && wal.coins.length) {
        listData.push(wal);
      }
    });
    return listData;
  };

  render() {
    const {
      navigation, bottomPaddingComponent, headless,
    } = this.props;
    const { loading, contentComponent } = this.state;

    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn={false}
        hasLoader={false}
        bgColor="#00B520"
        headerComponent={headless ? (
          <Header
            title="page.wallet.swapSelection.title"
          />
        ) : (
          <Header
            onBackButtonPress={() => navigation.goBack()}
            title="page.wallet.swapSelection.title"
          />
        )}
      >
        <View style={[styles.body, headless ? { marginTop: -95 } : {}]}>
          {contentComponent}
        </View>
        {bottomPaddingComponent}
        {loading && <ActivityIndicator size="large" />}
      </BasePageGereral>
    );
  }
}

SwapSelection.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }),
  swapSource: PropTypes.shape({
    walletName: PropTypes.string.isRequired,
    coin: PropTypes.object.isRequired,
  }),
  swapDest: PropTypes.shape({
    walletName: PropTypes.string.isRequired,
    coin: PropTypes.object.isRequired,
  }),
  setSwapSource: PropTypes.func.isRequired,
  setSwapDest: PropTypes.func.isRequired,
  resetSwap: PropTypes.func.isRequired,
  switchSwap: PropTypes.func.isRequired,
  headless: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  bottomPaddingComponent: PropTypes.object,
};

SwapSelection.defaultProps = {
  walletManager: undefined,
  swapSource: undefined,
  swapDest: undefined,
  bottomPaddingComponent: undefined,
  headless: false,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  swapSource: state.Wallet.get('swapSource'),
  swapDest: state.Wallet.get('swapDest'),
});

const mapDispatchToProps = (dispatch) => ({
  setSwapSource: (walletName, coin) => dispatch(walletActions.setSwapSource(walletName, coin)),
  setSwapDest: (walletName, coin) => dispatch(walletActions.setSwapDest(walletName, coin)),
  resetSwap: () => dispatch(walletActions.resetSwapDest()),
  switchSwap: () => dispatch(walletActions.switchSwap()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwapSelection);

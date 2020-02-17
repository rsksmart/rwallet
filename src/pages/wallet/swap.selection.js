import React, { Component } from 'react';
import {
  StyleSheet, FlatList, TouchableOpacity, Text, Image, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import common from '../../common/common';
import coinListItemStyles from '../../assets/styles/coin.listitem.styles';
import presetStyles from '../../assets/styles/style';
import walletActions from '../../redux/wallet/actions';
import Loc from '../../components/common/misc/loc';

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
  noBorder: {
    borderBottomColor: 'rgba(0,0,0,0)',
  },
  headerTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    letterSpacing: 0.39,
  },
});

class SwapSelection extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static renderWalletList(listData) {
    return (
      <FlatList
        data={listData}
        extraData={listData}
        renderItem={({ item, index }) => {
          const isLastRow = index === listData.length - 1;
          return (
            <TouchableOpacity style={[coinListItemStyles.row, styles.row]} onPress={() => item.onPress()}>
              <Image style={styles.icon} source={item.icon} />
              <View style={[coinListItemStyles.rowRightView, styles.rowRightView, isLastRow ? styles.noBorder : {}]}>
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
  }

  createListData = (wallets, navigation, selectionType) => {
    const {
      setSwapSource, setSwapDest, swapSource, swapDest,
    } = this.props;

    if (!_.isArray(wallets)) {
      return [];
    }

    const listData = [];
    // Create element for each wallet (e.g. key 0)
    wallets.forEach((wallet) => {
      const wal = { name: wallet.name, coins: [] };
      // Create element for each Token (e.g. BTC, RBTC, RIF)
      wallet.coins.forEach((coin) => {
        if (selectionType === 'dest' && coin.symbol === swapSource.coin.symbol) {
          return;
        }
        if (selectionType === 'source' && swapDest && coin.symbol === swapDest.coin.symbol) {
          return;
        }
        const coinType = common.getSymbolFullName(coin.symbol, coin.type);
        const amountText = coin.balance ? common.getBalanceString(coin.symbol, coin.balance) : '';
        const item = {
          title: coinType,
          amount: amountText,
          icon: coin.icon,
          onPress: () => {
            if (selectionType === 'source') {
              setSwapSource(wallet.name, coin);
            } else {
              setSwapDest(wallet.name, coin);
            }
            navigation.navigate('Swap', { type: selectionType, coin });
          },
        };
        wal.coins.push(item);
      });
      listData.push(wal);
    });
    return listData;
  };

  render() {
    const { navigation, walletManager, resetSwap } = this.props;
    const { selectionType } = navigation.state.params;
    const { wallets } = walletManager;
    const rightButton = (
      <View style={[{ position: 'absolute', right: 20, bottom: 108 }]}>
        <TouchableOpacity onPress={() => {
          resetSwap();
          navigation.navigate('Swap', { reset: true });
        }}
        >
          <Loc style={styles.headerTitle} text="Reset" />
        </TouchableOpacity>
      </View>
    );

    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn={false}
        hasLoader={false}
        bgColor="#00B520"
        headerComponent={(
          <Header
            onBackButtonPress={() => navigation.goBack()}
            title="page.wallet.swapSelection.title"
            rightBtn={() => rightButton}
          />
        )}
      >
        <View style={styles.body}>
          <FlatList
            data={this.createListData(wallets, navigation, selectionType)}
            renderItem={({ item }) => (
              <View style={[presetStyles.board, styles.board, coinListItemStyles.itemView]}>
                <Text style={[styles.walletName]}>{item.name}</Text>
                {SwapSelection.renderWalletList(item.coins)}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
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
};

SwapSelection.defaultProps = {
  walletManager: undefined,
  swapSource: undefined,
  swapDest: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  swapSource: state.Wallet.get('swapSource'),
  swapDest: state.Wallet.get('swapDest'),
});

const mapDispatchToProps = (dispatch) => ({
  setSwapSource: (walletName, coin) => dispatch(walletActions.setSwapSource(walletName, coin)),
  setSwapDest: (walletName, coin) => dispatch(walletActions.setSwapDest(walletName, coin)),
  resetSwap: () => dispatch(walletActions.resetSwap()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwapSelection);

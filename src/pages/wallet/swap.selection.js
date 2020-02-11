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
});

class ExchangeSelection extends Component {
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

  static createListData(wallets, navigation) {
    if (!_.isArray(wallets)) {
      return [];
    }
    const listData = [];
    // Create element for each wallet (e.g. key 0)
    wallets.forEach((wallet) => {
      const wal = { name: wallet.name, coins: [] };
      // Create element for each Token (e.g. BTC, RBTC, RIF)
      wallet.coins.forEach((coin, index) => {
        const amountText = coin.balance ? common.getBalanceString(coin.symbol, coin.balance) : '';
        const item = {
          key: `${index}`,
          title: coin.defaultName,
          amount: amountText,
          icon: coin.icon,
          onPress: () => navigation.navigate('Swap', { coin }),
        };
        wal.coins.push(item);
      });
      listData.push(wal);
    });
    return listData;
  }

  componentWillMount() {
    const {
      walletManager, navigation,
    } = this.props;

    const { wallets } = walletManager;
    const listData = ExchangeSelection.createListData(wallets, navigation);

    this.setState({ listData });
  }

  render() {
    const { navigation } = this.props;
    const { listData } = this.state;
    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn={false}
        hasLoader={false}
        bgColor="#00B520"
        headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.swapSelection.title" />}
      >
        <View style={styles.body}>
          <FlatList
            data={listData}
            renderItem={({ item }) => (
              <View style={[presetStyles.board, styles.board, coinListItemStyles.itemView]}>
                <Text style={[styles.walletName]}>{item.name}</Text>
                {ExchangeSelection.renderWalletList(item.coins)}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </BasePageGereral>
    );
  }
}

ExchangeSelection.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }),
};

ExchangeSelection.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

export default connect(mapStateToProps)(ExchangeSelection);

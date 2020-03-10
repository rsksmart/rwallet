import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RSKad from '../../../components/common/rsk.ad';
import common from '../../../common/common';
import BasePageHorizental from '../../base/base.page.horizental';
import ListPageHeader from '../../../components/headers/header.listpage';
import walletActions from '../../../redux/wallet/actions';
import WalletCarousel from './wallet.carousel';


const { getCurrencySymbol } = common;

const styles = StyleSheet.create({
  body: {
    marginBottom: 103,
    marginTop: -190,
    flexDirection: 'column',
    flex: 1,
  },
});

class WalletList extends Component {
  static createListData(wallets, currencySymbol, navigation) {
    if (!_.isArray(wallets)) {
      return [];
    }

    const listData = [];

    // Create element for each wallet (e.g. key 0)
    wallets.forEach((wallet) => {
      const wal = { name: wallet.name, coins: [] };
      // Create element for each Token (e.g. BTC, RBTC, RIF, DOC)
      wallet.coins.forEach((coin, index) => {
        const coinType = common.getSymbolFullName(coin.symbol, coin.type);
        const amountText = coin.balance ? common.getBalanceString(coin.symbol, coin.balance) : '';
        const worthText = coin.balanceValue ? `${currencySymbol}${common.getAssetValueString(coin.balanceValue)}` : currencySymbol;
        const item = {
          key: `${index}`,
          title: coin.defaultName,
          text: coinType,
          worth: worthText,
          amount: amountText,
          icon: coin.icon,
          onPress: () => navigation.navigate('WalletHistory', { coin }),
        };
        wal.coins.push(item);
      });
      wal.assetValue = wallet.assetValue;
      listData.unshift(wal);
    });

    return listData;
  }

  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.onSwapPressed = this.onSwapPressed.bind(this);
    const { currency, walletManager, navigation } = this.props;
    const { wallets } = walletManager;
    const currencySymbol = getCurrencySymbol(currency);
    const listData = WalletList.createListData(wallets, currencySymbol, navigation);
    this.state = { currencySymbol, listData };
  }

  componentWillReceiveProps(nextProps) {
    const {
      updateTimestamp, currency, navigation, walletManager,
    } = nextProps;

    const { wallets } = walletManager;
    const {
      updateTimestamp: lastUpdateTimeStamp,
    } = this.props;

    const newState = this.state;

    // Update currency symbol such as $
    newState.currencySymbol = getCurrencySymbol(currency);

    if (updateTimestamp !== lastUpdateTimeStamp) {
      newState.listData = WalletList.createListData(wallets, newState.currencySymbol, navigation);
    }

    this.setState(newState);
  }

  onSwapPressed() {
    const { resetSwap, navigation } = this.props;
    resetSwap();
    navigation.navigate('SwapSelection', { selectionType: 'source', init: true });
  }

  render() {
    const { navigation } = this.props;
    const { currencySymbol, listData } = this.state;

    const pageData = _.map(listData, (walletData, index) => ({
      index,
      walletData,
      onSendPressed: () => navigation.navigate('SelectWallet', { operation: 'send' }),
      onReceivePressed: () => navigation.navigate('SelectWallet', { operation: 'receive' }),
      onSwapPressed: this.onSwapPressed,
      onAddAssetPressed: () => navigation.navigate('AddToken'),
      currencySymbol,
    }));

    return (
      <BasePageHorizental
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        isViewWrapper
        renderAccessory={() => <RSKad />}
        headerComponent={<ListPageHeader title="page.wallet.list.title" />}
      >
        <View style={[styles.body]}>
          <WalletCarousel data={pageData} navigation={navigation} />
        </View>
      </BasePageHorizental>
    );
  }
}

WalletList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  currency: PropTypes.string.isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }),
  updateTimestamp: PropTypes.number.isRequired,
  resetSwap: PropTypes.func.isRequired,
};

WalletList.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
});

const mapDispatchToProps = (dispatch) => ({
  resetSwap: () => dispatch(walletActions.resetSwap()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);

import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RSKad from '../../components/common/rsk.ad';
import common from '../../common/common';
import BasePageGereral from '../base/base.page.general';
import ListPageHeader from '../../components/headers/header.listpage';
import walletActions from '../../redux/wallet/actions';
import { ParallaxSwiper, WalletSwiperHelper } from '../../components/common/walletswiper';

const { getCurrencySymbol } = common;

const styles = StyleSheet.create({
  body: {
    marginBottom: 103,
    marginTop: -190,
  },
});

/**
 * Formatting number with thousand separator.
 * @param  {number} num e.g. 1000000.65
 * @return {string}   "1,000,000.65"
 */
export function formatNumberThousands(num) {
  if (_.isUndefined(num)) {
    return num;
  }

  const numStr = num.toString();
  const parts = numStr.split('.');

  const decimalStr = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const period = _.isUndefined(parts[1]) ? '' : '.';
  const floatStr = _.isUndefined(parts[1]) ? '' : parts[1];

  return `${decimalStr}${period}${floatStr}`;
}

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
      listData.push(wal);
    });

    return listData;
  }

  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.onSwiperScrollEnd = this.onSwiperScrollEnd.bind(this);
    this.onAddWalletPressed = this.onAddWalletPressed.bind(this);
    this.state = {
      listData: [],
      currencySymbol: getCurrencySymbol(props.currency),
      pageIndex: 1,
    };
  }

  componentWillMount() {
    const {
      currency, walletManager, navigation,
    } = this.props;

    this.onSwapPressed = this.onSwapPressed.bind(this);

    const { wallets } = walletManager;

    const currencySymbol = getCurrencySymbol(currency);
    const listData = WalletList.createListData(wallets, currencySymbol, navigation);

    this.setState({
      currencySymbol,
      listData,
    });
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

  onSwiperScrollEnd(activePageIndex) {
    console.log('activePageIndex: ', activePageIndex);
    this.setState({ pageIndex: activePageIndex });
  }

  onAddWalletPressed() {
    this.swiper.scrollToIndex(1);
    const { navigation } = this.props;
    navigation.navigate('WalletAddIndex');
  }

  createWalletPages() {
    const { navigation } = this.props;
    const { listData, currencySymbol } = this.state;
    const walletPages = [];
    _.each(listData, (walletData, index) => {
      const swiperPage = WalletSwiperHelper.createWalletSwiperPage(
        index,
        walletData,
        () => navigation.navigate('SelectWallet', { operation: 'send' }),
        () => navigation.navigate('SelectWallet', { operation: 'receive' }),
        this.onSwapPressed,
        () => navigation.navigate('AddToken'),
        currencySymbol,
      );
      walletPages.push(swiperPage);
    });
    return walletPages;
  }

  render() {
    const { pageIndex } = this.state;
    const walletPages = this.createWalletPages();
    const addWalletPage = WalletSwiperHelper.createAddWalletPage(this.onAddWalletPressed);
    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        isViewWrapper
        renderAccessory={() => <RSKad />}
        headerComponent={<ListPageHeader title="page.wallet.list.title" />}
      >
        <View style={styles.body}>
          <ParallaxSwiper
            ref={(swiper) => { this.swiper = swiper; }}
            pageIndex={pageIndex}
            onMomentumScrollEnd={this.onSwiperScrollEnd}
          >
            {addWalletPage}
            {walletPages}
          </ParallaxSwiper>
        </View>
      </BasePageGereral>
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

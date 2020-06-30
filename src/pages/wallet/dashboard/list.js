import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RSKad from '../../../components/common/rsk.ad';
import common from '../../../common/common';
import BasePageSimple from '../../base/base.page.simple';
import ListPageHeader from '../../../components/headers/header.listpage';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import WalletCarousel from './wallet.carousel';
import config from '../../../../config';
import screenHelper from '../../../common/screenHelper';
import { screen } from '../../../common/info';
import { createNewFeatureConfirmation } from '../../../common/confirmation.controller';
import storage from '../../../common/storage';

const WALLET_PAGE_WIDTH = screen.width - 50;

const { getCurrencySymbol } = common;

const styles = StyleSheet.create({
  body: {
    marginBottom: screenHelper.bottomHeight + 70,
    marginTop: -190,
    flex: 1,
    alignItems: 'center',
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
        const symbolName = common.getSymbolName(coin.symbol, coin.type);
        const amountText = coin.balance ? common.getBalanceString(coin.balance, coin.symbol) : '';
        const worthText = coin.balanceValue ? `${currencySymbol}${common.getAssetValueString(coin.balanceValue)}` : currencySymbol;
        const item = {
          key: `${index}`,
          title: symbolName,
          text: coin.defaultName,
          worth: worthText,
          amount: amountText,
          icon: coin.icon,
          onPress: () => navigation.navigate('WalletHistory', { coin }),
        };
        wal.coins.push(item);
      });
      wal.assetValue = wallet.assetValue;
      wal.wallet = wallet;
      listData.push(wal);
    });

    return listData;
  }

  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const {
      currency, walletManager, navigation,
    } = props;
    const { wallets } = walletManager;
    const currencySymbol = getCurrencySymbol(currency);
    const listData = WalletList.createListData(wallets, currencySymbol, navigation);
    this.state = { currencySymbol, listData };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.willFocusSubscription = navigation.addListener('willFocus', () => {
      const { appLock } = this.props;
      if (!appLock) {
        this.showRnsNewFeatureConfirmation();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { appLock: lastAppLock } = this.props;
    const {
      updateTimestamp, currency, navigation, walletManager, appLock,
    } = nextProps;

    const { wallets } = walletManager;
    const { updateTimestamp: lastUpdateTimeStamp } = this.props;

    const newState = this.state;

    // Update currency symbol such as $
    newState.currencySymbol = getCurrencySymbol(currency);

    if (updateTimestamp !== lastUpdateTimeStamp) {
      newState.listData = WalletList.createListData(wallets, newState.currencySymbol, navigation);
    }

    // If app is unlocked by user, show RnsNewFeatureConfirmation
    if (!appLock && lastAppLock) {
      this.showRnsNewFeatureConfirmation();
    }

    this.setState(newState);
  }

  showRnsNewFeatureConfirmation = async () => {
    const isShowRnsFeature = await storage.getIsShowRnsFeature();
    if (isShowRnsFeature) {
      return;
    }
    const { addConfirmation, navigation } = this.props;
    const { walletManager } = this.props;
    const { wallets } = walletManager;
    const coin = _.find(wallets[0].coins, { chain: 'Rootstock' });
    if (coin) {
      const infoConfirmation = createNewFeatureConfirmation(
        'modal.rnsNewFeature.title',
        'modal.rnsNewFeature.body',
        'modal.rnsNewFeature.confirmText',
        'modal.rnsNewFeature.cancelText',
        () => {
          navigation.navigate('RnsCreateName', { coin });
          storage.setIsShowRnsFeature();
        },
        () => {
          storage.setIsShowRnsFeature();
        },
      );
      addConfirmation(infoConfirmation);
    }
  }

  onSwapPressed = (wallet) => {
    const { resetSwap, navigation } = this.props;
    resetSwap();
    navigation.navigate('SwapSelection', { selectionType: 'source', init: true, wallet });
  }

  render() {
    const { navigation } = this.props;
    const { currencySymbol, listData } = this.state;
    // const isDataReady = currencySymbol && listData && listData.length;
    const pageData = _.map(listData, (walletData, index) => {
      const hasSwappableCoin = walletData.wallet.coins.find((walletCoin) => config.coinswitch.initPairs[walletCoin.id]) != null;
      return {
        index,
        walletData,
        onSendPressed: () => navigation.navigate('SelectWallet', { operation: 'send', wallet: walletData.wallet }),
        onReceivePressed: () => navigation.navigate('SelectWallet', { operation: 'receive', wallet: walletData.wallet }),
        onScanQrcodePressed: () => navigation.navigate('SelectWallet', {
          operation: 'scan',
          wallet: walletData.wallet,
          onDetectedAction: 'navigateToTransfer',
        }),
        onSwapPressed: () => this.onSwapPressed(walletData.wallet),
        onAddAssetPressed: () => navigation.navigate('AddToken', { wallet: walletData.wallet }),
        currencySymbol,
        hasSwappableCoin,
      };
    });

    return (
      <BasePageSimple
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        isViewWrapper
        renderAccessory={() => <RSKad />}
        headerComponent={<ListPageHeader title="page.wallet.list.title" />}
      >
        <View style={[styles.body]}>
          <WalletCarousel data={pageData} navigation={navigation} pageWidth={WALLET_PAGE_WIDTH} />
        </View>
      </BasePageSimple>
    );
  }
}

WalletList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  currency: PropTypes.string.isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }),
  updateTimestamp: PropTypes.number.isRequired,
  resetSwap: PropTypes.func.isRequired,
  addConfirmation: PropTypes.func.isRequired,
  appLock: PropTypes.bool.isRequired,
};

WalletList.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
  appLock: state.App.get('appLock'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  resetSwap: () => dispatch(walletActions.resetSwapDest()),
  showInAppNotification: (inAppNotification) => dispatch(appActions.showInAppNotification(inAppNotification)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);

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
import { WalletType } from '../../../common/constants';
import { createReadOnlyLimitNotification } from '../../../common/notification.controller';

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
          onPress: () => navigation.navigate('WalletHistory', { coin, walletType: wallet.walletType }),
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
      const { appLock, isShowUpdateModal } = this.props;
      // When the unlock UI is closed or the upgrade UI is closed
      // the rns function prompt is triggered
      if (!appLock && !isShowUpdateModal) {
        this.showRnsNewFeatureConfirmation();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      updateTimestamp: lastUpdateTimeStamp,
      isShowUpdateModal: lastIsShowUpdateModal,
      appLock: lastAppLock,
    } = this.props;
    const {
      updateTimestamp, currency, navigation, walletManager, appLock, isShowUpdateModal,
    } = nextProps;

    const { wallets } = walletManager;

    const newState = this.state;

    // Update currency symbol such as $
    newState.currencySymbol = getCurrencySymbol(currency);

    if (updateTimestamp !== lastUpdateTimeStamp) {
      newState.listData = WalletList.createListData(wallets, newState.currencySymbol, navigation);
    }

    // When the unlock UI is closed or the upgrade UI is closed
    // the rns function prompt is triggered
    if (!isShowUpdateModal) {
      if (lastIsShowUpdateModal || (!appLock && lastAppLock)) {
        this.showRnsNewFeatureConfirmation();
      }
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
    const wallet = _.find(wallets, { walletType: WalletType.Normal });
    if (!wallet) {
      return;
    }
    const coin = _.find(wallet.coins, { chain: 'Rootstock' });
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
    const { resetSwap, navigation, addNotification } = this.props;
    if (wallet.walletType === WalletType.Readonly) {
      addNotification(createReadOnlyLimitNotification());
      return;
    }
    resetSwap();
    navigation.navigate('SwapSelection', { selectionType: 'source', init: true, wallet });
  }

  onSendPressed = (wallet) => {
    const { navigation, addNotification } = this.props;
    const { coins } = wallet;
    if (wallet.walletType === WalletType.Readonly) {
      addNotification(createReadOnlyLimitNotification());
      return;
    }
    // # Issue 445 - Why show select asset window when there's only one asset on the wallet?
    if (coins.length === 1) {
      navigation.navigate('Transfer', { wallet, coin: coins[0] });
      return;
    }
    navigation.navigate('SelectWallet', { operation: 'send', wallet });
  }

  onReceivePressed = (wallet) => {
    const { navigation } = this.props;
    const { coins } = wallet;
    // # Issue 445 - Why show select asset window when there's only one asset on the wallet?
    if (coins.length === 1) {
      navigation.navigate('WalletReceive', { coin: coins[0] });
      return;
    }
    navigation.navigate('SelectWallet', { operation: 'receive', wallet });
  }

  onScanQrcodePressed = (wallet) => {
    const { navigation, addNotification } = this.props;
    const { coins } = wallet;
    if (wallet.walletType === WalletType.Readonly) {
      addNotification(createReadOnlyLimitNotification());
      return;
    }
    // # Issue 445 - Why show select asset window when there's only one asset on the wallet?
    if (coins.length === 1) {
      navigation.navigate('Scan', { coin: coins[0], onDetectedAction: 'navigateToTransfer' });
      return;
    }
    navigation.navigate('SelectWallet', {
      operation: 'scan',
      wallet,
      onDetectedAction: 'navigateToTransfer',
    });
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
        onSendPressed: () => this.onSendPressed(walletData.wallet),
        onReceivePressed: () => this.onReceivePressed(walletData.wallet),
        onScanQrcodePressed: () => this.onScanQrcodePressed(walletData.wallet),
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
  isShowUpdateModal: PropTypes.bool.isRequired,
  addNotification: PropTypes.func.isRequired,
};

WalletList.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  currency: state.App.get('currency'),
  walletManager: state.Wallet.get('walletManager'),
  updateTimestamp: state.Wallet.get('updateTimestamp'),
  appLock: state.App.get('appLock'),
  isShowUpdateModal: state.App.get('isShowUpdateModal'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  resetSwap: () => dispatch(walletActions.resetSwapDest()),
  showInAppNotification: (inAppNotification) => dispatch(appActions.showInAppNotification(inAppNotification)),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletList);

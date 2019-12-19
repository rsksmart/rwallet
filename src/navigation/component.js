import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Root } from 'native-base';
import _ from 'lodash';

import PropTypes from 'prop-types';
import UpdateModal from '../components/update/update.modal';
import Start from '../pages/start/start';
import TermsPage from '../pages/start/terms';
import PrimaryTabNavigatorComp from './tab.primary';
import Notifications from '../components/common/notification/notifications';
import flex from '../assets/styles/layout.flex';
import Toast from '../components/common/notification/toast';
import appActions from '../redux/app/actions';
import walletActions from '../redux/wallet/actions';

const DEFAULT_ROUTE_CONFIG_MAP = {
  Start: {
    screen: Start,
    path: 'start',
  },
  PrimaryTabNavigator: {
    screen: PrimaryTabNavigatorComp,
    path: 'tab',
  },
  TermsPage: {
    screen: TermsPage,
    path: 'terms',
  },
};

const DEFUALT_SWITCH_CONFIG = {
  initialRouteName: 'PrimaryTabNavigator',
};

const uriPrefix = Platform.OS === 'android' ? 'rwallet://rwallet/' : 'rwallet://rwallet/';
class RootComponent extends Component {
  constructor(props) {
    super(props);
    global.functions = {
      showToast: (wording) => {
        // eslint-disable-next-line react/no-string-refs
        this.toast.showToast(wording);
      },
    };

    this.state = {
      isStorageRead: false,
      isParseWritten: false,
      SwitchNavComponent: undefined,
    };
  }

  /**
   * RootComponent is the main entrace of the App
   * Initialization jobs need to start here
   */
  componentWillMount() {
    const { initializeFromStorage } = this.props;

    // Load Settings and Wallets from permenate storage
    initializeFromStorage();
  }

  componentWillReceiveProps(nextProps) {
    const {
      isInitFromStorageDone, isInitWithParseDone, initializeWithParse, startFetchPriceTimer,
      startFetchBalanceTimer, startFetchTransactionTimer, walletManager, currency, prices, isBalanceUpdated,
    } = nextProps;

    const {
      currency: originalCurrency, prices: originalPrices, updateWalletAssetValue, resetBalanceUpdated,
    } = this.props;

    const { isStorageRead, isParseWritten } = this.state;

    const newState = this.state;

    // As long as the app initialized from storage, we mark state.isStorageRead to true
    if (isInitFromStorageDone) {
      if (!isInitWithParseDone) {
      // Start the first page from Wallet Dashboard if there's any wallet
        newState.SwitchNavComponent = createAppContainer(
          createSwitchNavigator(
            DEFAULT_ROUTE_CONFIG_MAP, _.extend(DEFUALT_SWITCH_CONFIG, { initialRouteName: 'PrimaryTabNavigator' }),
          ),
        );

        // Upload current wallet settings to Parse in order to get balances and transactions
        initializeWithParse();
        newState.isStorageRead = true;
      } else {
      // Start timer to get price frequently
      // TODO: we will need to get rid of timer and replace with Push Notification
        startFetchPriceTimer();
        startFetchBalanceTimer(walletManager);
        startFetchTransactionTimer(walletManager);

        newState.isParseWritten = true;
      }
    }

    if (isStorageRead && isParseWritten) {
      const isCurrencyChanged = (currency !== originalCurrency);
      const isPricesChanged = (!_.isEqual(prices, originalPrices));
      let needUpdate = false;

      // Update total asset value and list data if there's currency or price change
      // Balance, name, creation/deletion are handled in reducer directly
      if (isBalanceUpdated) {
        needUpdate = true;
        resetBalanceUpdated();
      } else if (isCurrencyChanged || isPricesChanged) {
        needUpdate = true;
      }

      if (needUpdate) {
        updateWalletAssetValue(currency);
      }
    }

    this.setState(newState);
  }

  render() {
    const { showNotification, notification, dispatch } = this.props;
    const { isStorageRead, SwitchNavComponent } = this.state;

    return (
      <View style={[flex.flex1]}>
        {isStorageRead // TODO: what do we show while waiting for initialized?
        && (
        <Root>
          <SwitchNavComponent uriPrefix={uriPrefix} />
          {false && <UpdateModal showUpdate mandatory={false} />}
          <Notifications showNotification={showNotification} notification={notification} dispatch={dispatch} />
          <Toast ref={(ref) => { this.toast = ref; }} backgroundColor="white" position="top" textColor="green" />
        </Root>
        )}
      </View>
    );
  }
}

RootComponent.propTypes = {
  initializeFromStorage: PropTypes.func.isRequired,
  initializeWithParse: PropTypes.func.isRequired,
  // resetInitDone: PropTypes.func.isRequired,

  startFetchBalanceTimer: PropTypes.func.isRequired,
  startFetchTransactionTimer: PropTypes.func.isRequired,
  resetBalanceUpdated: PropTypes.func.isRequired,
  updateWalletAssetValue: PropTypes.func.isRequired,

  walletManager: PropTypes.shape({}),

  showNotification: PropTypes.bool.isRequired,
  notification: PropTypes.shape({}), // TODO: what is this notification supposed to be?p
  dispatch: PropTypes.func.isRequired,
  isInitFromStorageDone: PropTypes.bool.isRequired,
  isInitWithParseDone: PropTypes.bool.isRequired,
  startFetchPriceTimer: PropTypes.func.isRequired,
  isBalanceUpdated: PropTypes.bool.isRequired,
  currency: PropTypes.string.isRequired,
  prices: PropTypes.arrayOf(PropTypes.object).isRequired,
};

RootComponent.defaultProps = {
  notification: null,
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  isInitFromStorageDone: state.App.get('isInitFromStorageDone'),
  isInitWithParseDone: state.App.get('isInitWithParseDone'),
  walletManager: state.Wallet.get('walletManager'),
  isAssetValueUpdated: state.Wallet.get('isAssetValueUpdated'),
  isBalanceUpdated: state.Wallet.get('isBalanceUpdated'),
  currency: state.App.get('currency'),
  prices: state.Wallet.get('prices'),
});

const mapDispatchToProps = (dispatch) => ({
  initializeFromStorage: () => dispatch(appActions.initializeFromStorage()),
  initializeWithParse: () => dispatch(appActions.initializeWithParse()),
  // resetInitDone: () => dispatch(appActions.resetInitDone()),
  startFetchPriceTimer: () => dispatch(walletActions.startFetchPriceTimer()),
  startFetchBalanceTimer: (walletManager) => dispatch(walletActions.startFetchBalanceTimer(walletManager)),
  startFetchTransactionTimer: (walletManager) => dispatch(walletActions.startFetchTransactionTimer(walletManager)),
  resetBalanceUpdated: () => dispatch(walletActions.resetBalanceUpdated()),
  updateWalletAssetValue: (currency) => dispatch(walletActions.updateAssetValue(currency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);

import React, { Component } from 'react';
import {
  View, Platform, Modal, StyleSheet,
} from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Root } from 'native-base';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { BlurView } from '@react-native-community/blur';

import UpdateModal from '../components/update/update.modal';
import Start from '../pages/start/start';
import TermsPage from '../pages/start/terms';
import PrimaryTabNavigatorComp from './tab.primary';
import Notifications from '../components/common/notification/notifications';
import Confirmation from '../components/common/confirmation/confirmation';
import PasscodeModals from '../components/common/passcode/passcode.modals';
import TouchSensorModal from '../components/common/modal/touchSensorModal';
import flex from '../assets/styles/layout.flex';
import Toast from '../components/common/notification/toast';
import InAppNotification from '../components/common/inapp.notification/notification';

const styles = StyleSheet.create({
  authVerifyView: {
    flex: 1,
  },
});

const SwitchNavi = createAppContainer(createSwitchNavigator(
  {
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
  },
  {
    initialRouteName: 'Start',
  },
));

const uriPrefix = Platform.OS === 'android' ? 'rwallet://rwallet/' : 'rwallet://rwallet/';
class RootComponent extends Component {
  /**
   * RootComponent is the main entrace of the App
   * Initialization jobs need to start here
   */
  async componentWillMount() {
    const { initializeFromStorage, initFcm } = this.props;
    // Load Settings and Wallets from permenate storage
    initializeFromStorage();
    initFcm();
  }

  componentWillReceiveProps(nextProps) {
    const {
      isInitFromStorageDone, isLogin, currency, prices, isTokensUpdated,
    } = nextProps;

    const {
      currency: originalCurrency, prices: originalPrices, updateWalletAssetValue, resetTokensUpdated, isLogin: lastIsLogin, isInitFromStorageDone: lastIsInitFromStorageDone,
    } = this.props;

    // trigger onStorageRead if storage logic is done
    if (!lastIsInitFromStorageDone && isInitFromStorageDone) {
      this.onStorageRead(nextProps);
    }

    // trigger onUserLogin if user logged in
    if (!lastIsLogin && isLogin) {
      this.onUserLogin(nextProps);
    }

    // Update assets value
    const isCurrencyChanged = (currency !== originalCurrency);
    const isPricesChanged = (!_.isEqual(prices, originalPrices));
    let needUpdate = false;

    console.log('isTokensUpdated', isTokensUpdated, 'isCurrencyChanged', isCurrencyChanged, 'isPricesChanged', isPricesChanged);
    // Update total asset value and list data if there's currency or price change
    // Balance, name, creation/deletion are handled in reducer directly
    if (isTokensUpdated) {
      needUpdate = true;
      resetTokensUpdated();
    } else if (isCurrencyChanged || isPricesChanged) {
      needUpdate = true;
    }

    if (needUpdate) {
      updateWalletAssetValue(currency, prices);
    }
  }

  onStorageRead = (props) => {
    const { login } = props;
    login();
  }

  onUserLogin = (props) => {
    const {
      getServerInfo, updateUser, initLiveQueryPrice, initLiveQueryTokens, initLiveQueryTransactions, initLiveQueryBlockHeights, walletManager,
    } = props;
    const tokens = walletManager.getTokens();
    getServerInfo();
    updateUser();
    initLiveQueryPrice();
    initLiveQueryTokens(tokens);
    initLiveQueryTransactions(tokens);
    initLiveQueryBlockHeights();
  }

  render() {
    const {
      showNotification, notification, removeNotification, notificationCloseCallback,
      showPasscode, passcodeType, closePasscodeModal, passcodeCallback, passcodeFallback,
      isShowConfirmation, confirmation, removeConfirmation, confirmationCallback, confirmationCancelCallback,
      isShowFingerprintModal, hideFingerprintModal, fingerprintCallback, fingerprintFallback, fingerprintUsePasscode,
      isShowInAppNotification, inAppNotification, resetInAppNotification, processNotification,
    } = this.props;

    const isShowAuthVerifyModal = showPasscode || isShowFingerprintModal;

    return (
      <View style={[flex.flex1]}>
        <Root>
          <SwitchNavi uriPrefix={uriPrefix} />
          {false && <UpdateModal showUpdate mandatory={false} />}
          <Notifications showNotification={showNotification} notification={notification} removeNotification={removeNotification} notificationCloseCallback={notificationCloseCallback} />
          <Confirmation isShowConfirmation={isShowConfirmation} confirmation={confirmation} removeConfirmation={removeConfirmation} confirmationCallback={confirmationCallback} confirmationCancelCallback={confirmationCancelCallback} />

          { isShowAuthVerifyModal && (
            <Modal animationType="fade" transparent>
              <BlurView
                blurType="dark"
                blurAmount={10}
                style={styles.authVerifyView}
              >
                { showPasscode && <PasscodeModals showPasscode={showPasscode} passcodeType={passcodeType} closePasscodeModal={closePasscodeModal} passcodeCallback={passcodeCallback} passcodeFallback={passcodeFallback} />}
                { isShowFingerprintModal && (
                  <TouchSensorModal
                    isShowFingerprintModal={isShowFingerprintModal}
                    fingerprintCallback={fingerprintCallback}
                    fingerprintFallback={fingerprintFallback}
                    hideFingerprintModal={hideFingerprintModal}
                    fingerprintUsePasscode={fingerprintUsePasscode}
                  />
                )}
              </BlurView>
            </Modal>
          )}

          <Toast ref={(ref) => { this.toast = ref; }} backgroundColor="white" position="top" textColor="green" />
          <InAppNotification isVisiable={isShowInAppNotification} notification={inAppNotification} resetInAppNotification={resetInAppNotification} processNotification={processNotification} />
        </Root>
      </View>
    );
  }
}

RootComponent.propTypes = {
  initializeFromStorage: PropTypes.func.isRequired,
  resetTokensUpdated: PropTypes.func.isRequired,
  updateWalletAssetValue: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({
    getTokens: PropTypes.func,
  }),
  showNotification: PropTypes.bool.isRequired,
  notification: PropTypes.shape({}), // TODO: what is this notification supposed to be?p
  isInitFromStorageDone: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool.isRequired,
  isTokensUpdated: PropTypes.bool.isRequired,
  currency: PropTypes.string.isRequired,
  prices: PropTypes.arrayOf(PropTypes.object).isRequired,
  showPasscode: PropTypes.bool.isRequired,
  passcodeType: PropTypes.string,
  passcodeCallback: PropTypes.func,
  passcodeFallback: PropTypes.func,
  closePasscodeModal: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  isShowConfirmation: PropTypes.bool.isRequired,
  confirmation: PropTypes.shape({}),
  removeConfirmation: PropTypes.func.isRequired,
  notificationCloseCallback: PropTypes.func,
  confirmationCallback: PropTypes.func,
  confirmationCancelCallback: PropTypes.func,
  isShowFingerprintModal: PropTypes.bool.isRequired,
  hideFingerprintModal: PropTypes.func.isRequired,
  fingerprintCallback: PropTypes.func,
  fingerprintFallback: PropTypes.func,
  fingerprintUsePasscode: PropTypes.func,
  isShowInAppNotification: PropTypes.bool.isRequired,
  inAppNotification: PropTypes.shape({}),
  initFcm: PropTypes.func.isRequired,
  resetInAppNotification: PropTypes.func.isRequired,
  processNotification: PropTypes.func.isRequired,
};

RootComponent.defaultProps = {
  walletManager: undefined,
  notification: null,
  notificationCloseCallback: null,
  passcodeType: null,
  passcodeCallback: null,
  passcodeFallback: null,
  confirmation: null,
  confirmationCallback: null,
  confirmationCancelCallback: null,
  fingerprintCallback: null,
  fingerprintFallback: null,
  fingerprintUsePasscode: null,
  inAppNotification: undefined,
};

export default RootComponent;

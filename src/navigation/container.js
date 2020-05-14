import { connect } from 'react-redux';
import RootComponent from './component';
import appActions from '../redux/app/actions';
import walletActions from '../redux/wallet/actions';
import priceActions from '../redux/price/actions';

const mapStateToProps = (state) => ({
  showNotification: state.App.get('showNotification'),
  notification: state.App.get('notification'),
  notificationCloseCallback: state.App.get('notificationCloseCallback'),
  showPasscode: state.App.get('showPasscode'),
  passcodeType: state.App.get('passcodeType'),
  passcodeCallback: state.App.get('passcodeCallback'),
  passcodeFallback: state.App.get('passcodeFallback'),
  isInitFromStorageDone: state.App.get('isInitFromStorageDone'),
  isInitWithParseDone: state.App.get('isInitWithParseDone'),
  isInitAppDone: state.App.get('isInitAppDone'),
  walletManager: state.Wallet.get('walletManager'),
  isAssetValueUpdated: state.Wallet.get('isAssetValueUpdated'),
  isBalanceUpdated: state.Wallet.get('isBalanceUpdated'),
  currency: state.App.get('currency'),
  prices: state.Price.get('prices'),
  isShowInAppNotification: state.App.get('isShowInAppNotification'),
  confirmation: state.App.get('confirmation'),
  confirmationCallback: state.App.get('confirmationCallback'),
  confirmationCancelCallback: state.App.get('confirmationCancelCallback'),
  isShowFingerprintModal: state.App.get('isShowFingerprintModal'),
  fingerprintCallback: state.App.get('fingerprintCallback'),
  fingerprintFallback: state.App.get('fingerprintFallback'),
  isShowConfirmation: state.App.get('isShowConfirmation'),
  isInAppNotification: state.App.get('isInAppNotification'),
  inAppNotification: state.App.get('inAppNotification'),
});

const mapDispatchToProps = (dispatch) => ({
  closePasscodeModal: () => dispatch(appActions.hidePasscode()),
  initializeFromStorage: () => dispatch(appActions.initializeFromStorage()),
  initializeWithParse: () => dispatch(appActions.initializeWithParse()),
  resetBalanceUpdated: () => dispatch(walletActions.resetBalanceUpdated()),
  updateWalletAssetValue: (currency, prices) => dispatch(walletActions.updateAssetValue(currency, prices)),
  removeNotification: () => dispatch(appActions.removeNotification()),
  removeConfirmation: () => dispatch(appActions.removeConfirmation()),
  fingerprintUsePasscode: (callback, fallback) => dispatch(appActions.fingerprintUsePasscode(callback, fallback)),
  hideFingerprintModal: () => dispatch(appActions.hideFingerprintModal()),
  initLiveQueryPrice: () => dispatch(priceActions.initLiveQueryPrice()),
  initLiveQueryBalances: (tokens) => dispatch(walletActions.initLiveQueryBalances(tokens)),
  initLiveQueryTransactions: (tokens) => dispatch(walletActions.initLiveQueryTransactions(tokens)),
  initLiveQueryBlockHeights: () => dispatch(walletActions.initLiveQueryBlockHeights()),
  initFcmChannel: () => dispatch(appActions.initFcmChannel()),
  resetInAppNotification: () => dispatch(appActions.resetInAppNotification()),
  processNotification: (notification) => dispatch(appActions.processNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);

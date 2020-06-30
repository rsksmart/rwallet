import { connect } from 'react-redux';
import RootComponent from './component';
import appActions from '../redux/app/actions';
import walletActions from '../redux/wallet/actions';
import priceActions from '../redux/price/actions';

const mapStateToProps = (state) => ({
  isInitFromStorageDone: state.App.get('isInitFromStorageDone'),
  isLogin: state.App.get('isLogin'),
  isAssetValueUpdated: state.Wallet.get('isAssetValueUpdated'),
  isTokensUpdated: state.Wallet.get('isTokensUpdated'),

  walletManager: state.Wallet.get('walletManager'),
  currency: state.App.get('currency'),
  prices: state.Price.get('prices'),

  showNotification: state.App.get('showNotification'),
  notification: state.App.get('notification'),
  notificationCloseCallback: state.App.get('notificationCloseCallback'),

  showPasscode: state.App.get('showPasscode'),
  passcodeType: state.App.get('passcodeType'),
  passcodeCallback: state.App.get('passcodeCallback'),
  passcodeFallback: state.App.get('passcodeFallback'),

  isShowConfirmation: state.App.get('isShowConfirmation'),
  confirmation: state.App.get('confirmation'),
  confirmationCallback: state.App.get('confirmationCallback'),
  confirmationCancelCallback: state.App.get('confirmationCancelCallback'),

  isShowFingerprintModal: state.App.get('isShowFingerprintModal'),
  fingerprintCallback: state.App.get('fingerprintCallback'),
  fingerprintFallback: state.App.get('fingerprintFallback'),

  inAppNotification: state.App.get('inAppNotification'),
  isShowInAppNotification: state.App.get('isShowInAppNotification'),
});

const mapDispatchToProps = (dispatch) => ({
  initFcm: () => dispatch(appActions.initFcm()),
  initFcmChannel: () => dispatch(appActions.initFcmChannel()),
  login: () => dispatch(appActions.login()),

  getServerInfo: () => dispatch(appActions.getServerInfo()),
  updateUser: () => dispatch(appActions.getServerInfo()),
  initializeFromStorage: () => dispatch(appActions.initializeFromStorage()),
  initLiveQueryPrice: () => dispatch(priceActions.initLiveQueryPrice()),
  initLiveQueryTokens: (tokens) => dispatch(walletActions.initLiveQueryTokens(tokens)),
  initLiveQueryTransactions: (tokens) => dispatch(walletActions.initLiveQueryTransactions(tokens)),
  initLiveQueryBlockHeights: () => dispatch(walletActions.initLiveQueryBlockHeights()),

  resetTokensUpdated: () => dispatch(walletActions.resetTokensUpdated()),
  updateWalletAssetValue: (currency, prices) => dispatch(walletActions.updateAssetValue(currency, prices)),

  removeNotification: () => dispatch(appActions.removeNotification()),
  removeConfirmation: () => dispatch(appActions.removeConfirmation()),

  fingerprintUsePasscode: (callback, fallback) => dispatch(appActions.fingerprintUsePasscode(callback, fallback)),
  hideFingerprintModal: () => dispatch(appActions.hideFingerprintModal()),
  closePasscodeModal: () => dispatch(appActions.hidePasscode()),

  resetInAppNotification: () => dispatch(appActions.resetInAppNotification()),
  processNotification: (notification) => dispatch(appActions.processNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);

import { connect } from 'react-redux';
import RootComponent from './component';
import appActions from '../redux/app/actions';
import walletActions from '../redux/wallet/actions';

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
  walletManager: state.Wallet.get('walletManager'),
  isAssetValueUpdated: state.Wallet.get('isAssetValueUpdated'),
  isBalanceUpdated: state.Wallet.get('isBalanceUpdated'),
  currency: state.App.get('currency'),
  prices: state.Wallet.get('prices'),
  isShowConfirmation: state.App.get('isShowConfirmation'),
  confirmation: state.App.get('confirmation'),
  confirmationCallback: state.App.get('confirmationCallback'),
  confirmationCancelCallback: state.App.get('confirmationCancelCallback'),
  isShowFingerprintModal: state.App.get('isShowFingerprintModal'),
  fingerprintCallback: state.App.get('fingerprintCallback'),
  fingerprintFallback: state.App.get('fingerprintFallback'),
});

const mapDispatchToProps = (dispatch) => ({
  closePasscodeModal: () => dispatch(appActions.hidePasscode()),
  initializeFromStorage: () => dispatch(appActions.initializeFromStorage()),
  initializeWithParse: () => dispatch(appActions.initializeWithParse()),
  startFetchPriceTimer: () => dispatch(walletActions.startFetchPriceTimer()),
  startFetchBalanceTimer: (walletManager) => dispatch(walletActions.startFetchBalanceTimer(walletManager)),
  startFetchTransactionTimer: (walletManager) => dispatch(walletActions.startFetchTransactionTimer(walletManager)),
  startFetchLatestBlockHeightTimer: () => dispatch(walletActions.startFetchLatestBlockHeightTimer()),
  resetBalanceUpdated: () => dispatch(walletActions.resetBalanceUpdated()),
  updateWalletAssetValue: (currency) => dispatch(walletActions.updateAssetValue(currency)),
  removeNotification: () => dispatch(appActions.removeNotification()),
  removeConfirmation: () => dispatch(appActions.removeConfirmation()),
  fingerprintUsePasscode: (callback, fallback) => dispatch(appActions.fingerprintUsePasscode(callback, fallback)),
  hideFingerprintModal: () => dispatch(appActions.hideFingerprintModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);

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
  walletManager: state.Wallet.get('walletManager'),
  isAssetValueUpdated: state.Wallet.get('isAssetValueUpdated'),
  isBalanceUpdated: state.Wallet.get('isBalanceUpdated'),
  currency: state.App.get('currency'),
  prices: state.Price.get('prices'),
  isShowInAppNotification: state.App.get('isShowInAppNotification'),
  confirmation: state.App.get('confirmation'),
  confirmationCallback: state.App.get('confirmationCallback'),
  confirmationCancelCallback: state.App.get('confirmationCancelCallback'),
  isShowConfirmation: state.App.get('isShowConfirmation'),
  isInAppNotification: state.App.get('isInAppNotification'),
  inAppNotification: state.App.get('inAppNotification'),
});

const mapDispatchToProps = (dispatch) => ({
  closePasscodeModal: () => dispatch(appActions.hidePasscode()),
  initializeFromStorage: () => dispatch(appActions.initializeFromStorage()),
  initializeWithParse: () => dispatch(appActions.initializeWithParse()),
  startFetchBalanceTimer: (walletManager) => dispatch(walletActions.startFetchBalanceTimer(walletManager)),
  startFetchTransactionTimer: (walletManager) => dispatch(walletActions.startFetchTransactionTimer(walletManager)),
  startFetchLatestBlockHeightTimer: () => dispatch(walletActions.startFetchLatestBlockHeightTimer()),
  resetBalanceUpdated: () => dispatch(walletActions.resetBalanceUpdated()),
  updateWalletAssetValue: (currency, prices) => dispatch(walletActions.updateAssetValue(currency, prices)),
  removeNotification: () => dispatch(appActions.removeNotification()),
  removeConfirmation: () => dispatch(appActions.removeConfirmation()),
  initLiveQueryPrice: () => dispatch(priceActions.initLiveQueryPrice()),
  initLiveQueryBalances: (tokens) => dispatch(walletActions.initLiveQueryBalances(tokens)),
  initLiveQueryTransactions: (tokens) => dispatch(walletActions.initLiveQueryTransactions(tokens)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);

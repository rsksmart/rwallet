import { connect } from 'react-redux';
import RootComponent from './component';
import appActions from '../redux/app/actions';
import walletActions from '../redux/wallet/actions';

const mapStateToProps = (state) => ({
  showNotification: state.App.get('showNotification'),
  notification: state.App.get('notification'),
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
});

const mapDispatchToProps = (dispatch) => ({
  closePasscodeModal: () => dispatch(appActions.hidePasscode()),
  initializeFromStorage: () => dispatch(appActions.initializeFromStorage()),
  initializeWithParse: () => dispatch(appActions.initializeWithParse()),
  startFetchPriceTimer: () => dispatch(walletActions.startFetchPriceTimer()),
  startFetchBalanceTimer: (walletManager) => dispatch(walletActions.startFetchBalanceTimer(walletManager)),
  startFetchTransactionTimer: (walletManager) => dispatch(walletActions.startFetchTransactionTimer(walletManager)),
  resetBalanceUpdated: () => dispatch(walletActions.resetBalanceUpdated()),
  updateWalletAssetValue: (currency) => dispatch(walletActions.updateAssetValue(currency)),
  removeNotification: () => dispatch(appActions.removeNotification()),
  removeConfirmation: () => dispatch(appActions.removeConfirmation()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);

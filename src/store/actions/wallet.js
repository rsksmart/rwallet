import {
  WALLET_SAVED,
  REFRESH_WALLETS_LIST,
  SET_WALLET_TO_EDIT,
  SET_WALLET_TO_SEND,
  SET_FAVOURITE_WALLET,
  SET_WALLET_LIST_DIRTY,
  SET_NETWORKS,
  WALLET_IMPORTED,
} from '.';

export const walletSaved = wallet => ({ type: WALLET_SAVED, payload: wallet });
export const setWalletToEdit = wallet => ({ type: SET_WALLET_TO_EDIT, payload: wallet });
export const setWalletToSend = (wallet, showQRScanner) => ({
  type: SET_WALLET_TO_SEND,
  payload: wallet,
  showQRScanner,
});
export const refreshWalletsList = wallets => ({ type: REFRESH_WALLETS_LIST, payload: wallets });
export const setFavouriteWallet = wallet => ({ type: SET_FAVOURITE_WALLET, payload: wallet });
export const setWalletListDirty = () => ({ type: SET_WALLET_LIST_DIRTY });
export const setNetworks = networks => ({ type: SET_NETWORKS, payload: networks });
export const walletImported = result => ({ type: WALLET_IMPORTED, payload: result });

import { AsyncStorage } from 'react-native';
import { combineReducers } from 'redux'

import AsyncStorageEnum from '../common/asyncStorageEnum';

import {
    WALLET_SAVED,
    REFRESH_WALLETS_LIST,
    SET_WALLET_TO_EDIT,
    SET_WALLET_TO_SEND,
    SET_FAVOURITE_WALLET,
    SET_WALLET_LIST_DIRTY,
    SET_NETWORKS,
    WALLET_IMPORTED,
    ON_BOARDING_STEP_COMPLETED,
    PORTFOLIO_BALANCE_CHANGED,
    REFRESH_PORTFOLIO,
    SET_HISTORY_ORDER,
} from './constraints';

const initialState = {
    wallets: undefined,
    walletsListDirty: true,
    favouriteWallet: null,
    networks: {},
};

const walletReducer = (state = initialState, action) => {
    switch (action.type) {
        case WALLET_SAVED: {
            let { favouriteWallet } = state;
            if (!state.wallets.length) {
                favouriteWallet = action.payload;
                AsyncStorage.setItem(AsyncStorageEnum.FAVOURITE_WALLET, JSON.stringify(favouriteWallet.id));
            }
            return { ...state, walletsListDirty: true, favouriteWallet };
        }
        case SET_WALLET_TO_EDIT: {
            return { ...state, walletToEdit: action.payload };
        }
        case SET_WALLET_TO_SEND: {
            return { ...state, walletToSend: action.payload, showQRScanner: action.showQRScanner };
        }
        case REFRESH_WALLETS_LIST: {
            return { ...state, walletsListDirty: false, wallets: [...action.payload] };
        }
        case SET_FAVOURITE_WALLET: {
            const favouriteWallet = action.payload;
            AsyncStorage.setItem(AsyncStorageEnum.FAVOURITE_WALLET, JSON.stringify(favouriteWallet.id));
            return { ...state, favouriteWallet };
        }
        case SET_WALLET_LIST_DIRTY: {
            return { ...state, walletsListDirty: true };
        }
        case SET_NETWORKS: {
            const networks = action.payload.reduce((result, item) => (
                { ...result, [item.name]: item }
            ), {});
            return { ...state, networks };
        }
        case WALLET_IMPORTED: {
            return { ...state, importedWallet: action.payload };
        }
        case ON_BOARDING_STEP_COMPLETED: {
            return { ...state, updateStep: true, step: action.payload };
        }
        case SET_HISTORY_ORDER: {
            return { ...state, order: action.payload };
        }
        default:
            return state;
    }
};

const initialPortfolioState = {
    showBalanceUpdated: false,
    refreshPortfolio: false,
};

const portfolioReducer = (state = initialPortfolioState, action) => {
    switch (action.type) {
        case PORTFOLIO_BALANCE_CHANGED: {
            AsyncStorage.setItem(AsyncStorageEnum.PORTFOLIO_BALANCE, action.payload);
            return { ...state, showBalanceUpdated: !state.showBalanceUpdated };
        }
        case REFRESH_PORTFOLIO: {
            return { ...state, refreshPortfolio: action.payload };
        }
        default:
            return state;
    }
};

const reducers = {
    walletReducer,
    portfolioReducer,
};

const rootReducer = combineReducers(reducers);

export default rootReducer;

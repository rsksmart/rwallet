/* eslint no-restricted-syntax:0 */
import {
  take, call, all, takeEvery, put, select, cancelled,
} from 'redux-saga/effects';
import { eventChannel /* END */ } from 'redux-saga';
import _ from 'lodash';
import actions from './actions';
import appActions from '../app/actions';
import ParseHelper from '../../common/parse';
import CoinSwitchHelper from '../../common/coinswitch.helper';
import parseDataUtil from '../../common/parseDataUtil';

import { createErrorNotification } from '../../common/notification.controller';

function* createKeyRequest(action) {
  const {
    name, phrase, coins, walletManager, derivationPaths,
  } = action.payload;
  try {
    yield call(walletManager.createWallet, name, phrase, coins, derivationPaths);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    const tokens = walletManager.getTokens();
    yield put({ type: actions.INIT_LIVE_QUERY_BALANCES, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, { err });
    console.error(message);
  }
}

function* deleteKeyRequest(action) {
  const { walletManager, key } = action.payload;
  try {
    const state = yield select();
    const currency = state.App.get('currency');
    const prices = state.Price.get('prices');
    yield call(walletManager.deleteWallet, key);
    yield put({ type: actions.UPDATE_ASSET_VALUE, payload: { currency, prices } });
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    const tokens = walletManager.getTokens();
    yield put({ type: actions.INIT_LIVE_QUERY_BALANCES, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, { err });
    console.error(message);
  }
}

function* renameKeyRequest(action) {
  const { walletManager, key, name } = action.payload;
  try {
    yield call(walletManager.renameWallet, key, name);
    yield put({ type: actions.WALLET_NAME_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, { err });
    const notification = createErrorNotification('modal.incorrectKeyName.title', message.message);
    yield put(appActions.addNotification(notification));
    // console.error(message);
  }
}

function* addTokenRequest(action) {
  const {
    walletManager, wallet, token,
  } = action.payload;
  try {
    yield call(wallet.addToken, token);
    yield put({ type: actions.SET_ADD_TOKEN_RESULT, value: { state: 'success' } });
    yield call(walletManager.serialize);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    const tokens = walletManager.getTokens();
    yield put({ type: actions.INIT_LIVE_QUERY_BALANCES, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (error) {
    console.log(error);
    if (error.message === 'err.exsistedtoken') {
      yield put({ type: actions.SET_ADD_TOKEN_RESULT, value: { state: 'error', error } });
      return;
    }
    const message = yield call(ParseHelper.handleError, error);
    console.error(message);
  }
}

function* deleteTokenRequest(action) {
  const { walletManager, wallet, token } = action.payload;
  try {
    const state = yield select();
    const currency = state.App.get('currency');
    const prices = state.Price.get('prices');
    yield call(wallet.deleteToken, token);
    yield call(walletManager.serialize);
    yield put({ type: actions.UPDATE_ASSET_VALUE, payload: { currency, prices } });
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    const tokens = walletManager.getTokens();
    yield put({ type: actions.INIT_LIVE_QUERY_BALANCES, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (err) {
    const message = yield call(ParseHelper.handleError, err);
    console.error(message);
  }
}

function* getSwapRateRequest(action) {
  const { sourceCoinId, destCoinId } = action.payload;
  try {
    const response = yield call(CoinSwitchHelper.getRate, sourceCoinId, destCoinId);
    const swapRate = {
      sourceCoinId,
      destCoinId,
      rate: response,
    };
    yield put({ type: actions.GET_SWAP_RATE_RESULT, value: swapRate });
  } catch (err) {
    console.log('getSwapRateRequest, err: ', err);
    yield put({ type: actions.SET_SWAP_RATE_RESULT_ERROR, value: { sourceCoinId, destCoinId, error: err } });
  }
}

/**
 * create balances subscription channel
 * @param {object} subscription parse subscription
 */
function createBalancesSubscriptionChannel(subscription) {
  return eventChannel((emitter) => {
    const unsubscribeHandler = () => {
      ParseHelper.unsubscribe(subscription);
      console.log('createBalancesSubscriptionChannel.unsubscribeHandler.');
    };
    const updateHandler = (object) => {
      console.log('createBalancesSubscriptionChannel.updateHandler, object: ', object);
      const balance = parseDataUtil.getBalance(object);
      return emitter({ type: actions.FETCH_BALANCE_RESULT, value: [balance] });
    };
    subscription.on('update', updateHandler);
    subscription.on('create', updateHandler);
    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

/**
 * Fetch balances of tokens and update property of each addresss
 * @param {object} subscription parse subscription
 */
function* fetchBalances(tokens) {
  try {
    const response = yield call(ParseHelper.fetchBalances, tokens);
    yield put({
      type: actions.FETCH_BALANCE_RESULT,
      value: response,
    });
  } catch (error) {
    console.log('fetchBalances, error:', error);
  }
}

/**
 * Subscribe balances of tokens
 * @param {object} subscription parse subscription
 */
function* subscribeBalances(tokens) {
  let subscription;
  let subscriptionChannel;
  try {
    const state = yield select();
    subscription = yield call(ParseHelper.subscribeBalances, tokens);
    subscriptionChannel = yield call(createBalancesSubscriptionChannel, subscription);
    // If there is already a channel here, cancel the previous channel and save the new channel.
    const balancesChannel = state.Wallet.get('balancesChannel');
    if (balancesChannel) {
      balancesChannel.close();
    }
    yield put({ type: actions.SET_BALANCES_CHANNEL, value: subscriptionChannel });
    while (true) {
      const payload = yield take(subscriptionChannel);
      yield put(payload);
    }
  } catch (err) {
    console.log('Subscription error:', err);
  } finally {
    if (yield cancelled()) {
      subscriptionChannel.close();
      subscription.close();
    } else {
      console.log('Subscription disconnected: Balance');
    }
  }
}

/**
 * initialize LiveQuery for balances
 * @param {array} tokens Array of Coin class instance
 */
function* initLiveQueryBalancesRequest(action) {
  const { tokens } = action;
  yield call(fetchBalances, tokens);
  yield call(subscribeBalances, tokens);
}


function addTokenTransaction(token, transaction, operation) {
  const newToken = token;
  newToken.transactions = newToken.transactions || [];
  const txIndex = _.findIndex(newToken.transactions, { hash: transaction.hash });
  if (txIndex === -1) {
    if (operation === 'unshift') {
      newToken.transactions.unshift(transaction);
    } else {
      newToken.transactions.push(transaction);
    }
  } else {
    newToken.transactions[txIndex] = transaction;
  }
}

function* updateTransactionRequest(action) {
  const { transaction } = action;
  const state = yield select();
  const walletManager = state.Wallet.get('walletManager');
  const tokens = walletManager.getTokens();

  const foundTokens = _.filter(tokens, (item) => item.address === transaction.from || item.address === transaction.to);
  _.each(foundTokens, (token) => {
    addTokenTransaction(token, transaction, 'unshift');
  });
  return put({ type: actions.WALLETS_UPDATED });
}

/**
 * Subscribe transactions of tokens
 * @param {object} subscription parse subscription
 */
function createTransactionsSubscriptionChannel(subscription) {
  return eventChannel((emitter) => {
    const subscribeHandler = () => {
      console.log('createTransactionsSubscriptionChannel.subscribeHandler.');
    };
    const unsubscribeHandler = () => {
      ParseHelper.unsubscribe(subscription);
      console.log('createTransactionsSubscriptionChannel.unsubscribeHandler.');
    };
    const updateHandler = (item) => {
      console.log('createTransactionsSubscriptionChannel.updateHandler', item);
      const transaction = parseDataUtil.getTransaction(item);
      return emitter({ type: actions.UPDATE_TRANSACTION, transaction });
    };
    const errorHandler = (error) => {
      console.log('createTransactionsSubscriptionChannel.errorHandler', error);
    };
    subscription.on('open', subscribeHandler);
    subscription.on('update', updateHandler);
    subscription.on('error', errorHandler);
    subscription.on('create', updateHandler);

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

/**
 * Fetch transactions of token sand update property of each addresss
 * @param {array} tokens Array of Coin class instance
 */
function* fetchTransactions(action) {
  const {
    token, fetchCount, skipCount, timestamp,
  } = action.payload;
  const { symbol, address } = token;
  try {
    const transactions = yield call(ParseHelper.fetchTransactions, symbol, address, skipCount, fetchCount);
    token.transactions = token.transactions || [];
    _.each(transactions, (transaction) => {
      addTokenTransaction(token, transaction, 'push');
    });
  } catch (error) {
    console.log('initLiveQueryTransactionsRequest.fetchTransactions, error:', error);
  } finally {
    yield put({ type: actions.FETCH_TRANSACTIONS_RESULT, timestamp });
  }
}

/**
 * Subscribe transactions of tokens
 * @param {array} tokens Array of Coin class instance
 */
function* subscribeTransactions(tokens) {
  let subscription;
  let subscriptionChannel;
  try {
    const state = yield select();
    subscription = yield call(ParseHelper.subscribeTransactions, tokens);
    subscriptionChannel = yield call(createTransactionsSubscriptionChannel, subscription);
    // If there is already a channel here, cancel the previous channel and save the new channel.
    const transactionsChannel = state.Wallet.get('transactionsChannel');
    if (transactionsChannel) {
      transactionsChannel.close();
    }
    yield put({ type: actions.SET_TRANSACTIONS_CHANNEL, value: subscriptionChannel });
    while (true) {
      const payload = yield take(subscriptionChannel);
      yield put(payload);
    }
  } catch (err) {
    console.log('Subscription error:', err);
  } finally {
    if (yield cancelled()) {
      subscriptionChannel.close();
      subscription.close();
    } else {
      console.log('Subscription disconnected: Transactions');
    }
  }
}

/**
 * initialize LiveQuery for transactions
 * @param {array} tokens Array of Coin class instance
 */
function* initLiveQueryTransactionsRequest(action) {
  const { tokens } = action;
  yield call(subscribeTransactions, tokens);
}

/**
 * create block height subscription channel
 * @param {object} subscription parse subscription
 * @returns unsubscribe handler
 */
function createBlockHeightSubscriptionChannel(subscription) {
  return eventChannel((emitter) => {
    const unsubscribeHandler = () => {
      ParseHelper.unsubscribe(subscription);
      console.log('createBlockHeightSubscriptionChannel.unsubscribeHandler.');
    };
    const updateHandler = (item) => {
      console.log('createBlockHeightSubscriptionChannel.updateHandler', item);
      const blockHeight = parseDataUtil.getBlockHeight(item);
      return emitter({
        type: actions.UPDATE_LATEST_BLOCK_HEIGHT,
        value: blockHeight,
      });
    };
    subscription.on('update', updateHandler);

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

/**
 * Fetch block heights
 */
function* fetchBlockHeights() {
  try {
    const blockHeights = yield call(ParseHelper.fetchBlockHeights);
    yield put({
      type: actions.FETCH_LATEST_BLOCK_HEIGHT_RESULT,
      value: blockHeights,
    });
  } catch (error) {
    console.log('initLiveQueryTransactionsRequest.fetchBlockHeights, error:', error);
  }
}

/**
 * Subscribe block heights
 */
function* subscribeBlockHeights() {
  let subscription;
  let subscriptionChannel;
  try {
    subscription = yield call(ParseHelper.subscribeBlockHeights);
    subscriptionChannel = yield call(createBlockHeightSubscriptionChannel, subscription);
    yield put({ type: actions.SET_TRANSACTIONS_CHANNEL, value: subscriptionChannel });
    while (true) {
      const payload = yield take(subscriptionChannel);
      yield put(payload);
    }
  } catch (err) {
    console.log('Subscription error:', err);
  } finally {
    if (yield cancelled()) {
      subscriptionChannel.close();
      subscription.close();
    } else {
      console.log('Subscription disconnected: Transactions');
    }
  }
}

/**
 * initialize LiveQuery for block heights
 */
function* initLiveQueryBlockHeightsRequest() {
  yield call(fetchBlockHeights);
  yield call(subscribeBlockHeights);
}


export default function* () {
  yield all([
    takeEvery(actions.DELETE_KEY, deleteKeyRequest),
    takeEvery(actions.RENAME_KEY, renameKeyRequest),
    takeEvery(actions.CREATE_KEY, createKeyRequest),
    takeEvery(actions.ADD_TOKEN, addTokenRequest),
    takeEvery(actions.DELETE_TOKEN, deleteTokenRequest),

    takeEvery(actions.GET_SWAP_RATE, getSwapRateRequest),

    takeEvery(actions.INIT_LIVE_QUERY_BALANCES, initLiveQueryBalancesRequest),
    takeEvery(actions.INIT_LIVE_QUERY_TRANSACTIONS, initLiveQueryTransactionsRequest),
    takeEvery(actions.INIT_LIVE_QUERY_BLOCK_HEIGHTS, initLiveQueryBlockHeightsRequest),

    takeEvery(actions.FETCH_TRANSACTIONS, fetchTransactions),
    takeEvery(actions.UPDATE_TRANSACTION, updateTransactionRequest),
  ]);
}

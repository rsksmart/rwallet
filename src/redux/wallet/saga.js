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
import SharedWallet from '../../common/wallet/shared.wallet';

import { createErrorNotification } from '../../common/notification.controller';
import { BtcAddressType, PROPOSAL_STATUS } from '../../common/constants';

function* createKeyRequest(action) {
  const {
    name, phrase, coins, walletManager, derivationPaths,
  } = action.payload;
  try {
    yield call(walletManager.createWallet, name, phrase, coins, derivationPaths);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    const tokens = walletManager.getTokens();
    yield put({ type: actions.INIT_LIVE_QUERY_TOKENS, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (err) {
    console.warn(err.message);
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
    yield put({ type: actions.INIT_LIVE_QUERY_TOKENS, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (err) {
    console.warn(err.message);
  }
}

function* renameKeyRequest(action) {
  const { walletManager, key, name } = action.payload;
  try {
    yield call(walletManager.renameWallet, key, name);
    yield put({ type: actions.WALLET_NAME_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
  } catch (err) {
    console.warn(err.message);
    const notification = createErrorNotification('modal.incorrectKeyName.title', err.message);
    yield put(appActions.addNotification(notification));
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
    yield put({ type: actions.INIT_LIVE_QUERY_TOKENS, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (error) {
    console.log(error);
    if (error.message === 'err.exsistedtoken') {
      yield put({ type: actions.SET_ADD_TOKEN_RESULT, value: { state: 'error', error } });
    }
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
    yield put({ type: actions.INIT_LIVE_QUERY_TOKENS, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (err) {
    console.error(err.message);
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
function createTokensSubscriptionChannel(subscription) {
  return eventChannel((emitter) => {
    const subscribeHandler = () => emitter({ type: actions.FETCH_TOKENS });
    const unsubscribeHandler = () => {
      ParseHelper.unsubscribe(subscription);
      console.log('createBalancesSubscriptionChannel.unsubscribeHandler.');
    };
    const updateHandler = (object) => {
      console.log('createBalancesSubscriptionChannel.updateHandler, object: ', object);
      const balance = parseDataUtil.getToken(object);
      return emitter({ type: actions.FETCH_TOKENS_RESULT, value: [balance] });
    };

    subscription.on('open', subscribeHandler);
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
function* fetchTokensRequest() {
  try {
    const state = yield select();
    const walletManager = state.Wallet.get('walletManager');
    const tokens = walletManager.getTokens();
    const response = yield call(ParseHelper.fetchTokens, tokens);
    yield put({
      type: actions.FETCH_TOKENS_RESULT,
      value: response,
    });
  } catch (error) {
    console.log('fetchTokensRequest, error:', error);
  }
}

/**
 * Subscribe balances of tokens
 * @param {object} subscription parse subscription
 */
function* subscribeTokens(tokens) {
  let subscription;
  let subscriptionChannel;
  try {
    const state = yield select();
    subscription = yield call(ParseHelper.subscribeTokens, tokens);
    subscriptionChannel = yield call(createTokensSubscriptionChannel, subscription);
    // If there is already a channel here, cancel the previous channel and save the new channel.
    const tokensChannel = state.Wallet.get('tokensChannel');
    if (tokensChannel) {
      tokensChannel.close();
    }
    yield put({ type: actions.SET_TOKENS_CHANNEL, value: subscriptionChannel });
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
      console.log('Subscription disconnected: Tokens');
    }
  }
}

/**
 * initialize LiveQuery for balances
 * @param {array} tokens Array of Coin class instance
 */
function* initLiveQueryTokensRequest(action) {
  const { tokens } = action;
  yield call(subscribeTokens, tokens);
}

function addTokenTransactions(token, transactions) {
  const newToken = token;
  newToken.transactions = newToken.transactions || [];
  _.each(transactions, (transaction) => {
    const txIndex = _.findIndex(newToken.transactions, { hash: transaction.hash });
    if (txIndex === -1) {
      newToken.transactions.push(transaction);
    } else {
      newToken.transactions[txIndex] = transaction;
    }
  });
  // sort transactions. If dateTime is nil, put it to tail.
  newToken.transactions = newToken.transactions.sort((a, b) => ((!a.dateTime || a.dateTime < b.dateTime) ? 1 : -1));
}

function* updateTransactionRequest(action) {
  const { transaction } = action;
  const state = yield select();
  const walletManager = state.Wallet.get('walletManager');
  const tokens = walletManager.getTokens();

  const foundTokens = _.filter(tokens, (item) => item.symbol === transaction.symbol
   && item.type === transaction.type
   && (item.address === transaction.from || item.address === transaction.to));
  _.each(foundTokens, (token) => {
    addTokenTransactions(token, [transaction]);
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
  const { symbol, type, address } = token;
  try {
    const transactions = yield call(ParseHelper.fetchTransactions, symbol, type, address, skipCount, fetchCount);
    token.transactions = token.transactions || [];
    addTokenTransactions(token, transactions);
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
    const subscribeHandler = () => emitter({ type: actions.FETCH_LATEST_BLOCK_HEIGHT });
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
    subscription.on('open', subscribeHandler);
    subscription.on('update', updateHandler);
    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

/**
 * Fetch block heights
 */
function* fetchBlockHeightsRequest() {
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
    const state = yield select();
    subscription = yield call(ParseHelper.subscribeBlockHeights);
    subscriptionChannel = yield call(createBlockHeightSubscriptionChannel, subscription);

    // When resubscribing we need to close the last channel
    const blockHeightsChannel = state.Wallet.get('blockHeightsChannel');
    if (blockHeightsChannel) {
      blockHeightsChannel.close();
    }
    yield put({ type: actions.SET_BLOCK_HEIGHTS_CHANNEL, value: subscriptionChannel });

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
      console.log('Subscription disconnected: subscribeBlockHeights');
    }
  }
}

/**
 * initialize LiveQuery for block heights
 */
function* initLiveQueryBlockHeightsRequest() {
  yield call(subscribeBlockHeights);
}

/**
 * get balance request
 */
function* getBalanceRequest(action) {
  try {
    const { address, symbol } = action.payload;
    const balance = yield call(ParseHelper.getBalance, action.payload);
    const item = { balance, address, symbol };
    yield put({ type: actions.FETCH_TOKENS_RESULT, value: [item] });
  } catch (error) {
    console.log('getBalanceRequest, error:', error);
  }
}

function* createReadOnlyWalletRequest(action) {
  const {
    chain, type, address, coins,
  } = action.payload;
  try {
    const state = yield select();
    const currency = state.App.get('currency');
    const prices = state.Price.get('prices');
    const walletManager = state.Wallet.get('walletManager');
    yield call(walletManager.createReadOnlyWallet, chain, type, address, coins);
    yield put({ type: actions.UPDATE_ASSET_VALUE, payload: { currency, prices } });
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    const tokens = walletManager.getTokens();
    yield put({ type: actions.INIT_LIVE_QUERY_TOKENS, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (err) {
    console.warn(err.message);
  }
}

function* addMultisigBTC(action) {
  const {
    wallet, invitationCode, type,
  } = action.payload;
  const state = yield select();
  const walletManager = state.Wallet.get('walletManager');
  try {
    yield call(wallet.addToken, { invitationCode, type });
    yield put({ type: actions.WALLETS_UPDATED });
    yield call(walletManager.serialize);
  } catch (error) {
    console.log(error);
  }
}

function* setMultisigBTCAddressRequest(action) {
  const { token, address } = action.payload;
  console.log('setMultisigBTCAddressRequest, address: ', address);
  try {
    const state = yield select();
    const walletManager = state.Wallet.get('walletManager');
    token.address = address;
    yield call(walletManager.serialize);
    yield put({ type: actions.WALLETS_UPDATED });
    yield put({ type: appActions.UPDATE_USER });
    const tokens = walletManager.getTokens();
    yield put({ type: actions.INIT_LIVE_QUERY_TOKENS, tokens });
    yield put({ type: actions.INIT_LIVE_QUERY_TRANSACTIONS, tokens });
  } catch (error) {
    console.log(error);
  }
}

function* createSharedWalletRequest(action) {
  const {
    phrase, coin, multisigParams,
  } = action.payload;
  const state = yield select();
  const walletManager = state.Wallet.get('walletManager');
  try {
    const { type, addressType } = coin;
    const {
      signatureNumber, copayerNumber, userName, walletName,
    } = multisigParams;

    const wallet = new SharedWallet({
      id: walletManager.currentKeyId, name: walletName, mnemonic: phrase, type,
    });
    wallet.createTokensFromSeed([], []);

    const derivation = wallet.derivations[0];
    derivation.addressType = addressType;
    const { publicKey } = derivation;

    const params = {
      signatureNumber, copayerNumber, publicKey, type, name: userName, walletName,
    };

    const result = yield call(ParseHelper.createMultisigAddress, params);
    console.log('result: ', result);
    const invitationCode = result.get('invitationCode');

    walletManager.currentKeyId += 1;
    walletManager.wallets.unshift(wallet);

    // Add token
    yield call(wallet.addToken, {
      invitationCode, type, signatureNumber, copayerNumber,
    });

    // Save to storage
    SharedWallet.savePhrase(wallet.id, wallet.mnemonic);
    yield put({ type: actions.WALLETS_UPDATED });
    yield call(walletManager.serialize);
  } catch (error) {
    console.warn('createSharedWalletRequest, error: ', error);
  }
}

function* joinSharedWalletRequest(action) {
  const { phrase, multisigParams } = action.payload;
  const state = yield select();
  const walletManager = state.Wallet.get('walletManager');
  try {
    const {
      invitationCode, userName, walletName, type, signatureNumber, copayerNumber,
    } = multisigParams;

    const wallet = new SharedWallet({
      id: walletManager.currentKeyId, walletName, mnemonic: phrase, type,
    });
    wallet.createTokensFromSeed([], []);

    const derivation = wallet.derivations[0];
    derivation.addressType = BtcAddressType.legacy;
    const { publicKey } = derivation;
    const result = yield call(ParseHelper.joinMultisigAddress, {
      invitationCode, publicKey, name: userName,
    });
    console.log('result: ', result);

    walletManager.currentKeyId += 1;
    walletManager.wallets.unshift(wallet);

    // Add token
    yield call(wallet.addToken, {
      invitationCode, type, signatureNumber, copayerNumber,
    });

    // Save to storage
    SharedWallet.savePhrase(wallet.id, wallet.mnemonic);
    yield put({ type: actions.WALLETS_UPDATED });
    yield call(walletManager.serialize);
  } catch (error) {
    console.warn('joinSharedWalletRequest, error: ', error);
  }
}

function* updateProposal(action) {
  const { proposal } = action;
  const state = yield select();
  const walletManager = state.Wallet.get('walletManager');
  const multisigWallets = walletManager.getMultisigWallets();
  for (let i = 0; i < multisigWallets.length; i += 1) {
    const wallet = multisigWallets[i];
    const coin = wallet.coin[0];
    if (proposal.multiSigAddress === coin.address) {
      coin.proposal = proposal.status === PROPOSAL_STATUS.PENDING ? proposal : null;
    }
  }
  yield put({ type: actions.WALLETS_UPDATED });
}

function createPendingProposalChannel(subscription, tokens) {
  return eventChannel((emitter) => {
    const subscribeHandler = () => {
      console.log('createPendingProposalChannel.subscribeHandler.');
      return emitter(actions.fetchPendingProposals(tokens));
    };
    const unsubscribeHandler = () => {
      ParseHelper.unsubscribe(subscription);
      console.log('createPendingProposalChannel.unsubscribeHandler.');
    };
    const updateHandler = (item) => {
      console.log('createPendingProposalChannel.updateHandler', item);
      const proposal = parseDataUtil.getProposal(item);
      return emitter(actions.updateProposal(proposal));
    };
    const deleteHandler = (item) => {
      console.log('createPendingProposalChannel.deleteHandler', item);
      const proposal = parseDataUtil.getProposal(item);
      return emitter(actions.updateProposal(proposal));
    };
    const errorHandler = (error) => {
      console.log('createPendingProposalChannel.errorHandler', error);
    };
    subscription.on('open', subscribeHandler);
    subscription.on('update', updateHandler);
    subscription.on('error', errorHandler);
    subscription.on('create', updateHandler);
    subscription.on('delete', deleteHandler);

    // unsubscribe function, this gets called when we close the channel
    return unsubscribeHandler;
  });
}

function* fetchPendingProposals(action) {
  const { tokens } = action.payload;
  const addresses = _.map(tokens, (token) => token.address);
  try {
    const proposals = yield call(ParseHelper.fetchPendingProposals, addresses);
    _.each(tokens, (token) => {
      const newToken = token;
      newToken.proposal = null;
    });
    _.each(proposals, (proposal) => {
      const { multiSigAddress } = proposal;
      const token = _.find(tokens, { address: multiSigAddress });
      token.proposal = proposal;
    });
    yield put({ type: actions.WALLETS_UPDATED });
  } catch (error) {
    console.log('fetchPendingProposal, error:', error);
  }
}

function* initLiveQueryPendingProposals() {
  let subscription;
  let subscriptionChannel;
  try {
    const state = yield select();
    const walletManager = state.Wallet.get('walletManager');
    const multisigWallets = walletManager.getMultisigWallets();
    const tokens = _.map(multisigWallets, (wallet) => wallet.coins[0]);
    const addresses = _.map(tokens, (token) => token.address);
    subscription = yield call(ParseHelper.subscribePendingProposals, addresses);
    subscriptionChannel = yield call(createPendingProposalChannel, subscription, tokens);
    // If there is already a channel here, cancel the previous channel and save the new channel.
    const pendingProposalChannel = state.Wallet.get('pendingProposalChannel');
    if (pendingProposalChannel) {
      pendingProposalChannel.close();
    }
    yield put(actions.setPendingProposalsChannel(subscriptionChannel));
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
      console.log('Subscription disconnected: PendingProposals');
    }
  }
}

export default function* () {
  yield all([
    takeEvery(actions.DELETE_KEY, deleteKeyRequest),
    takeEvery(actions.RENAME_KEY, renameKeyRequest),
    takeEvery(actions.CREATE_KEY, createKeyRequest),
    takeEvery(actions.ADD_TOKEN, addTokenRequest),
    takeEvery(actions.DELETE_TOKEN, deleteTokenRequest),

    takeEvery(actions.GET_SWAP_RATE, getSwapRateRequest),

    takeEvery(actions.INIT_LIVE_QUERY_TOKENS, initLiveQueryTokensRequest),
    takeEvery(actions.INIT_LIVE_QUERY_TRANSACTIONS, initLiveQueryTransactionsRequest),
    takeEvery(actions.INIT_LIVE_QUERY_BLOCK_HEIGHTS, initLiveQueryBlockHeightsRequest),

    takeEvery(actions.FETCH_TRANSACTIONS, fetchTransactions),
    takeEvery(actions.UPDATE_TRANSACTION, updateTransactionRequest),

    takeEvery(actions.FETCH_TOKENS, fetchTokensRequest),
    takeEvery(actions.FETCH_LATEST_BLOCK_HEIGHT, fetchBlockHeightsRequest),

    takeEvery(actions.GET_BALANCE, getBalanceRequest),
    takeEvery(actions.CREATE_READ_ONLY_WALLET, createReadOnlyWalletRequest),

    takeEvery(actions.ADD_MULTISIG_BTC, addMultisigBTC),
    takeEvery(actions.SET_MULTISIG_BTC_ADDRESS, setMultisigBTCAddressRequest),
    takeEvery(actions.CREATE_SHARED_WALLET, createSharedWalletRequest),
    takeEvery(actions.JOIN_SHARED_WALLET, joinSharedWalletRequest),

    takeEvery(actions.INIT_LIVE_QUERY_PENDING_PROPOSALS, initLiveQueryPendingProposals),
    takeEvery(actions.FETCH_PENDING_PROPOSALS, fetchPendingProposals),
    takeEvery(actions.UPDATE_PROPOSAL, updateProposal),
  ]);
}

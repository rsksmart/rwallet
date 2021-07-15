import _ from 'lodash';
import Parse from 'parse/react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VersionNumber from 'react-native-version-number';
import config from '../../config';
import parseDataUtil from './parseDataUtil';
import { blockHeightKeys } from './constants';
import actions from '../redux/app/actions';
import common from './common';
import { ERROR_CODE } from './error';

const parseConfig = config && config.parse;

// If we are unable to load config, it means the config file is moved. Throw error to indicate that.
if (_.isUndefined(parseConfig)) {
  throw new Error('Unable to find config for Parse init. Check config file path!');
}

Parse.initialize(parseConfig.appId, parseConfig.javascriptKey);
Parse.CoreManager.set('REQUEST_HEADERS', { 'X-RWALLET-API-KEY': parseConfig.rwalletApiKey, 'X-RWALLET-VERSION': VersionNumber.appVersion });
Parse.serverURL = common.getServerUrl(parseConfig.serverURL, parseConfig.rwalletEnv);

// enable cached-user functions
// https://docs.parseplatform.org/js/guide/#current-user
Parse.User.enableUnsafeCurrentUser();
Parse.setAsyncStorage(AsyncStorage);

/** Parse Class definition */
// const ParseUser = Parse.User;
const ParseAddress = Parse.Object.extend('Address');
const ParseTransaction = Parse.Object.extend('Transaction');
const ParseDapp = Parse.Object.extend('Dapp');
const ParseAd = Parse.Object.extend('Advertisement');
const ParseSubdomain = Parse.Object.extend('Subdomain');

/**
 * ParseHelper is a helper class with static methods which wrap up Parse lib logic,
 * so that we don't need to reference ParseUser, ParseGlobal in other files
 */
class ParseHelper {
  static getServerUrl() {
    return Parse.serverURL;
  }

  // Get user from storage
  static async getUser() {
    const user = await Parse.User.currentAsync();
    return user;
  }

  static async signUp(username, password) {
    console.log(`ParseHelper.signUp, username: ${username}`);

    // Sign up
    const user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    await user.signUp();

    // Set user ACL
    // Protect user information from being read by others
    user.setACL(new Parse.ACL(user));
    await user.save();

    console.log(`ParseHelper.signUp success, username: ${username}`);

    return user;
  }

  static async signIn(username, password) {
    console.log(`ParseHelper.signIn, username: ${username}`);
    return Parse.User.logIn(username, password);
  }

  static async logOut() {
    console.log('ParseHelper.logOut');
    // If user is deleted on server, Parse.User.logOut(); will raise a error: 209, Invalid session token
    // Ignore the error.
    try {
      await Parse.User.logOut();
    } catch (error) {
      console.log('ParseHelper.logOut, error: ', error.message);
      if (error.code !== Parse.Error.INVALID_SESSION_TOKEN) {
        throw error;
      }
    }
  }

  /**
   * Save User object with wallets and settings and overwrite existing fields in database
   * For wallets, only save addresses to Users.wallets field, and create one row for each address in Address class
   * For settings, save JSON data into Users.settings
   * @param {*} param0
   * @param {array} param0.wallets
   * @param {array} param0.settings
   * @returns {parseUser} saved User
   */
  static async updateUser({
    wallets, settings, fcmToken, deviceId,
  }) {
    const parseUser = await ParseHelper.getUser();
    await parseUser.fetch();

    // Only set settings when it's defined.
    if (_.isObject(settings)) {
      parseUser.set('settings', settings);
    }

    if (!_.isNil(fcmToken)) {
      parseUser.set('fcmToken', fcmToken);
    }

    if (!_.isNil(deviceId)) {
      parseUser.set('deviceId', deviceId);
    }

    if (!_.isEmpty(VersionNumber.appVersion)) {
      parseUser.set('clientVersion', VersionNumber.appVersion);
    }

    // Only set wallets when it's defined.
    if (_.isArray(wallets)) {
      // 1. Save Address into database if Coin has no objectId
      // After save, add objectId to Coin instance
      let promises = [];

      // 2. At the same time, add links to newly created Address object to User.wallets
      _.each(wallets, ({ coins }) => {
        promises = promises.concat(coins.map((coin) => {
          // Check if ParseAddress with coin.objectId exists
          const query = new Parse.Query(ParseAddress);
          return query.get(coin.objectId)
            .then((existingParseAddress) => Promise.resolve(existingParseAddress), async (err) => {
              if (err.message === 'Object not found.') {
                // If ParseAddress not exists then we will create a new one and saved to User.wallets
                const {
                  address, chain, type, symbol,
                } = coin;

                // If same address already exist, then use it
                const existAddrQuery = new Parse.Query(ParseAddress);
                const existAddr = await existAddrQuery
                  .equalTo('address', address)
                  .equalTo('chain', chain)
                  .equalTo('type', type)
                  .equalTo('symbol', symbol)
                  .first();
                if (existAddr) {
                  return existAddr;
                }

                const parseAddress = new ParseAddress()
                  .set('chain', chain)
                  .set('type', type)
                  .set('symbol', symbol)
                  .set('address', address);

                return parseAddress.save().then((savedParseAddress) => {
                  console.log(`updateUser, ${coin.objectId} is not found; created a new address ${savedParseAddress.id}.`);
                  return Promise.resolve(savedParseAddress);
                }, (error) => {
                  console.warn('updateUser', error.message);
                  return Promise.resolve();
                });
              }

              return Promise.resolve();
            });
        }));
      });

      let parseAddresses = await Promise.all(promises);
      parseAddresses = _.filter(parseAddresses, (item) => !_.isUndefined(item));
      parseUser.set('wallets', parseAddresses);
    }

    // Only save parseUser when it's dirty.
    // https://parseplatform.org/Parse-SDK-JS/api/v1.11.1/Parse.Object.html#dirty
    if (parseUser.dirty()) {
      console.log(`ParseHelper.updateUser, ${parseUser.dirty('wallets') && 'wallets'} ${parseUser.dirty('settings') && 'settings'} will be uploaded to server.`);
      return parseUser.save();
    }

    return parseUser;
  }

  /**
   * Send a raw transaction to server
   * @param {*} name Blockchain name, e.g. Bitcoin or Rootstock
   * @param {*} hash 0xf8692...dead0a,
   * @param {*} type Mainnet or Testnet
   */
  static sendSignedTransaction(name, hash, type) {
    return Parse.Cloud.run('sendSignedTransaction', { name, hash, type });
  }

  static getServerInfo(osType, language) {
    return Parse.Cloud.run('getServerInfo', { osType, language });
  }

  /**
   * get balance of given addrArray which is array of addresses
   * @param {array} addrArray
   * @returns {array} collection of each given address information include balance,etc...
   */
  static async getBalanceByAddress(addrArray) {
    const Address = Parse.Object.extend('Address'); // 建立Address这个表的query
    const query = new Parse.Query(Address);
    query.containedIn('address', addrArray);
    // 实际运行query
    return query.find();
  }

  static getTokensQuery(tokens) {
    const addresses = _.uniq(_.map(tokens, 'address'));
    const query = new Parse.Query(ParseAddress);
    query.containedIn('address', addresses);
    return query;
  }

  /**
   * Get token of parseObject and update property of each addresss
   * @param {array} tokens Array of Coin class instance
   * @returns {array} e.g. [{objectId, balance(hex string)}]
   */
  static async fetchTokens(tokens) {
    const query = ParseHelper.getTokensQuery(tokens);
    let results = await query.find();
    results = _.map(results, (token) => parseDataUtil.getToken(token));
    console.log('fetchTokens, results: ', results);
    return results;
  }

  /**
   * Subscribe to tokens Live Query channel
   */
  static async subscribeTokens(tokens) {
    const query = ParseHelper.getTokensQuery(tokens);
    console.log('query: ', query);
    const subscription = await query.subscribe();
    return subscription;
  }

  /**
   * Fetch transactions of parseObject and update property of each addresss
   *
   * @static
   * @param {array} tokens Array of Coin class instance
   * @memberof ParseHelper
   */
  static async fetchTransactions(symbol, type, address, skipCount, fetchCount) {
    const queryFrom = new Parse.Query(ParseTransaction);
    queryFrom.equalTo('from', address.toLowerCase());
    const queryTo = new Parse.Query(ParseTransaction);
    queryTo.equalTo('to', address.toLowerCase());
    const query = Parse.Query.or(queryFrom, queryTo)
      .equalTo('type', type)
      .equalTo('symbol', symbol)
      .descending('createdAt');
    const results = await query.skip(skipCount).limit(fetchCount).find();
    const transactions = _.map(results, (item) => {
      const transaction = parseDataUtil.getTransaction(item);
      const isSender = address.toLowerCase() === transaction.from.toLowerCase();
      return parseDataUtil.getTransactionViewData(transaction, isSender);
    });
    return transactions;
  }

  /**
   * Subscribe to transactions Live Query channel
   * @param {*} tokens
   */
  static async subscribeTransactions(tokens) {
    const addresses = (_.uniq(_.map(tokens, 'address'))).map((address) => address.toLowerCase());
    const queryFrom = new Parse.Query(ParseTransaction);
    queryFrom.containedIn('from', addresses);
    const queryTo = new Parse.Query(ParseTransaction);
    queryTo.containedIn('to', addresses);
    const query = Parse.Query.or(queryFrom, queryTo);
    const subscription = await query.subscribe();
    return subscription;
  }

  static requestCoinswitchAPI(type, coinswitchParams = {}) {
    const { deposit, destination } = coinswitchParams;
    let method; let path; let params;
    switch (type) {
      case 'coins':
        method = 'get';
        path = 'coins';
        break;
      case 'pairs':
        method = 'post';
        path = 'pairs';
        params = [];
        if (deposit) {
          params.push({ key: 'depositCoin', value: deposit });
        }
        if (destination) {
          params.push({ key: 'destinationCoin', value: destination });
        }
        break;
      case 'rate':
        method = 'post';
        path = 'rate';
        params = [{ key: 'depositCoin', value: deposit }, { key: 'destinationCoin', value: destination }];
        break;
      case 'order':
        method = 'post';
        path = 'order';
        params = [{ key: 'depositCoin', value: deposit },
          { key: 'destinationCoin', value: destination },
          { key: 'depositCoinAmount', value: coinswitchParams.amount },
          { key: 'destinationAddress', value: coinswitchParams.destinationAddress },
          { key: 'refundAddress', value: coinswitchParams.refundAddress },
        ];
        break;
      default:
    }
    const options = { method, path };
    if (params) {
      options.params = params;
    }
    return Parse.Cloud.run('coinswitch', options);
  }

  static getTokenBasicInfo(type, chain, address) {
    console.log(`getTokenBasicInfo, type: ${type}, chain: ${chain}, address: ${address}`);
    return Parse.Cloud.run('getTokenBasicInfo', { type, chain, address });
  }

  static saveToken(type, chain, address) {
    return Parse.Cloud.run('saveToken', { type, chain, address });
  }

  static getTransactionFees(symbol, type, sender, receiver, value, memo) {
    return Parse.Cloud.run('getTransactionFees', {
      symbol, type, sender, receiver, value, memo,
    });
  }

  static getBtcTransactionFees(symbol, type, size) {
    return Parse.Cloud.run('getTransactionFees', {
      symbol, type, size,
    });
  }

  static getUserTokenBalance(type, chain, contractAddress, address) {
    console.log(`getUserTokenBalance, type:${type}, chain: ${chain}, contractAddress: ${contractAddress}, address: ${address}`);
    return Parse.Cloud.run('getUserTokenBalance', {
      type, chain, tokenAddress: contractAddress, userAddress: address,
    });
  }

  static sendErrorReport(error) {
    return Parse.Cloud.run('logError', { error });
  }

  /**
   * Subscribe to a Live Query channel also-known-as Parse Class
   * @param {*} collection
   */
  static async subscribePrice() {
    const query = new Parse.Query('Global');
    query.equalTo('key', 'price');
    const subscription = await query.subscribe();
    return subscription;
  }

  static async fetchPrices() {
    const query = new Parse.Query('Global');
    const priceObj = await query.equalTo('key', 'price').first();
    const prices = parseDataUtil.getPrices(priceObj);
    return prices;
  }

  static async subscribeBlockHeights() {
    const query = new Parse.Query('Global');
    query.containedIn('key', blockHeightKeys);
    const subscription = await query.subscribe();
    return subscription;
  }

  static async fetchBlockHeights() {
    const query = new Parse.Query('Global');
    query.containedIn('key', blockHeightKeys);
    const rows = await query.find();
    const blockHeights = rows.map(parseDataUtil.getBlockHeight);
    return blockHeights;
  }

  static createSubdomain(params) {
    return Parse.Cloud.run('createSubdomain', params);
  }

  static async isSubdomainAvailable(params) {
    return Parse.Cloud.run('isSubdomainAvailable', params);
  }

  static async fetchRegisteringRnsSubdomains(records) {
    const addresses = _.map(records, (record) => record.address);
    const subdomains = _.map(records, 'subdomain');
    const query = new Parse.Query(ParseSubdomain);
    const result = await query.containedIn('address', addresses)
      .containedIn('subdomain', subdomains)
      .ascending('createdAt')
      .find();
    const status = parseDataUtil.getSubdomainStatus(result, records);
    return status;
  }

  static unsubscribe(subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  static async fetchDapps() {
    const query = new Parse.Query(ParseDapp);
    query.equalTo('isActive', true);
    const rows = await query.find();
    const dapps = _.map(rows, (row) => parseDataUtil.getDapp(row));
    return dapps;
  }

  static async fetchDappTypes() {
    const query = new Parse.Query('Global');
    const dappTypesObj = await query.equalTo('key', 'dappTypes').first();
    const dappTypes = parseDataUtil.getDappTypes(dappTypesObj);
    return dappTypes;
  }

  static async fetchAdvertisements() {
    const query = new Parse.Query(ParseAd);
    query.equalTo('isActive', true);
    const rows = await query.find();
    const ads = _.map(rows, (row) => parseDataUtil.getAdvertisement(row));

    // using momentjs to filter advertisements because "OR" statement need to new extra Parse.Query object
    const current = moment();
    const filterAds = _.filter(ads, (ad) => {
      // If start time is not set, it means active immediately
      const start = ad.start ? moment(ad.start) : current;

      // If end time is not set, it means awalys active
      const end = ad.end ? moment(ad.end) : current;
      return current.isSameOrAfter(start) && current.isSameOrBefore(end);
    });
    return filterAds;
  }

  /**
   * getBalance
   * @param {object} { type, symbol, address, needFetch }. If needFetch is true, back-end will refresh transactions and balance.
   * @returns {string} the hex amount of balance
   */
  static async getBalance({
    type, symbol, address, needFetch,
  }) {
    const params = {
      type, symbol, address, needFetch,
    };
    try {
      return await Parse.Cloud.run('getBalance', params);
    } catch (error) {
      if (error.code === ERROR_CODE.ERR_SYMBOL_NOT_FOUND) {
        return '0x0';
      }
      throw error;
    }
  }

  static async updateTokenBalance(tokens) {
    const params = {
      tokenList: tokens,
    };
    const addressObjects = await Parse.Cloud.run('updateTokenBalance', params);
    return _.map(addressObjects, (addressObject) => parseDataUtil.getToken(addressObject));
  }

  /**
   * getInputAddressTXHash, get transaction input hash array
   * @param {*} address
   * @param {*} type
   * @param {*} value, Amount transferred
   * @returns {array} transaction hash array
   */
  static getInputAddressTXHash = async (address, type, amount) => Parse.Cloud.run('getInputAddressTXHash', { address, type, value: amount })

  /**
   * Get Address info
   * @param {*} symbol
   * @param {*} type
   * @param {*} address
   * @returns {object} address info
   */
  static getAddress = async (symbol, type, address) => Parse.Cloud.run('getAddress', { symbol, type, address });
}

// Create parse helper proxy to add global error handling
const ParseHelperProxy = new Proxy(ParseHelper, {
  get(target, propKey, receiver) {
    const targetValue = Reflect.get(target, propKey, receiver);
    if (typeof targetValue === 'function') {
      const func = (...args) => {
        const result = targetValue.apply(this, args);
        // If result is not a promise, return directly.
        if (!(result instanceof Promise)) {
          return result;
        }
        // If result is a promise, return a wrapper promise which will catch and handle INVALID_SESSION_TOKEN error.
        const promise = new Promise((resolve, reject) => {
          result.then((data) => resolve(data)).catch((error) => {
            console.log(`ParseHelperProxy, propKey: ${propKey}, error.code: ${error.code}, error.message: `, error.message);
            // When the session expires, we need to relogin
            if (error.code === Parse.Error.INVALID_SESSION_TOKEN) {
              common.getStore().dispatch(actions.relogin());
            }
            reject(error);
          });
        });
        return promise;
      };
      return func;
    }
    return targetValue;
  },
});

export default ParseHelperProxy;

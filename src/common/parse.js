import _ from 'lodash';
import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config';
import parseDataUtil from './parseDataUtil';
import definitions from './definitions';


const ERROR_PARSE_DEFAULT = 'error.parse.default';

const parseConfig = config && config.parse;

// If we are unable to load config, it means the config file is moved. Throw error to indicate that.
if (_.isUndefined(parseConfig)) {
  throw new Error('Unable to find config for Parse init. Check config file path!');
}

Parse.initialize(parseConfig.appId, parseConfig.javascriptKey);
Parse.CoreManager.set('REQUEST_HEADERS', { 'Rwallet-API-Key': parseConfig.rwalletApiKey });
Parse.serverURL = parseConfig.serverURL;
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
/**
 * ParseHelper is a helper class with static methods which wrap up Parse lib logic,
 * so that we don't need to reference ParseUser, ParseGlobal in other files
 */
class ParseHelper {
  // Get user from storage
  static async getUser() {
    const user = await Parse.User.currentAsync();
    return user;
  }

  static signInOrSignUp(appId) {
    // Set appId as username and password.
    // No real password is needed because we dont have user authencation in this app. We only want to get access to Parse.User here to access related data
    const username = appId;
    const password = appId;

    return Parse.User.logIn(username, password)
      .catch((err) => {
        if (err.message === 'Invalid username/password.') { // Call sign up if we can't log in using appId
          console.log(`User not found with appId ${username}. Signing up ...`);
          const user = new Parse.User();

          user.set('username', username);
          user.set('password', password);
          // console.log('DeviceInfo.getDeviceId()', DeviceInfo.getDeviceId());
          // user.set('deviceId', DeviceInfo.getDeviceId());

          // TODO: other information needed to be set here.
          return user.signUp();
        }

        return Promise.reject();
      });
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
  static async updateUser({ wallets, settings, fcmToken }) {
    const parseUser = await ParseHelper.getUser();
    await parseUser.fetch();

    // Only set settings when it's defined.
    if (_.isObject(settings)) {
      parseUser.set('settings', settings);
    }

    if (!_.isNil(fcmToken)) {
      parseUser.set('fcmToken', fcmToken);
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
   *
   * @param {object} param
   * @param {string} param.symbol Symbol of token
   * @param {string} param.type type of blockchain, Mainnet or Testnet
   * @param {string} param.sender from address
   * @param {string} param.receiver to address
   * @param {string} param.value amount of token to send
   * @param {string} param.data data field
   */
  static createRawTransaction({
    symbol, type, sender, receiver, value, data, preference,
  }) {
    console.log(`ParseHelper::createRawTransaction is called, symbol: ${symbol}, type: ${type}, sender: ${sender}, receiver: ${receiver}, value: ${value}, data: ${data}, preference: ${preference}`);
    return Parse.Cloud.run('createRawTransaction', {
      symbol, type, sender, receiver, value, data, preference,
    }).then((res) => {
      console.log(`ParseHelper::createRawTransaction received, res: ${JSON.stringify(res)}`);
      return Promise.resolve(res);
    }, (err) => {
      console.log(err);
      return Promise.reject(err);
    });
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

  static getServerInfo() {
    return Parse.Cloud.run('getServerInfo');
  }

  /**
   * Transform Parse errors to errors defined by this app
   * @param {object}     err        Parse error from response
   * @returns {object}  error object defined by this app
   * @method handleError
   */
  static async handleError({ err }) {
    console.log('handleError', err);
    if (!err) {
      return { message: ERROR_PARSE_DEFAULT };
    }

    const message = err.message || ERROR_PARSE_DEFAULT;

    switch (err.code) {
      case Parse.Error.INVALID_SESSION_TOKEN:
        console.log('INVALID_SESSION_TOKEN. Logging out');
        await Parse.User.logOut();
        break;
      default:
        break;
    }

    return { message };
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

  /**
   * Get balance of parseObject and update property of each addresss
   * @param {array} tokens Array of Coin class instance
   * @returns {array} e.g. [{objectId, balance(hex string)}]
   */
  static async fetchBalances(tokens) {
    const addresses = _.uniq(_.map(tokens, 'address'));
    const query = new Parse.Query(ParseAddress);
    query.containedIn('address', addresses);
    let results = await query.find();
    results = _.map(results, (token) => parseDataUtil.getBalance(token));
    console.log('fetchBalances, results: ', results);
    return results;
  }

  /**
   * Subscribe to balances Live Query channel
   */
  static async subscribeBalances(tokens) {
    const addresses = _.uniq(_.map(tokens, 'address'));
    const query = new Parse.Query(ParseAddress);
    query.containedIn('address', addresses);
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
  static async fetchTransactions(symbol, address, skipCount, fetchCount) {
    const queryFrom = new Parse.Query(ParseTransaction);
    queryFrom.equalTo('from', address);
    const queryTo = new Parse.Query(ParseTransaction);
    queryTo.equalTo('to', address);
    const querySymbol = new Parse.Query(ParseTransaction);
    querySymbol.equalTo('symbol', symbol);
    const query = Parse.Query.and(Parse.Query.or(queryFrom, queryTo), querySymbol).descending('createdAt');
    const results = await query.skip(skipCount).limit(fetchCount).find();
    const transactions = _.map(results, (item) => {
      const transaction = parseDataUtil.getTransaction(item);
      return transaction;
    });
    return transactions;
  }

  /**
   * Subscribe to transactions Live Query channel
   * @param {*} tokens
   */
  static async subscribeTransactions(tokens) {
    const addresses = _.uniq(_.map(tokens, 'address'));
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
    // eslint-disable-next-line default-case
    switch (type) {
      case 'coins':
        method = 'get';
        path = 'coins';
        break;
      case 'pairs':
        method = 'post';
        path = 'pairs';
        params = [];
        // eslint-disable-next-line no-unused-expressions
        deposit && params.push({ key: 'depositCoin', value: deposit });
        // eslint-disable-next-line no-unused-expressions
        destination && params.push({ key: 'destinationCoin', value: destination });
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
    }
    const options = { method, path };
    // eslint-disable-next-line no-unused-expressions
    params && (options.params = params);
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

  static getUserTokenBalance(type, chain, constractAddress, address) {
    console.log(`getUserTokenBalance, type:${type}, chain: ${chain}, constractAddress: ${constractAddress}, address: ${address}`);
    return Parse.Cloud.run('getUserTokenBalance', {
      type, chain, tokenAddress: constractAddress, userAddress: address,
    });
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
    query.containedIn('key', definitions.blockHeightKeys);
    const subscription = await query.subscribe();
    return subscription;
  }

  static async fetchBlockHeights() {
    const query = new Parse.Query('Global');
    query.containedIn('key', definitions.blockHeightKeys);
    const rows = await query.find();
    const blockHeights = rows.map(parseDataUtil.getBlockHeight);
    return blockHeights;
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
    return ads;
  }
}

export default ParseHelper;

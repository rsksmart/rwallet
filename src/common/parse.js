import _ from 'lodash';
import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import config from '../../config';

const parseConfig = config && config.parse;

// If we are unable to load config, it means the config file is moved. Throw error to indicate that.
if (_.isUndefined(parseConfig)) {
  throw new Error('Unable to find config for Parse init. Check config file path!');
}

Parse.initialize(parseConfig.appId, parseConfig.javascriptKey, parseConfig.masterKey);
Parse.serverURL = parseConfig.serverURL;
Parse.masterKey = parseConfig.masterKey;
Parse.setAsyncStorage(AsyncStorage);

/** Parse Class definition */
// const ParseUser = Parse.User;
const ParseAddress = Parse.Object.extend('Address');
const ParseTransaction = Parse.Object.extend('Transaction');
/**
 * ParseHelper is a helper class with static methods which wrap up Parse lib logic,
 * so that we don't need to reference ParseUser, ParseGlobal in other files
 */
class ParseHelper {
  static signUp(appId) {
    const user = new Parse.User();

    // Set appId as username and password.
    // No real password is needed because we only want to get access to Parse.User here to access related data
    user.set('username', appId);
    user.set('password', appId);
    console.log('DeviceInfo.getDeviceId()', DeviceInfo.getDeviceId());
    user.set('deviceId', DeviceInfo.getDeviceId());

    // TODO: other information needed to be set here.
    return user.signUp();
  }

  static signIn(appId) {
    return Parse.User.logIn(appId, appId);
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
  static async updateUser({ wallets, settings }) {
    const parseUser = Parse.User.current();
    await parseUser.fetch();

    // Only set settings when it's defined.
    if (_.isObject(settings)) {
      parseUser.set('settings', settings);
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

  static getPrice({ symbols, currencies }) {
    return Parse.Cloud.run('getPrice', { symbols, currency: currencies });
  }

  /**
   * Transform Parse errors to errors defined by this app
   * @param {object}     err        Parse error from response
   * @returns {object}  error object defined by this app
   * @method handleError
   */
  static handleError(err) {
    const message = err.message || 'error.parse.default';

    switch (err.code) {
      case Parse.Error.INVALID_SESSION_TOKEN:
        return Parse.User.logOut();
      // Other Parse API errors that you want to explicitly handle
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
   * Return an array of wallets with basic information such as wallet balance
   * @returns {array} Array of wallet object; empty array if nothing found
   */
  static async getWallets() {
    // Get current Parse.User
    const parseUser = Parse.User.current();

    if (_.isUndefined(parseUser) || _.isUndefined(parseUser.get('wallets'))) {
      return [];
    }

    const wallets = parseUser.get('wallets');

    // since User's wallet field is linked value, we need to call fetch to retrieve full information of wallets
    await wallets.fetch();

    const result = _.map(wallets, (parseWallet) => ({
      address: parseWallet.get('address'),
      symbol: parseWallet.get('symbol'),
      type: parseWallet.get('type'),
      balance: parseWallet.get('balance'),
      txCount: parseWallet.get('txCount'),
    }));

    return result;
  }

  /**
   * Get balance of parseObject and update property of each addresss
   * @param {array} tokens Array of Coin class instance
   * @returns {array} e.g. [{objectId, balance(hex string)}]
   */
  static async fetchBalance(tokens) {
    const validObjects = _.filter(tokens, (item) => !_.isUndefined(item.objectId));
    const promises = _.map(validObjects, (token) => {
      const { objectId } = token;
      const query = new Parse.Query(ParseAddress);
      return query.get(objectId)
        .then((parseObject) => {
          // Update address if the object was retrieved successfully.
          // This address is hex string which needs to be procced during either here or rendering
          const balance = parseObject.get('balance');

          return Promise.resolve({
            objectId,
            balance,
          });
        }, (err) => {
          console.warn(`fetchBalance, ${objectId}, ${token.symbol}, ${token.address} err: ${err.message}`);
          return Promise.resolve();
        });
    });

    const results = await Promise.all(promises);
    console.log('fetchBalance, results:', results);

    // Only return items with valid value
    return _.filter(results, (item) => !_.isUndefined(item));
  }

  /**
   * Get transactions of parseObject and update property of each addresss
   *
   * @static
   * @param {array} addresses Array of Coin class instance
   * @memberof ParseHelper
   */
  static fetchTransaction(tokens) {
    const promises = _.map(tokens, (token) => {
      const {
        address, symbol, chain, type,
      } = token;
      const newToken = token;

      // Find relavent transactions of which token.address is either from or to
      const queryTo = new Parse.Query(ParseTransaction);
      queryTo.equalTo('to', address)
        .equalTo('symbol', symbol)
        .equalTo('chain', chain)
        .equalTo('type', type);

      const queryFrom = new Parse.Query(ParseTransaction);
      queryFrom.equalTo('from', address)
        .equalTo('symbol', symbol)
        .equalTo('chain', chain)
        .equalTo('type', type);

      return Parse.Query.or(queryTo, queryFrom).descending('receivedAt').find()
        .then((results) => {
          newToken.transactions = _.map(results, (item) => item.toJSON());
          if (!_.isEmpty(newToken.transactions)) {
            console.log(`fetchTransaction, token ${symbol} transactions: `, newToken.transactions);
          }
        }, (err) => {
          console.warn(`fetchTransaction, token ${symbol}`, err.message);
        });
    });

    return Promise.all(promises);
  }

  static fetchLatestBlockHeight() {
    return Parse.Cloud.run('getLatestBlockHeight');
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
        params = [];
        params.push({ key: 'depositCoin', value: deposit }, { key: 'destinationCoin', value: destination });
        break;
      case 'order':
        method = 'post';
        path = 'order';
        params = [];
        params.push(
          { key: 'depositCoin', value: deposit },
          { key: 'destinationCoin', value: destination },
          { key: 'depositCoinAmount', value: coinswitchParams.amount },
          { key: 'destinationAddress', value: coinswitchParams.destinationAddress },
          { key: 'refundAddress', value: coinswitchParams.refundAddress },
        );
        break;
    }
    const options = { method, path };
    // eslint-disable-next-line no-unused-expressions
    params && (options.params = params);
    return Parse.Cloud.run('coinswitch', options);
  }
}

export default ParseHelper;

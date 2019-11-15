import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config';

console.log('config.parse', config.parse);

const parseConfig = config && config.parse;

Parse.initialize(parseConfig.appId, parseConfig.javascriptKey, parseConfig.masterKey);
Parse.serverURL = parseConfig.serverURL;
Parse.masterKey = parseConfig.masterKey;
Parse.setAsyncStorage(AsyncStorage);

/**
 * ParseHelper should be used as a static class
 */
class ParseHelper {
  static sendTransaction() {
    return Parse.Cloud.run('sendTransaction', {});
  }

  static getServerInfo() {
    console.log('ParseHelper.getServerInfo is called.');
    console.log('Parse', Parse);
    console.log('Parse.Cloud', Parse.Cloud);

    return Parse.Cloud.run('getServerInfo').then((res) => {
      console.log(res);

      return Promise.resolve(res);
    }, (err) => {
      console.log(err);
      return Promise.reject(err);
    });
  }

  static getTransactionsByAddress({ symbol, type, address }) {
    console.log(`ParseHelper::getTransactionsByAddress is called, symbol: ${symbol}, type: ${type}, address: ${address}`);
    return Parse.Cloud.run('getTransactionsByAddress', { symbol, type, address }).then((res) => {
      console.log(`ParseHelper::getTransactionsByAddress received, res: ${JSON.stringify(res)}`);
      return Promise.resolve(res);
    }, (err) => {
      console.log(err);
      return Promise.reject(err);
    });
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
}

export default ParseHelper;

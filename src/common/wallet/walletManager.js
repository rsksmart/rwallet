// import RNSecureStorage from 'rn-secure-storage';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Wallet from './wallet';
import storage from '../storage';
import appContext from '../appContext';
import common from '../common';

const STORAGE_KEY = 'wallets';

class WalletManager {
  constructor(wallets = [], currentKeyId = 0) {
    this.wallets = wallets;
    this.currentKeyId = currentKeyId;
    this.assetValue = new BigNumber(0);

    this.serialize = this.serialize.bind(this);
    this.deserialize = this.deserialize.bind(this);
    this.updateAssetValue = this.updateAssetValue.bind(this);
    this.getTokens = this.getTokens.bind(this);
    this.deleteWallet = this.deleteWallet.bind(this);
    this.renameWallet = this.renameWallet.bind(this);
  }

  /**
   * Returns true if this.wallets is not an array, or is empty.
   */
  isEmpty() {
    return !_.isArray(this.wallets) || _.isEmpty(this.wallets);
  }

  /**
   * Create a wallet instance
   * @param {string} name Wallet name
   * @param {string} phrase 12-word mnemonic phrase
   * @param {array} coinIds ["BTC", "RBTC", "RIF"]
   */
  async createWallet(name, phrase, coinIds) {
    // 1. Convert coinIds to coins array
    const coins = _.map(coinIds, (id) => ({
      id,
    }));

    console.log('walletManager.createWallet:coins', coins);

    // 2. Create a Wallet instance and save into wallets
    const wallet = await Wallet.create({
      id: this.currentKeyId, name, phrase, coins,
    });

    this.wallets.push(wallet);

    // Increment current pointer
    this.currentKeyId += 1;

    // Save to storage
    await this.serialize();

    return wallet;
  }

  async restoreFromStorage() {
    const { wallets } = this;

    const walletsJson = await storage.load({ key: STORAGE_KEY });

    walletsJson.forEach(async (item) => {
      const phrase = await appContext.getPhrase(item.id);
      const wallet = Wallet.create('', phrase);

      if (wallet) {
        wallets.add(wallet);
      }
    });
  }

  /**
   * Returns a JSON containing an array of wallet to save required data to backend server.
   * Returns empty array if there's no wallet
   */
  toJSON() {
    const results = {
      currentKeyId: this.currentKeyId,
      wallets: [],
    };

    this.wallets.forEach((wallet) => {
      results.wallets.push(wallet.toJSON());
    });

    return results;
  }

  /**
   * Save JSON presentation of Wallets data to permenate storage
   */
  async serialize() {
    const jsonData = {
      currentKeyId: this.currentKeyId,
      wallets: _.map(this.wallets, (wallet) => wallet.toJSON()),
    };

    console.log('walletManager.serialize: jsonData', jsonData);
    await storage.save(STORAGE_KEY, jsonData);
  }

  /**
   * Read permenate storage and load Wallets into this instance;
   */
  async deserialize() {
    const result = await storage.load({ key: 'wallets' });

    if (!_.isNull(result) && _.isObject(result)) {
      // Retrieve currentKeyId from storage result
      if (_.isNumber(result.currentKeyId)) {
        this.currentKeyId = result.currentKeyId;
      }

      // Re-create Wallet objects based on result.wallets JSON
      const promises = _.map(result.wallets, (walletJSON) => Wallet.fromJSON(walletJSON));
      const wallets = _.filter(await Promise.all(promises), (obj) => !_.isNull(obj));

      this.wallets = wallets;
    }

    console.log('Deserialized Wallets from Storage.', this.wallets);
  }

  /**
   * Update asset value and save them into each wallet as BigNumber, and sum up total asset value
   * Fail silently if there is any exception
   * @param {*} prices
   */
  updateAssetValue(prices, currency) {
    const { getTokens } = this;

    // Return early if prices or currency is invalid
    if (_.isEmpty(prices) || _.isUndefined(currency)) {
      return;
    }

    try {
      const assetValue = prices.reduce((totalAssetValue, priceObject) => {
        const tokenSymbol = priceObject.symbol;
        const tokenPrice = priceObject.price && priceObject.price[currency];
        let value = new BigNumber(0);

        // Find Coin instances by symbol
        const coins = getTokens({ symbol: tokenSymbol });

        coins.forEach((coin) => {
          if (coin.balance) {
            // eslint-disable-next-line no-param-reassign
            coin.balanceValue = coin.balance.times(tokenPrice);
            value = value.plus(coin.balanceValue);
          }
        });

        return totalAssetValue.plus(value);
      }, new BigNumber(0));

      this.assetValue = assetValue;
    } catch (ex) {
      console.error('walletManager.updateAssetValue', ex.message);
    }
  }


  /**
   * Update balances of Token based on input
   * @param {array} balances Array of balance object in form of {objectId, balance(hex string)}
   * @returns {boolean} True if any balance has changed
   */
  updateBalance(balances) {
    const tokenInstances = this.getTokens();
    let isDirty = false;

    _.each(tokenInstances, (token) => {
      const newToken = token;
      const match = _.find(balances, (balanceObject) => balanceObject.objectId === token.objectId);

      if (match) {
        try {
          // Try to convert hex string to BigNumber
          newToken.balance = common.convertHexToCoinAmount(newToken.symbol, match.balance);

          isDirty = true;
        } catch (err) {
          console.warn(`fetchBalance, unable to convert ${match.symbol} balance ${match.balance} to BigNumber`);
        }
      }
    });

    return isDirty;
  }

  /**
   * Return all instances of Coin class within this WalletManager
   * @param {object} filter AND filter to select token with given criteras
   * @param {string} filter.symbol
   */
  getTokens(filter) {
    const { wallets } = this;
    return _.reduce(wallets, (accumulator, wallet) => {
      _.each(wallet.coins, (coin) => {
        if (!_.isObject(filter)) { // Accumulator adds everything if there's no filter
          accumulator.push(coin);
        } else if (filter.symbol) {
          if (coin.symbol === filter.symbol) { // Only adds given symbol if there's a symbol filter
            accumulator.push(coin);
          }
        }
      });
      return accumulator;
    }, []);
  }

  /*
   * Set Coin's objectId to values in parseWallets, and return true if there's any change
   * @param {array} addresses Array of JSON objects
   * @returns True if any Coin is updated
   */
  updateCoinObjectIds(addresses) {
    const { wallets } = this;

    let isDirty = false;
    _.each(wallets, (wallet) => {
      if (wallet.updateCoinObjectIds(addresses)) {
        isDirty = true;
      }
    });

    return isDirty;
  }

  /*
   * Delete a wallet
   */
  async deleteWallet(wallet) {
    console.log('walletManager::deleteWallet, wallet: ', wallet);
    const { wallets } = this;
    _.remove(wallets, (item) => item === wallet);
    await this.serialize();
  }

  /*
   * Rename a wallet
   * @param {string} name, accept a-z, A-Z, 0-9 and blank
   */
  async renameWallet(wallet, name) {
    const regex = /^[a-zA-Z0-9 ]+$/g;
    const match = regex.exec(name);
    if (!match) {
      console.log('renameWallet, regex validatiton failed');
      throw new Error('Wallet name is not valid.');
    }
    const modifyWallet = wallet;
    modifyWallet.name = name;
    await this.serialize();
  }
}

export default new WalletManager();

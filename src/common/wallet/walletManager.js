// import RNSecureStorage from 'rn-secure-storage';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Wallet from './wallet';
import storage from '../storage';
import appContext from '../appContext';

const STORAGE_KEY = 'wallets';

class WalletManager {
  constructor(wallets = [], currentKeyId = 0) {
    this.wallets = wallets;
    this.currentKeyId = currentKeyId;
    this.assetValue = new BigNumber(0);

    this.serialize = this.serialize.bind(this);
    this.deserialize = this.deserialize.bind(this);
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

    console.log('Deserialized Wallets from Storage.', result);

    if (!_.isNull(result) && _.isObject(result)) {
      // Retrieve currentKeyId from storage result
      if (_.isNumber(result.currentKeyId)) {
        this.currentKeyId = result.currentKeyId;
      }

      // Re-create Wallet objects based on result.wallets JSON
      const promises = _.map(result.wallets, (walletJSON) => Wallet.fromJSON(walletJSON));
      const wallets = _.filter(await Promise.all(promises), (obj) => !_.isNull(obj));

      console.log('deserialize.wallets', wallets);
      this.wallets = wallets;
      console.log('deserialize.this.wallets', this.wallets, this.wallets.length);
    }
  }

  /**
   * Update asset value, and save them into each wallet
   * Fail silently if there is any exception
   * @param {*} prices
   */
  updateAssetValue(prices, currency) {
    const { wallets } = this;
    try {
      console.log('updateAssetValue.wallets', wallets);
      console.log('updateAssetValue.prices', prices);
      const assetValue = prices.reduce((acc, cur) => {
        const coins = wallets.map((wallet) => {
          const coinObj = wallet.coins.find((coin) => coin.symbol === cur.symbol);
          return coinObj;
        });
        const price = cur.price[currency];
        let value = new BigNumber(0);
        coins.forEach((coin) => {
          if (coin.balance) {
            // eslint-disable-next-line no-param-reassign
            coin.balanceValue = coin.balance.times(price);
            value = value.plus(coin.balanceValue);
          }
        });
        const sum = acc.plus(value);
        console.log(`symbol: ${cur.symbol} sum :${value.toString()}`);
        return sum;
      }, new BigNumber(0));
      this.assetValue = assetValue;
      // this.assetValue = assetValue.toString();
      // console.log(`this.assetValue: ${this.assetValue}`);
    } catch (ex) {
      console.log(ex);
    }
  }

  /**
   * Return total asset value for all wallets in this walletManager
   * @returns {number} Total Asset Value in currency
   */
  getTotalAssetValue(currency) {
    const { wallets } = this;
    console.log('getTotalAssetValue.wallets', wallets);
    console.log('getTotalAssetValue.currency', currency);
    return this.assetValue;
  }

  /**
   * Return all instances of Coin class within this WalletManager
   */
  getAddresses() {
    const { wallets } = this;
    return _.reduce(wallets, (accumulator, wallet) => accumulator.concat(wallet.coins), []);
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
}

export default new WalletManager();

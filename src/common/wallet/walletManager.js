import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Wallet from './wallet';
import storage from '../storage';
import common from '../common';
import CONSTANTS from '../constants.json';

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
    this.createWallet = this.createWallet.bind(this);
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
   * @param {array} coinIds [{symbol: "BTC", type:'Mainnet'}, {symbol: "RBTC", type:'Mainnet'}, {symbol: "RIF", type:'Mainnet'}]
   * @param {object} derivationPaths, {BTC: "m/44'/0'/1'/0/0", BTC: "m/44'/137'/1'/0/0"}
   */
  async createWallet(name, phrase, coins, derivationPaths) {
    console.log('walletManager.createWallet:coins', coins);

    // 2. Create a Wallet instance and save into wallets
    const wallet = await Wallet.create({
      id: this.currentKeyId, name, phrase, coins, derivationPaths,
    });

    this.wallets.unshift(wallet);

    // Increment current pointer
    this.currentKeyId += 1;

    // Save to storage
    await this.serialize();

    return wallet;
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
    await storage.setWallets(jsonData);
  }

  /**
   * Read permenate storage and load Wallets into this instance;
   */
  async deserialize() {
    const result = await storage.getWallets();

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
    const { wallets } = this;

    // Return early if prices or currency is invalid
    if (_.isEmpty(prices) || _.isUndefined(currency)) {
      return;
    }

    let totalAssetValue = new BigNumber(0);
    try {
      _.each(wallets, (wallet) => {
        const newWallet = wallet;
        let assetValue = new BigNumber(0);
        const { coins } = wallet;
        _.each(coins, (coin) => {
          const newCoin = coin;
          if (newCoin.type === 'Testnet') {
            newCoin.balanceValue = new BigNumber(0);
          } else if (newCoin.balance) {
            const priceObject = _.find(prices, { symbol: newCoin.symbol });
            if (!priceObject) {
              return;
            }
            const tokenPrice = priceObject.price && priceObject.price[currency];
            newCoin.balanceValue = newCoin.balance.times(tokenPrice);
            assetValue = assetValue.plus(newCoin.balanceValue);
          }
          totalAssetValue = totalAssetValue.plus(assetValue);
        });
        newWallet.assetValue = assetValue;
      });

      this.assetValue = totalAssetValue;
    } catch (ex) {
      console.error('walletManager.updateAssetValue', ex.message);
    }
  }


  /**
   * Update tokens based on input
   * @param {array} updatedItems Array of items in form of {objectId, balance(hex string), subdomain}, which are always fetched from server.
   * @returns {boolean} True if any tokens has changed
   */
  updateTokens(updatedItems) {
    console.log('updateTokens, updatedItems: ', updatedItems);
    const tokenInstances = this.getTokens();
    let isDirty = false;

    _.each(tokenInstances, (token) => {
      const newToken = token;
      const matchedToken = _.find(updatedItems, (item) => item.address === token.address && item.symbol === token.symbol);

      if (matchedToken) {
        // update balance
        try {
          // Try to convert hex string to BigNumber
          const newBalance = common.convertUnitToCoinAmount(newToken.symbol, matchedToken.balance);
          // Update if it fetched new balance value
          if (newBalance && !newBalance.isEqualTo(newToken.balance)) {
            newToken.balance = newBalance;
            isDirty = true;
          }
        } catch (err) {
          console.warn(`updateTokens, unable to convert ${matchedToken.symbol} balance ${matchedToken.balance} to BigNumber`);
        }

        // update subdomain
        if (matchedToken.subdomain && newToken.subdomain !== matchedToken.subdomain) {
          newToken.subdomain = matchedToken.subdomain;
          isDirty = true;
        }
      }
    });

    // serialize balance
    if (isDirty) {
      this.serialize();
    }

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
    const { wallets } = this;
    _.remove(wallets, (item) => item === wallet);
    await this.serialize();
  }

  /*
   * Rename a wallet
   * @param {string} name, accept a-z, A-Z, 0-9 and space, max length is 32
   */
  async renameWallet(wallet, name) {
    if (name.length < 1) {
      throw new Error('modal.incorrectKeyName.tooShort');
    } else if (name.length > CONSTANTS.KEYNAME_MAX_LENGTH) {
      throw new Error('modal.incorrectKeyName.tooLong');
    }
    const regex = /^[a-zA-Z0-9 ]+$/g;
    const match = regex.exec(name);
    if (!match) {
      throw new Error('modal.incorrectKeyName.invalid');
    }
    const modifyWallet = wallet;
    modifyWallet.name = name;
    await this.serialize();
  }

  getSymbols = () => {
    let symbols = [];
    _.each(this.wallets, (wallet) => {
      symbols = _.concat(symbols, wallet.getSymbols());
    });
    // We need BTC for DOC price caculation
    symbols.push('BTC');
    return _.uniq(symbols);
  }

  findToken = (symbol, type, address) => {
    for (let i = 0; i < this.wallets.length; i += 1) {
      const wallet = this.wallets[i];
      const coin = _.find(wallet.coins, { address, symbol, type });
      if (coin) {
        return coin;
      }
    }
    return null;
  }
}

export default new WalletManager();

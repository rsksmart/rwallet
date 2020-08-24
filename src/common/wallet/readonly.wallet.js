import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';
import definitions from '../definitions';

const ordinal = require('ordinal');

export default class ReadOnlyWallet {
  constructor(id, name, chain, type, address) {
    this.coins = [];
    this.id = id;
    this.name = name || `My ${ordinal(id + 1)} Wallet`;
    this.chain = chain;
    this.type = type;
    this.address = address;
    this.walletType = definitions.WalletType.readonly;
  }

  static create({
    id, name, chain, type, address, coins,
  }) {
    const wallet = new ReadOnlyWallet(id, name, chain, type, address, address);
    wallet.createCoins(coins);
    return wallet;
  }

  // create coins and add to list
  createCoins = (coins) => {
    if (!_.isEmpty(coins)) {
      coins.forEach((item) => {
        this.addToken(item);
      });
    }
  }

  addToken = (token) => {
    const {
      symbol, contractAddress, objectId, name, precision, balance, subdomain,
    } = token;

    let coin = null;

    // If the token already exists, an exception is thrown.
    const foundCoin = _.find(this.coins, { symbol });
    if (foundCoin) {
      throw new Error('err.exsistedtoken');
    }

    if (this.chain === 'Bitcoin') {
      coin = new Coin(symbol, this.type);
    } else {
      coin = new RBTCCoin(symbol, this.type);
      coin.setCustomTokenData({ contractAddress, name, precision });
    }
    coin.address = this.address;

    // restore other data
    if (objectId) {
      coin.objectId = objectId;
    }
    if (balance) {
      coin.balance = new BigNumber(balance);
    }
    if (subdomain) {
      coin.subdomain = subdomain;
    }

    this.coins.push(coin);
    return coin;
  }

  static restore(json) {
    const wallet = ReadOnlyWallet.create(json);
    return wallet;
  }

  /**
   * Returns a JSON to save required data to backend server; empty array if there's no coins
   */
  toJSON() {
    const result = {
      id: this.id,
      name: this.name,
      chain: this.chain,
      type: this.type,
      address: this.address,
      walletType: this.walletType,
      coins: this.coins.map((coin) => coin.toJSON()),
    };

    return result;
  }

  /**
   * Return a Wallet object based on raw wallet JSON
   * Returns null if Wallet restoration fails
   * @param {*} json
   */
  static async fromJSON(json) {
    const wallet = ReadOnlyWallet.restore(json);
    return { isNeedSave: false, wallet };
  }

  /**
   * Set Coin's objectId to values in parseWallets, and return true if there's any change
   * @param {array} addresses Array of JSON objects
   * @returns True if any Coin is updated
   */
  updateCoinObjectIds(addresses) {
    const { coins } = this;

    let isDirty = false;
    _.each(coins, (coin) => {
      if (coin.updateCoinObjectIds(addresses)) {
        isDirty = true;
      }
    });

    return isDirty;
  }
}

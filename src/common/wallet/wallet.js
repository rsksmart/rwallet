import RNSecureStorage from 'rn-secure-storage';
import _ from 'lodash';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';
// import storage from '../storage';

const Mnemonic = require('bitcore-mnemonic');

const PHRASE_KEY_STORAGE_PREFIX = 'wallet_';
export default class Wallet {
  constructor({
    id, name, mnemonic, coins,
  }) {
    this.id = id;
    this.name = name;
    this.mnemonic = mnemonic;
    // this.createdAt = new Date();

    console.log('Wallet.create.coins', coins);

    // Create coins based on types
    this.coins = [];
    const seed = this.mnemonic.toSeed();

    if (!_.isEmpty(coins)) {
      coins.forEach((item) => {
        const { id: coinId, amount, address } = item;

        let coin;
        if (coinId === 'BTC') {
          coin = new Coin(coinId, amount, address);
        } else {
          coin = new RBTCCoin(coinId, amount, address);
        }

        if (_.isUndefined(coin.address)) {
          coin.derive(seed);
        }

        this.coins.push(coin);
      });

      // Generate address of each node based on master key; will take a lot of time
      // this.derive();
    }

    // We need to save the phrase to secure storage after generation
    // TODO: We don't wait for success here. There's a chance this will fail; will need to add retry for this
    Wallet.savePhrase(this.id, this.mnemonic.toString());
  }

  /**
   *
   * @param {object} param0
   * @param {string} param0.id id of this wallet instance
   * @param {string} param0.name Name of wallet
   * @param {string} param0.phrase 12-word mnemonic phrase
   * @param {array} param0.coins Array of coin JSON
   *
   */
  static create({
    id, name, phrase, coins,
  }) {
    // If phrase is defined we will create mnemonic with phrase
    // Otherwise this line will generate a random mnemonic
    const mnemonic = new Mnemonic(phrase, Mnemonic.Words.ENGLISH);

    const wallet = new Wallet({
      id, name, mnemonic, coins,
    });

    return wallet;
  }

  // static load() {
  //   const wallet = new Wallet();
  //   return wallet;
  // }

  /**
   * Save phrase with walletId into secure storage if exits
   */
  static async savePhrase(id, phrase) {
    try {
      const key = `${PHRASE_KEY_STORAGE_PREFIX}${id}`;
      console.log(`savePhrase, key: ${key}, phrase: ${phrase}`);
      const result = await RNSecureStorage.set(key, phrase, {});
      console.log('savePhrase, result:', result);
    } catch (ex) {
      console.log('savePhrase, error', ex.message);
    }
  }

  /**
   * Restore phrase by walletId from secure storage; set to null if storage lookup fails
   */
  static async restorePhrase(id) {
    const key = `${PHRASE_KEY_STORAGE_PREFIX}${id}`;

    try {
      const phrase = await RNSecureStorage.get(key);
      console.log('restorePhrase, phrase:', phrase);
      return phrase;
    } catch (err) {
      console.log(err);
      console.log(err.message);
    }

    return null;
  }


  /**
   * Returns a JSON to save required data to backend server; empty array if there's no coins
   */
  toJSON() {
    const result = {
      id: this.id,
      name: this.name,
      // createdAt: this.createdAt,
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
    console.log('Wallet.fromJSON.', json);
    const {
      id, name, coins,
    } = json;

    // TODO: use secure storage to restore phrase
    const phrase = await Wallet.restorePhrase(id);

    if (!_.isString(phrase)) { // We are be able to restore phrase; do not continue.
      console.log(`Wallet.fromJSON: phrase restored is not a string, Id=${id}; returning null.`);
      return null;
    }

    console.log(`Wallet.fromJSON: restored phrase for Id=${id}; ${phrase}.`);

    const wallet = await Wallet.create({
      id, name, phrase, coins,
    });

    return wallet;
  }
}

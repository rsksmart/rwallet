import RNSecureStorage from 'rn-secure-storage';
import _ from 'lodash';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';

const Mnemonic = require('bitcore-mnemonic');

const PHRASE_KEY_STORAGE_PREFIX = 'wallet_';
export default class Wallet {
  constructor({
    id, name, mnemonic, coinTypes,
  }) {
    this.id = id;
    this.name = name;
    this.mnemonic = mnemonic;
    // this.createdAt = new Date();

    // Create coins based on types
    this.coins = [];
    coinTypes.forEach((coinType) => {
      let coin = null;
      if (coinType === 'BTC') {
        coin = new Coin('BTC');
      } else {
        coin = new RBTCCoin(coinType);
      }

      this.coins.push(coin);
    });

    // Generate address of each node based on master key; will take a lot of time
    this.derive();

    // We need to save the phrase to secure storage after generation
    // TODO: We don't wait for success here. There's a chance this will fail; will need to add retry for this
    Wallet.savePhrase();
  }

  static create({
    id, name, phrase, coinTypes,
  }) {
    // If phrase is defined we will create mnemonic with phrase
    // Otherwise this line will generate a random mnemonic
    const mnemonic = new Mnemonic(phrase, Mnemonic.Words.ENGLISH);

    const wallet = new Wallet({
      id, name, mnemonic, coinTypes,
    });

    return wallet;
  }

  derive() {
    for (let i = 0; i < this.coins.length; i += 1) {
      const coin = this.coins[i];
      const seed = this.mnemonic.toSeed();
      // this process cost time.
      coin.derive(seed);
    }
  }

  // static load() {
  //   const wallet = new Wallet();
  //   return wallet;
  // }


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
   * Save phrase with walletId into secure storage if exits
   */
  static async savePhrase(id, phrase) {
    try {
      const key = `${PHRASE_KEY_STORAGE_PREFIX}${id}`;
      const result = await RNSecureStorage.set(key, phrase, {});
      console.log('savePhrase, result:', result);
    } catch (ex) {
      console.log('savePhrase, error', ex);
    }
  }

  /**
   * Restore phrase by walletId from secure storage; set to null if storage lookup fails
   */
  static async restorePhrase(id) {
    const key = `${PHRASE_KEY_STORAGE_PREFIX}${id}`;

    try {
      const phrase = await RNSecureStorage.get(key);
      return phrase;
    } catch (err) {
      console.log(err);
    }

    return null;
  }

  /**
   * Return a Wallet object based on raw wallet JSON
   * Returns null if Wallet restoration fails
   * @param {*} json
   */
  static async fromJSON(json) {
    // const phrase = await appContext.getPhrase(json.id);
    // console.log('phrase', phrase);

    console.log('Wallet.fromJSON.', json);
    const { id, name, coins } = json;

    const phrase = await Wallet.restorePhrase(id);

    if (_.isNull(phrase)) { // We are be able to restore phrase; do not continue.
      console.log(`Wallet.fromJSON: cannot restore phrase for Id=${id}; returning null.`);
      return null;
    }

    console.log(`Wallet.fromJSON: restored phrase for Id=${id}; ${phrase}.`);

    const mnemonic = new Mnemonic(phrase, Mnemonic.Words.ENGLISH);

    const wallet = await Wallet.create({
      id, name, mnemonic, coinTypes: coins,
    });

    return wallet;
  }
}

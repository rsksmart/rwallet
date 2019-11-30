import RNSecureStorage from 'rn-secure-storage';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';
// import storage from '../storage';
import appContext from '../appContext';

const Mnemonic = require('bitcore-mnemonic');

export default class Wallet {
  constructor(id, name, phrase, coinTypes = ['BTC', 'RBTC', 'RIF']) {
    this.id = id;
    this.name = name;
    this.createdAt = new Date();

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

    // Generate mnemonic based on phrase
    this.phrase = phrase;
    this.mnemonic = new Mnemonic(phrase, Mnemonic.Words.ENGLISH);
  }

  /**
   * Create a wallet object based on phrase and generate addresses for each coin type
   * @param {*} id
   * @param {*} name
   * @param {*} phrase
   * @param {*} coinTypes
   */
  static create(id, name, phrase = null, coinTypes) {
    const wallet = new Wallet(id, name, phrase, coinTypes);

    // Generate address of each node based on master key; will take a lot of time
    const seed = this.mnemonic.toSeed();
    this.coins.forEach((coin) => coin.derive(seed));

    return wallet;
  }

  // static load() {
  //   const wallet = new Wallet();
  //   return wallet;
  // }

  /**
   * Save phrase with walletId into secure storage if exits
   */
  async savePhrase() {
    const { id, phrase } = this;
    const key = `wallet_${id}`;

    if (phrase) {
      await RNSecureStorage.set(key, phrase, {});
    }
  }

  /**
   * Restore phrase by walletId from secure storage; set to null if storage lookup fails
   */
  async restorePhrase() {
    const { id } = this;
    const key = `wallet_${id}`;
    let phrase = null;

    try {
      const doesExist = await RNSecureStorage.exists(key);

      if (doesExist) {
        phrase = await RNSecureStorage.get(key);
      }
    } catch (err) {
      console.log(err);
    }

    this.phrase = phrase;
  }


  /**
   * Returns a JSON to save required data to backend server; empty array if there's no coins
   */
  toJson() {
    const result = {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      coins: this.coins.map((coin) => coin.toJson()),
    };

    return result;
  }

  /**
   * Return a Wallet object based on raw wallet JSON
   * Returns null if Wallet restoration fails
   * @param {*} json
   */
  static async fromJson(json) {
    const phrase = await appContext.getPhrase(json.id);
    console.log('phrase', phrase);
    const wallet = Wallet.create(json.id, json.name, json.phrase, json.coinTypes);

    return wallet;
  }
}

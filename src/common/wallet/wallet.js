import RNSecureStorage from 'rn-secure-storage';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';

const Mnemonic = require('bitcore-mnemonic');

export default class Wallet {
  constructor({
    id, name, phrase, coinTypes,
  }) {
    this.id = id;
    this.name = name;
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

    // Generate mnemonic based on phrase
    this.phrase = phrase;

    console.log('this.phrase', this.phrase);
    this.mnemonic = new Mnemonic(phrase, Mnemonic.Words.ENGLISH);

    console.log('mnemonic generated', this.mnemonic);

    // Generate address of each node based on master key; will take a lot of time
    const seed = this.mnemonic.toSeed();
    this.coins.forEach((coin) => coin.derive(seed));

    // We need to save the phrase to secure storage after generation
    console.log('Before Save', new Date());

    // TODO: We don't wait for success here. There's a chance this will fail; will need to add retry for this
    this.savePhrase();
    console.log('After Save', new Date());
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

    if (phrase) {
      const key = `wallet_${id}`;
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
  toJSON() {
    const result = {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
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
    // const phrase = await appContext.getPhrase(json.id);
    // console.log('phrase', phrase);

    console.log('Wallet.fromJSON.', json);
    const { id, name, coinTypes } = json;
    const wallet = Wallet.create({ id, name, coinTypes });

    return wallet;
  }
}

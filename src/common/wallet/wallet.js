import Coin from './btccoin';
import RBTCCoin from './rbtccoin';

const Mnemonic = require('bitcore-mnemonic');

export default class Wallet {
  constructor(name = 'Account', coinTypes = ['BTC', 'RBTC', 'RIF']) {
    this.id = 0;
    this.name = name;
    this.coins = [];
    this.createdAt = new Date();
    coinTypes.forEach((coinType) => {
      let coin = null;
      if (coinType === 'BTC') {
        coin = new Coin('BTC');
      } else {
        coin = new RBTCCoin(coinType);
      }
      this.coins.push(coin);
    });
  }

  static create(name, phrase = null, coinTypes) {
    const mnemonic = new Mnemonic(phrase, Mnemonic.Words.ENGLISH);
    const wallet = new Wallet(name, coinTypes);
    wallet.mnemonic = mnemonic;
    wallet.derive();
    return wallet;
  }

  static load() {
    const wallet = new Wallet();
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

  /**
   * Returns a JSON to save required data to backend server; empty array if there's no coins
   */
  toJson() {
    const result = {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      coins: [],
    };

    this.coins.forEach((coin) => {
      result.coins.push(coin.toJson());
    });

    return result;
  }
}

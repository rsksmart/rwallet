import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';
import storage from '../storage';

const bip39 = require('bip39');

const WALLET_NAME_PREFIX = 'Key ';

export default class Wallet {
  constructor({
    id, name, mnemonic, coins,
  }) {
    this.id = id;
    this.name = name || WALLET_NAME_PREFIX + id;
    this.mnemonic = mnemonic;
    this.assetValue = new BigNumber(0);
    // this.createdAt = new Date();

    // console.log('Wallet.create.coins', coins);

    // Create coins based on ids
    this.coins = [];

    this.seed = bip39.mnemonicToSeedSync(mnemonic);

    if (!_.isEmpty(coins)) {
      coins.forEach((item) => {
        const {
          symbol, type, amount, address, objectId,
        } = item;

        let coin;
        if (symbol === 'BTC') {
          coin = new Coin(symbol, type, amount, address);
        } else {
          coin = new RBTCCoin(symbol, type, amount, address);
        }

        // Add objectId to coin if there is one
        if (objectId) {
          coin.objectId = objectId;
        }

        // TODO: right now we always derive privateKey hex string from seed
        // In future we could save those keys into storage to cut derive time
        coin.derive(this.seed);

        this.coins.push(coin);
      });
    }
  }

  /**
   *
   * @param {object} param0
   * @param {string} param0.id id of this wallet instance
   * @param {string} param0.name Name of wallet
   * @param {string} param0.phrase 12-word phrase
   * @param {array} param0.coins Array of coin JSON
   *
   */
  static create({
    id, name, phrase, coins,
  }) {
    // If phrase is defined we will create mnemonic with phrase
    // Otherwise this line will generate a random mnemonic
    let mnemonic = phrase;
    if (_.isEmpty(mnemonic)) {
      mnemonic = bip39.generateMnemonic();
    }

    const wallet = new Wallet({
      id, name, mnemonic, coins,
    });

    // We need to save the phrase to secure storage after generation
    // TODO: We don't wait for success here. There's a chance this will fail; will need to add retry for this
    Wallet.savePhrase(wallet.id, wallet.mnemonic);

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
      console.log(`savePhrase, id: ${id}, phrase: ${phrase}`);
      await storage.setMnemonicPhrase(id, phrase);
    } catch (ex) {
      console.log('savePhrase, error', ex.message);
    }
  }

  /**
   * Restore phrase by walletId from secure storage; set to null if storage lookup fails
   */
  static async restorePhrase(id) {
    try {
      const phrase = await storage.getMnemonicPhrase(id);

      return phrase;
    } catch (err) {
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

    // Migrate from old coin structure
    _.each(coins, (coin) => {
      const newCoin = coin;
      const { id: coinId, symbol } = newCoin;
      if (!symbol) {
        const index = coinId.lastIndexOf('Testnet');
        newCoin.symbol = index === -1 ? coinId : coinId.substring(0, index);
        newCoin.type = index === -1 ? 'Mainnet' : 'Testnet';
      }
    });

    const wallet = new Wallet({
      id, name, mnemonic: phrase, coins,
    });

    return wallet;
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

  addCustomToken = (symbol, type, contractAddress, decimalPlaces) => {
    const coin = new RBTCCoin(symbol, type, null, null, contractAddress, decimalPlaces);
    coin.derive(this.seed);
    this.coins.push(coin);
    console.log('this.coins: ', this.coins);
  }
}

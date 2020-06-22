import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';
import storage from '../storage';
import coinType from './cointype';
import common from '../common';

const bip39 = require('bip39');

const WALLET_NAME_PREFIX = 'Key ';

const drivationTypes = [
  { symbol: 'BTC', type: 'Mainnet' },
  { symbol: 'BTC', type: 'Testnet' },
  { symbol: 'RBTC', type: 'Mainnet' },
  { symbol: 'RBTC', type: 'Testnet' },
];

export default class Wallet {
  constructor({ id, name, mnemonic }) {
    this.id = id;
    this.name = name || WALLET_NAME_PREFIX + id;
    this.mnemonic = mnemonic;
    this.assetValue = new BigNumber(0);
    this.coins = [];
    this.seed = bip39.mnemonicToSeedSync(mnemonic);
    this.derivations = undefined;
  }

  /**
   * Generate derivation data(address, privateKey) for BTC, RBTC (RSK tokens)
   * Save private key to secure storage
   * derivationPaths, {BTC: "m/44'/0'/1'/0/0", RBTC: "m/44'/137'/1'/0/0"}
   * @param {*} derivationPaths
   */
  generateDerivations(derivationPaths) {
    this.derivations = [];
    _.each(drivationTypes, (drivationType) => {
      const { symbol, type } = drivationType;
      const path = type === 'Mainnet' && derivationPaths && derivationPaths[symbol] ? derivationPaths[symbol] : null;
      let coin = null;
      if (symbol === 'BTC') {
        coin = new Coin(symbol, type, path);
      } else {
        coin = new RBTCCoin(symbol, type, path);
      }
      coin.derive(this.seed);
      this.derivations.push({
        symbol,
        type,
        path: coin.derivationPath,
        address: coin.address,
        privateKey: coin.privateKey,
      });
      Wallet.savePrivateKey(this.id, symbol, type, coin.privateKey);
    });
  }

  // Create tokens from seed for first wallet creation
  createTokensFromSeed(coins, derivationPaths) {
    this.generateDerivations(derivationPaths);
    this.createCoins(coins);
  }

  // Retore tokens with exsisted derivation datas
  restoreTokensWithDerivations(coins, derivations) {
    this.derivations = derivations;
    this.createCoins(coins);
  }

  // create coins and add to list
  createCoins(coins) {
    if (!_.isEmpty(coins)) {
      coins.forEach((item) => {
        this.addToken(item);
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
   * @param {object} derivationPaths {BTC: "m/44'/0'/1'/0/0", BTC: "m/44'/137'/1'/0/0"}
   *
   */
  static create({
    id, name, phrase, coins, derivationPaths,
  }) {
    // If phrase is defined we will create mnemonic with phrase
    // Otherwise this line will generate a random mnemonic
    let mnemonic = phrase;
    if (_.isEmpty(mnemonic)) {
      mnemonic = bip39.generateMnemonic();
    }

    // create wallet and create tokens from seed
    const wallet = new Wallet({ id, name, mnemonic });
    wallet.createTokensFromSeed(coins, derivationPaths);

    // We need to save the phrase to secure storage after generation
    // TODO: We don't wait for success here. There's a chance this will fail; will need to add retry for this
    Wallet.savePhrase(wallet.id, wallet.mnemonic);

    return wallet;
  }

  static restore({
    id, name, phrase, coins, derivations,
  }) {
    let wallet = null;
    if (derivations) {
      wallet = new Wallet({ id, name, mnemonic: phrase });
      wallet.restoreTokensWithDerivations(coins, derivations);
    } else {
      wallet = Wallet.create({
        id, name, phrase, coins,
      });
    }
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
   * Save private key with walletId, symbol, type into secure storage if exits
   */
  static async savePrivateKey(id, symbol, type, privateKey) {
    try {
      console.log(`savePrivateKey, id: ${id}, symbol: ${symbol}, type: ${type}, privateKey: ${privateKey}`);
      await storage.setPrivateKey(id, symbol, type, privateKey);
    } catch (ex) {
      console.log('savePrivateKey, error', ex.message);
    }
  }

  /**
   * Restore private key by walletId, symbol, type from secure storage; set to null if storage lookup fails
   */
  static async restorePrivateKey(id, symbol, type) {
    try {
      const privateKey = await storage.getPrivateKey(id, symbol, type);
      return privateKey;
    } catch (err) {
      console.log(err.message);
    }

    return null;
  }


  /**
   * Returns a JSON to save required data to backend server; empty array if there's no coins
   */
  toJSON() {
    const newDerivations = _.map(this.derivations, (derivation) => ({
      symbol: derivation.symbol,
      type: derivation.type,
      path: derivation.path,
      address: derivation.address,
    }));

    const result = {
      id: this.id,
      name: this.name,
      // createdAt: this.createdAt,
      coins: this.coins.map((coin) => coin.toJSON()),
      derivations: newDerivations,
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
      id, name, coins, derivations,
    } = json;

    // use secure storage to restore phrase
    const phrase = await Wallet.restorePhrase(id);

    // use secure storage to restore private key
    if (derivations) {
      const privateKeyPromises = [];
      _.each(drivationTypes, async (drivationType) => {
        const { symbol, type } = drivationType;
        privateKeyPromises.push(Wallet.restorePrivateKey(id, symbol, type));
      });
      const privateKeys = await Promise.all(privateKeyPromises);
      _.each(privateKeys, (privateKey, index) => {
        derivations[index].privateKey = privateKey;
      });
    }

    if (!_.isString(phrase)) { // We are be able to restore phrase; do not continue.
      console.log(`Wallet.fromJSON: phrase restored is not a string, Id=${id}; returning null.`);
      return null;
    }

    console.log(`Wallet.fromJSON: restored phrase for Id=${id}; ${phrase}.`);
    console.log('Wallet.fromJSON: derivations: ', derivations);

    // Migrate from old coin structure
    _.each(coins, (coin) => {
      const newCoin = coin;
      const { id: coinId, symbol } = newCoin;
      if (!symbol) {
        const metadata = coinType[coinId];
        newCoin.symbol = metadata.symbol;
        newCoin.type = metadata.type;
      }
    });

    const wallet = Wallet.restore({
      id, name, phrase, coins, derivations,
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

  /**
   * Create token and add it to coins list
   */
  addToken = (token) => {
    const {
      symbol, type, contractAddress, objectId, name, precision, balance, subdomain,
    } = token;

    let coin = null;
    const foundCoin = _.find(this.coins, { symbol, type });
    if (foundCoin) {
      throw new Error('err.exsistedtoken');
    }
    // Create coin and reuse address and private key
    const derivationSymbol = symbol === 'BTC' ? symbol : 'RBTC';
    const derivation = _.find(this.derivations, { symbol: derivationSymbol, type });
    if (symbol === 'BTC') {
      coin = new Coin(symbol, type, derivation.path);
    } else {
      coin = new RBTCCoin(symbol, type, derivation.path, contractAddress, name, precision);
    }
    coin.privateKey = derivation.privateKey;
    coin.address = derivation.address;
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
    this.coins = common.sortTokens(this.coins);
    return coin;
  }

  deleteToken = (token) => {
    const { symbol, type } = token;
    _.remove(this.coins, { symbol, type });
  }

  getSymbols = () => {
    const symbols = [];
    _.each(this.coins, (coin) => {
      symbols.push(coin.symbol);
    });
    return _.uniq(symbols);
  }
}

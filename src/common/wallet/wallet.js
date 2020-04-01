import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';
import storage from '../storage';
import coinType from './cointype';

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
    this.derivationDatas = undefined;
  }

  // Generate derivation data(address, privateKey) for BTC, RBTC (RSK tokens)
  // Save private key to secure storage
  generateDerivationDatas(specifyPathAccounts) {
    this.derivationDatas = [];
    _.each(drivationTypes, (drivationType) => {
      const { symbol, type } = drivationType;
      const account = specifyPathAccounts && specifyPathAccounts[symbol] ? specifyPathAccounts[symbol] : 0;
      let coin = null;
      if (symbol === 'BTC') {
        coin = new Coin(symbol, type, account);
      } else {
        coin = new RBTCCoin(symbol, type, account);
      }
      coin.derive(this.seed);
      this.derivationDatas.push({
        symbol,
        type,
        account,
        address: coin.address,
        privateKey: coin.privateKey,
      });
      Wallet.savePrivateKey(this.id, symbol, type, coin.privateKey);
    });
  }

  // Create tokens from seed for first wallet creation
  createTokensFromSeed(coins, specifyPathAccounts) {
    this.generateDerivationDatas(specifyPathAccounts);
    this.createCoins(coins);
  }

  // Retore tokens with exsisted derivation datas
  restoreTokensWithDerivationDatas(coins, derivationDatas) {
    this.derivationDatas = derivationDatas;
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
   * @param {object} specifyPathAccounts {'BTC': 2, 'RBTC': 1}
   *
   */
  static create({
    id, name, phrase, coins, specifyPathAccounts,
  }) {
    // If phrase is defined we will create mnemonic with phrase
    // Otherwise this line will generate a random mnemonic
    let mnemonic = phrase;
    if (_.isEmpty(mnemonic)) {
      mnemonic = bip39.generateMnemonic();
    }

    // create wallet and create tokens from seed
    const wallet = new Wallet({ id, name, mnemonic });
    wallet.createTokensFromSeed(coins, specifyPathAccounts);

    // We need to save the phrase to secure storage after generation
    // TODO: We don't wait for success here. There's a chance this will fail; will need to add retry for this
    Wallet.savePhrase(wallet.id, wallet.mnemonic);

    return wallet;
  }

  static restore({
    id, name, phrase, coins, derivationDatas,
  }) {
    let wallet = null;
    if (derivationDatas) {
      wallet = new Wallet({ id, name, mnemonic: phrase });
      wallet.restoreTokensWithDerivationDatas(coins, derivationDatas);
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
    const newDerivationDatas = _.map(this.derivationDatas, (derivationData) => ({
      symbol: derivationData.symbol,
      type: derivationData.type,
      account: derivationData.account,
      address: derivationData.address,
    }));

    const result = {
      id: this.id,
      name: this.name,
      // createdAt: this.createdAt,
      coins: this.coins.map((coin) => coin.toJSON()),
      derivationDatas: newDerivationDatas,
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
      id, name, coins, derivationDatas,
    } = json;

    // use secure storage to restore phrase
    const phrase = await Wallet.restorePhrase(id);

    // use secure storage to restore private key
    if (derivationDatas) {
      const privateKeyPromises = [];
      _.each(drivationTypes, async (drivationType) => {
        const { symbol, type } = drivationType;
        privateKeyPromises.push(Wallet.restorePrivateKey(id, symbol, type));
      });
      const privateKeys = await Promise.all(privateKeyPromises);
      _.each(privateKeys, (privateKey, index) => {
        derivationDatas[index].privateKey = privateKey;
      });
    }

    if (!_.isString(phrase)) { // We are be able to restore phrase; do not continue.
      console.log(`Wallet.fromJSON: phrase restored is not a string, Id=${id}; returning null.`);
      return null;
    }

    console.log(`Wallet.fromJSON: restored phrase for Id=${id}; ${phrase}.`);
    console.log('Wallet.fromJSON: derivationDatas: ', derivationDatas);

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
      id, name, phrase, coins, derivationDatas,
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
      symbol, type, contractAddress, decimalPlaces, objectId, name,
    } = token;

    let coin = null;
    const foundCoin = _.find(this.coins, { symbol, type });
    if (foundCoin) {
      throw new Error('err.exsistedtoken');
    }
    let derivationData = null;
    // Create coin and reuse address and private key
    if (symbol === 'BTC') {
      coin = new Coin(symbol, type);
    } else {
      coin = new RBTCCoin(symbol, type, null, contractAddress, decimalPlaces, name);
    }
    const derivationSymbol = symbol === 'BTC' ? symbol : 'RBTC';
    derivationData = _.find(this.derivationDatas, { symbol: derivationSymbol, type });
    coin.privateKey = derivationData.privateKey;
    coin.address = derivationData.address;
    coin.account = derivationData.account;
    if (objectId) {
      coin.objectId = objectId;
    }
    this.coins.push(coin);
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

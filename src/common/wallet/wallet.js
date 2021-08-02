import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';
import storage from '../storage';
import coinType from './cointype';
import common from '../common';
import { WalletType, BtcAddressType } from '../constants';
import BasicWallet from './basic.wallet';

const bip39 = require('bip39');

const derivationTypes = [
  { symbol: 'BTC', type: 'Mainnet' },
  { symbol: 'BTC', type: 'Testnet' },
  { symbol: 'RBTC', type: 'Mainnet' },
  { symbol: 'RBTC', type: 'Testnet' },
];

export default class Wallet extends BasicWallet {
  constructor({ id, name, mnemonic }) {
    super(id, name, WalletType.Normal);
    this.mnemonic = mnemonic;
    this.assetValue = new BigNumber(0);
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
    _.each(derivationTypes, (derivationType) => {
      const { symbol, type } = derivationType;
      const path = type === 'Mainnet' && derivationPaths && derivationPaths[symbol] ? derivationPaths[symbol] : null;
      const coin = symbol === 'BTC' ? new Coin(symbol, type, path) : new RBTCCoin(symbol, type, path);
      coin.derive(this.seed);
      coin.savePrivateKey(this.id);
      this.derivations.push(coin);
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
   * Returns a JSON to save required data to backend server; empty array if there's no coins
   */
  toJSON = () => {
    const newDerivations = _.map(this.derivations, (derivation) => derivation.toDerivationJson());

    const result = {
      id: this.id,
      name: this.name,
      walletType: this.walletType,
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
    const seed = bip39.mnemonicToSeedSync(phrase);
    console.log(`Wallet.fromJSON: restored phrase for Id=${id}; ${phrase}.`);

    let isNeedSave = false;

    if (!_.isString(phrase)) { // We are be able to restore phrase; do not continue.
      console.log(`Wallet.fromJSON: phrase restored is not a string, Id=${id}; returning null.`);
      return null;
    }

    // restore derivations
    // use secure storage to restore private key
    if (derivations) {
      const promises = _.map(derivations, async (derivation, index) => {
        const {
          symbol, type, path, address,
        } = derivation;
        let coin = null;

        //  If addresses is empty, it is an upgrade from the old version
        // upgrade from old struct, recreate derivation
        if (symbol === 'BTC' && _.isEmpty(derivation.addresses)) {
          isNeedSave = true;
          coin = new Coin(symbol, type, path);
          coin.derive(seed);
          coin.setAddressType(BtcAddressType.legacy);
          await coin.savePrivateKey(id);
        } else {
          // restore derivation
          coin = symbol === 'BTC' ? Coin.fromJSON(derivation) : RBTCCoin.fromJSON(derivation);
          // RBTCCoin.fromJSON will convert old address to checksum address.
          // If old address is not a checksum address, save new address to storage
          isNeedSave = symbol === 'RBTC' && coin.address === address;
          await coin.restorePrivateKey(id);
        }
        derivations[index] = coin;
      });
      await Promise.all(promises);
    }

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

    return { isNeedSave, wallet };
  }

  /**
   * Create token and add it to coins list
   */
  addToken = (token) => {
    const {
      symbol, type, contractAddress, objectId, name, precision, balance, subdomain, addressType,
    } = token;

    let coin = null;

    // If the token already exists, an exception is thrown.
    const foundCoin = contractAddress && _.find(this.coins, { contractAddress });
    if (foundCoin) {
      throw new Error('err.exsistedtoken');
    }

    // Find the corresponding derivation
    const derivationSymbol = symbol === 'BTC' ? symbol : 'RBTC';
    const derivation = _.find(this.derivations, { symbol: derivationSymbol, type });

    // create token instance and restore addresses and private key with derivation.
    // symbol, type must not be null
    if (symbol === 'BTC') {
      // 1. If a already has a value, use it to create a token
      if (!derivation.addressType) {
        // 2. If user select addressType to create BTC for the first time, set addressType to derivation.
        this.setBtcAddressType(addressType);
      }
      coin = new Coin(symbol, type, derivation.path);
    } else {
      coin = new RBTCCoin(symbol, type, derivation.path);
      coin.setCustomTokenData({ contractAddress, name, precision });
    }

    // reuse address, private key of derivation
    coin.setupWithDerivation(derivation);

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
    this.coins = common.sortTokens(this.coins);
    return coin;
  }

  getSymbols = () => {
    const symbols = [];
    _.each(this.coins, (coin) => {
      symbols.push(coin.symbol);
    });
    return _.uniq(symbols);
  }

  // Set BTC address type (Mainnet, Testnet)
  setBtcAddressType(addressType) {
    _.each(this.derivations, (derivation) => {
      const newDerivation = derivation;
      if (newDerivation.symbol === 'BTC') {
        newDerivation.setAddressType(addressType);
      }
    });
  }

  // Get BTC address type
  getBtcAddressType = () => {
    const derivation = _.find(this.derivations, { symbol: 'BTC', type: 'Mainnet' });
    return derivation.addressType;
  }
}

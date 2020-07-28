import { fromSeed } from 'bip32';
import _ from 'lodash';
import { payments } from 'bitcoinjs-lib';

import coinType from './cointype';
import common from '../common';
import storage from '../storage';

const privateKeySuffix = {
  legacy: '',
  segwit: '/segwit',
};

export default class Coin {
  constructor(symbol, type, path) {
    this.id = type === 'Mainnet' ? symbol : symbol + type;
    // metadata:{network, networkId, icon, queryKey, defaultName}
    this.metadata = coinType[this.id];
    this.chain = this.metadata.chain;
    this.type = type;
    this.symbol = symbol;
    // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
    // m / purpose' / coin_type' / account' / change / address_index
    this.account = common.parseAccountFromDerivationPath(path);
    this.networkId = this.metadata.networkId;
    this.path = `m/44'/${this.networkId}'/${this.account}'/0/0`;
  }

  deriveSegwit= (root, network) => {
    const path = `m/84'/${this.networkId}'/${this.account}'/0/0`;
    const keyPair = root.derivePath(path);
    const { address } = payments.p2wpkh({ pubkey: keyPair.publicKey, network });
    return {
      path,
      address,
      privateKey: keyPair.privateKey.toString('hex'),
    };
  }

  deriveLegacy = (root, network) => {
    const path = `m/44'/${this.networkId}'/${this.account}'/0/0`;
    const keyPair = root.derivePath(path);
    const { address } = payments.p2pkh({ pubkey: keyPair.publicKey, network });
    return {
      path,
      address,
      privateKey: keyPair.privateKey.toString('hex'),
    };
  }

  derive(seed) {
    const network = this.metadata && this.metadata.network;
    try {
      const root = fromSeed(seed, network);
      this.addresses = {
        legacy: this.deriveLegacy(root, network),
        segwit: this.deriveSegwit(root, network),
      };
      const { path, address, privateKey } = this.addresses.legacy;
      this.path = path;
      this.address = address;
      this.privateKey = privateKey;
      console.log(`path: ${path}, address: ${this.address}, privateKey: ${this.privateKey}`);
    } catch (ex) {
      console.error(ex);
    }
  }

  /**
   * Returns a JSON of Coin to save required data to backend
   */
  toJSON() {
    return {
      id: this.id,
      symbol: this.symbol,
      type: this.type,
      metadata: this.metadata,
      path: this.path,
      address: this.address,
      objectId: this.objectId,
      balance: this.balance ? this.balance.toString() : undefined,
      addressType: this.addressType,
    };
  }

  toDerivationJson() {
    const {
      symbol, type, path, address, addressType,
    } = this;
    return {
      symbol,
      type,
      path,
      address,
      addressType,
      addresses: this.getAddressesWithoutPrivateKey(),
    };
  }

  static fromJSON(json) {
    const {
      symbol, type, path, addressType, address, addresses, objectId,
    } = json;
    const instance = new Coin(symbol, type, path);
    instance.addressType = addressType;
    instance.address = address;
    instance.addresses = addresses;
    instance.objectId = objectId;
    return instance;
  }

  /**
   * Return ture if all class members have the same value as the input json
   * @param {object} json Another Coin object
   */
  isEqual(json) {
    const {
      address, chain, type, symbol,
    } = this;
    return address === json.address
    && chain === json.chain
    && type === json.type
    && symbol === json.symbol;
  }

  /**
   * Set Coin's objectId to values in parseWallets, and return true if there's any change
   * @param {array} addresses Array of JSON objects
   * @returns True if this Coin is updated
   */
  updateCoinObjectIds(addresses) {
    const that = this;

    let isDirty = false;

    _.each(addresses, (address) => {
      if (that.isEqual(address) && that.objectId !== address.objectId) {
        that.objectId = address.objectId;
        isDirty = true;
        return false; // return false break _.each loop
      }

      return true; // simply here because eslint requires returning something
    });

    return isDirty;
  }

  get icon() {
    return this.metadata.icon;
  }

  get queryKey() {
    return this.metadata.queryKey;
  }

  get defaultName() {
    return this.metadata.defaultName;
  }

  setupWithDerivation = (derivation) => {
    const { addressType } = derivation;
    const { address, privateKey, path } = derivation.addresses[addressType];
    this.addressType = addressType;
    this.path = path;
    this.address = address;
    this.privateKey = privateKey;
  }

  /**
   * Save private key, type for segwit private key is Mainnet/segwit or Testnet/segwit
   * @param {*} walletId
   */
  savePrivateKey = async (walletId) => {
    const { symbol, type } = this;
    try {
      let newType = type + privateKeySuffix.legacy;
      console.log(`savePrivateKey, id: ${walletId}, symbol: ${symbol}, type: ${newType}, privateKey: ${this.addresses.legacy.privateKey}`);
      await storage.setPrivateKey(walletId, symbol, newType, this.addresses.legacy.privateKey);
      newType = this.type + privateKeySuffix.segwit;
      console.log(`savePrivateKey, id: ${walletId}, symbol: ${symbol}, type: ${newType}, privateKey: ${this.addresses.legacy.privateKey}`);
      await storage.setPrivateKey(walletId, symbol, newType, this.addresses.segwit.privateKey);
    } catch (ex) {
      console.log('savePrivateKey, error', ex.message);
    }
  }

  /**
   * Restore private key, type for segwit private key is Mainnet/segwit or Testnet/segwit
   * @param {*} walletId
   */
  restorePrivateKey = async (walletId) => {
    try {
      const { symbol, type } = this;
      let newType = type + privateKeySuffix.legacy;
      const legacyPrivateKey = await storage.getPrivateKey(walletId, symbol, newType);
      this.addresses.legacy.privateKey = legacyPrivateKey;
      newType = type + privateKeySuffix.segwit;
      const segwitPrivateKey = await storage.getPrivateKey(walletId, symbol, newType);
      this.addresses.segwit.privateKey = segwitPrivateKey;
    } catch (err) {
      console.log(err.message);
    }
  }

  getAddressesWithoutPrivateKey = () => {
    const newAddresses = {};
    const keys = Object.keys(this.addresses);
    _.each(keys, (key) => {
      const { path, address } = this.addresses[key];
      newAddresses[key] = { path, address };
    });
    return newAddresses;
  };
}

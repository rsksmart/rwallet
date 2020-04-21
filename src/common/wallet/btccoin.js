import { fromSeed, fromBase58 } from 'bip32';
import _ from 'lodash';
import { payments } from 'bitcoinjs-lib';

import coinType from './cointype';
import PathKeyPair from './pathkeypair';
import config from '../../../config';
import common from '../common';

export default class Coin {
  constructor(symbol, type, derivationPath) {
    this.id = type === 'Mainnet' ? symbol : symbol + type;
    // metadata:{network, networkId, icon, queryKey, defaultName}
    this.metadata = coinType[this.id];
    this.chain = this.metadata.chain;
    this.type = type;
    this.symbol = symbol;
    // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
    // m / purpose' / coin_type' / account' / change / address_index
    this.account = common.parseAccountFromDerivationPath(derivationPath);
    this.networkId = this.metadata.networkId;
    this.derivationPath = `m/44'/${this.networkId}'/${this.account}'/0/0`;
    this.decimalPlaces = config.symbolDecimalPlaces[symbol];
  }

  derive(seed) {
    const network = this.metadata && this.metadata.network;

    try {
      const master = fromSeed(seed, network).toBase58();
      const accountNode = Coin.generateAccountNode(master, network, this.networkId, this.account);
      const changeNode = Coin.generateChangeNode(accountNode, network, 0);
      const addressNode = Coin.generateAddressNode(changeNode, network, 0);
      this.address = Coin.generateAddress(addressNode, network);
      // this.addressPublicKey = addressNode.public_key;
      // console.log('this.addressPublicKey = addressNode.public_key;');
      const privateKeyBuffer = Coin.getPrivateKeyBuffer(master, addressNode, network);
      // console.log(`[PK]this.addressPrivateKey: ${this.addressPrivateKey}`);
      this.privateKey = privateKeyBuffer.toString('hex');
    } catch (ex) {
      console.error(ex);
    }

    // console.log(`derive(), ${this.id}.address:`, this.address, ', privateKey:', this.privateKey);
  }

  static getPrivateKeyBuffer(master, addressNode, network) {
    let privateKey = Coin.derivePathFromNode(master, addressNode.path, network);
    privateKey = fromBase58(privateKey, network).privateKey;
    return privateKey;
  }

  static generateAccountNode(master, network, networkId, account) {
    const path = `m/44'/${networkId}'/${account}'`;
    const pk = fromBase58(master, network)
      .derivePath(path)
      .neutered()
      .toBase58();
    return new PathKeyPair(path, pk);
  }

  static generateChangeNode(accountNode, network, index) {
    const path = `${accountNode.path}/${index}`;
    const publickey = this.deriveChildFromNode(accountNode.public_key, network, index);
    return new PathKeyPair(path, publickey);
  }

  static generateAddressNode(changeNode, network, index) {
    const pk = changeNode;
    const path = `${pk.path}/${index}`;
    const result = this.deriveChildFromNode(pk.public_key, network, index);
    return new PathKeyPair(path, result);
  }

  static generateAddress(addressNode, network) {
    const options = {
      pubkey: fromBase58(addressNode.public_key, network).publicKey,
      network,
    };

    return payments.p2pkh(options).address;
  }

  static deriveChildFromNode(node, network, index) {
    const t = fromBase58(node, network).derive(index);
    return t.toBase58();
  }

  static derivePathFromNode(node, path, network) {
    return fromBase58(node, network)
      .derivePath(path)
      .toBase58();
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
      derivationPath: this.derivationPath,
      address: this.address,
      objectId: this.objectId,
    };
  }

  static fromJSON(json) {
    const {
      symbol, type, derivationPath, objectId,
    } = json;
    const instance = new Coin(symbol, type, derivationPath);
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
}

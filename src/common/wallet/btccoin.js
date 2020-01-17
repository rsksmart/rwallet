import { fromSeed, fromBase58 } from 'bip32';
import _ from 'lodash';
import { payments } from 'bitcoinjs-lib';

import coinType from './cointype';
import PathKeyPair from './pathkeypair';

export default class Coin {
  constructor(id, amount, address) {
    this.id = id;
    // metadata:{network, networkId, icon, queryKey, defaultName}
    this.metadata = coinType[id];
    this.amount = amount;
    this.address = address;
    this.chain = this.metadata.chain;
    this.type = this.metadata.type;
    this.symbol = this.metadata.symbol;
    this.symbolFullName = this.metadata.symbolFullName;
  }

  derive(seed) {
    const network = this.metadata && this.metadata.network;
    const networkId = this.metadata && this.metadata.networkId;

    try {
      const master = fromSeed(seed, network).toBase58();
      const networkNode = Coin.getNetworkNode(master, network, networkId);
      const accountNode = Coin.generateAccountNode(networkNode, network, 0);
      const addressNode = Coin.generateAddressNode(accountNode, network, 0);
      this.addressPath = addressNode.path;
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

  static getNetworkNode(master, network, networkId) {
    const path = `m/44'/${networkId}'/0'`;
    const pk = fromBase58(master, network)
      .derivePath(path)
      .neutered()
      .toBase58();
    return new PathKeyPair(path, pk);
  }

  static generateAccountNode(networkNode, network, index) {
    const path = `${networkNode.path}/${index}`;
    const publickey = this.deriveChildFromNode(networkNode.public_key, network, index);
    return new PathKeyPair(path, publickey);
  }

  static generateAddressNode(accountNode, network, index) {
    const pk = accountNode;
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
      metadata: this.metadata,
      amount: this.amount,
      address: this.address,
      objectId: this.objectId,
    };
  }

  static fromJSON(json) {
    const {
      id, amount, address, objectId,
    } = json;
    const instance = new Coin(id, amount, address);
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

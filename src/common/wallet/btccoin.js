import { fromSeed, fromBase58 } from 'bip32';
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
    this.addressPrivateKey = null;
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

    console.log(`derive(), ${this.id}.address:`, this.address, ', privateKey:', this.privateKey);
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
    };
  }

  static fromJSON(json) {
    const { id, amount, address } = json;
    const instance = new Coin(id, amount, address);
    return instance;
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

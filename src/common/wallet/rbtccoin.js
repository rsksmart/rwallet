import _ from 'lodash';
import { Buffer } from 'buffer';
import rsk3 from 'rsk3';
import coinType from './cointype';
import PathKeyPair from './pathkeypair';

const HDNode = require('hdkey');
const crypto = require('crypto');
const ethereumjsUtil = require('ethereumjs-util');

const MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8');

export function deserializePrivate(privateKey) {
  const master = JSON.parse(privateKey);
  const ret = new HDNode();
  ret.chainCode = Buffer.from(master.cc, 'hex');
  ret.privateKey = Buffer.from(master.prk, 'hex');
  return ret;
}

function serializePrivate(node) {
  const ret = {
    prk: node.privateKey.toString('hex'),
    cc: node.chainCode.toString('hex'),
  };
  return JSON.stringify(ret);
}

function deserializePublic(s) {
  const master = JSON.parse(s);
  if (master.prk) return null;
  const ret = new HDNode();
  ret.chainCode = Buffer.from(master.cc, 'hex');
  ret.publicKey = Buffer.from(master.puk, 'hex');
  return ret;
}

function serializePublic(node) {
  const ret = {
    puk: node.publicKey.toString('hex'),
    cc: node.chainCode.toString('hex'),
  };
  return JSON.stringify(ret);
}

export default class RBTCCoin {
  constructor(id, amount, address) {
    this.id = id;

    // metadata:{network, networkId, icon, queryKey, defaultName}
    this.metadata = coinType[id];
    this.amount = amount;
    this.address = address;
    this.chain = this.metadata.chain;
    this.type = this.metadata.type;
    this.symbol = this.metadata.symbol;
  }

  derive(seed) {
    const networkId = this.metadata && this.metadata.networkId;

    try {
      const master = RBTCCoin.generateMasterFromSeed(seed);
      const networkNode = RBTCCoin.generateRootNodeFromMaster(master, networkId);
      const accountNode = RBTCCoin.generateAccountNode(networkNode, 0);
      const addressNode = RBTCCoin.generateAddressNode(accountNode, 0);
      this.address = RBTCCoin.getAddress(addressNode, networkId);
      this.privateKey = RBTCCoin.getPrivateKey(master, addressNode);
    } catch (ex) {
      console.error(ex);
    }

    // console.log(`derive(), ${this.id}.address:`, this.address, ', privateKey:', this.privateKey);
  }

  static getPrivateKey(master, addressNode) {
    let privateKey = RBTCCoin.derivePathFromNode(master, addressNode.path);
    privateKey = deserializePrivate(privateKey).privateKey;
    privateKey = Buffer.from(privateKey).toString('hex');
    return privateKey;
  }

  static fromMasterSeed(seedBuffer) {
    const I = crypto
      .createHmac('sha512', MASTER_SECRET)
      .update(seedBuffer)
      .digest();
    const IL = I.slice(0, 32);
    const IR = I.slice(32);

    const ret = new HDNode();
    ret.chainCode = IR;
    ret.privateKey = IL;

    return ret;
  }

  static generateMasterFromSeed(seed) {
    const master = RBTCCoin.fromMasterSeed(seed);
    return JSON.stringify({
      prk: master.privateKey.toString('hex'),
      cc: master.chainCode.toString('hex'),
    });
  }

  static generateRootNodeFromMaster(master, networkId) {
    let node = deserializePrivate(master);
    const path = `m/44'/${networkId}'/0'`;
    node = node.derive(path);
    return new PathKeyPair(path, serializePublic(node));
  }

  static generateAccountNode(networkNode, index) {
    const path = `${networkNode.path}/${index}`;
    const publicKey = this.deriveChildFromNode(networkNode.public_key, index);
    return new PathKeyPair(path, publicKey);
  }

  static generateAddressNode(accountNode, index) {
    const path = `${accountNode.path}/${index}`;
    const publicKey = this.deriveChildFromNode(accountNode.public_key, index);
    return new PathKeyPair(path, publicKey);
  }

  static deriveChildFromNode(publicKey, index) {
    const deserialized = deserializePublic(publicKey) || deserializePrivate(publicKey);
    return serializePublic(deserialized.deriveChild(index));
  }

  static getAddress(addressNode, networkId) {
    const publicKey = JSON.parse(addressNode.public_key).puk;
    const addressBin = ethereumjsUtil.pubToAddress(Buffer.from(publicKey, 'hex'), true);
    const address = Buffer.from(addressBin).toString('hex');
    return rsk3.utils.toChecksumAddress(address, networkId);
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
    const instance = new RBTCCoin(id, amount, address);
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

  static derivePathFromNode(node, path) {
    let deserialized = deserializePublic(node);
    let pub = true;
    if (!deserialized) {
      pub = false;
      deserialized = deserializePrivate(node);
    }
    const derived = deserialized.derive(path);
    let serialized = '';
    if (pub) { serialized = serializePublic(derived); } else { serialized = serializePrivate(derived); }
    return serialized;
  }
}

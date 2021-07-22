import _ from 'lodash';
import { Buffer } from 'buffer';
import Web3 from 'web3';
import coinType from './cointype';
import PathKeyPair from './pathkeypair';
import common from '../common';
import storage from '../storage';

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
  constructor(symbol, type, path) {
    this.id = type === 'Mainnet' ? symbol : symbol + type;

    // metadata:{network, networkId, icon, defaultName, coinType}
    // If coinType does not contain this.id, use custom token metadata;
    this.metadata = coinType[this.id] || (type === 'Mainnet' ? coinType.CustomToken : coinType.CustomTokenTestnet);
    this.chain = this.metadata.chain;
    this.contractAddress = this.metadata.contractAddress;
    this.type = type;
    this.symbol = symbol;
    this.precision = this.metadata.precision;
    // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
    // m / purpose' / coin_type' / account' / change / address_index
    this.account = common.parseAccountFromDerivationPath(path);
    this.networkId = this.metadata.networkId;
    this.coinType = this.metadata.coinType;
    this.path = `m/44'/${this.coinType}'/${this.account}'/0/0`;
    this.name = this.metadata.defaultName;
  }

  derive(seed) {
    try {
      const master = RBTCCoin.generateMasterFromSeed(seed);
      const accountNode = RBTCCoin.generateAccountNode(master, this.coinType, this.account);
      const changeNode = RBTCCoin.generateChangeNode(accountNode, 0);
      const addressNode = RBTCCoin.generateAddressNode(changeNode, 0);
      this.address = RBTCCoin.getAddress(addressNode, this.networkId);
      this.privateKey = RBTCCoin.getPrivateKey(master, addressNode);
    } catch (ex) {
      console.error(ex);
    }
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

  static generateAccountNode(master, tokenCoinType, account) {
    let node = deserializePrivate(master);
    const path = `m/44'/${tokenCoinType}'/${account}'`;
    node = node.derive(path);
    return new PathKeyPair(path, serializePublic(node));
  }

  static generateChangeNode(accountNode, index) {
    const path = `${accountNode.path}/${index}`;
    const publicKey = this.deriveChildFromNode(accountNode.public_key, index);
    return new PathKeyPair(path, publicKey);
  }

  static generateAddressNode(changeNode, index) {
    const path = `${changeNode.path}/${index}`;
    const publicKey = this.deriveChildFromNode(changeNode.public_key, index);
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
    const checksumAddress = Web3.utils.toChecksumAddress(address, networkId);
    return checksumAddress;
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
      subdomain: this.subdomain,
      objectId: this.objectId,
      contractAddress: this.contractAddress,
      precision: this.precision,
      chain: this.chain,
      name: this.name,
      balance: this.balance ? this.balance.toString() : undefined,
    };
  }

  toDerivationJson() {
    const {
      symbol, type, path, address,
    } = this;
    return {
      symbol, type, path, address,
    };
  }

  static fromJSON(json) {
    const {
      symbol, type, path, address, objectId,
    } = json;
    const instance = new RBTCCoin(symbol, type, path);
    // Convert old address to checksum address
    instance.address = Web3.utils.checkAddressChecksum(address, instance.networkId) ? address : Web3.utils.toChecksumAddress(address, instance.networkId);
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

  get defaultName() {
    return this.name;
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

  setupWithDerivation = (derivation) => {
    const { path, address, privateKey } = derivation;
    this.path = path;
    this.address = address;
    this.privateKey = privateKey;
  }

  savePrivateKey = async (walletId) => {
    const { symbol, type, privateKey } = this;
    try {
      await storage.setPrivateKey(walletId, symbol, type, privateKey);
    } catch (ex) {
      console.log('savePrivateKey, error', ex.message);
    }
  }

  restorePrivateKey = async (walletId) => {
    try {
      const { symbol, type } = this;
      const privateKey = await storage.getPrivateKey(walletId, symbol, type);
      this.privateKey = privateKey;
    } catch (err) {
      console.log(err.message);
    }
  }

  setCustomTokenData = async (data) => {
    const { contractAddress, name, precision } = data;
    this.precision = precision || this.precision;
    this.contractAddress = contractAddress || this.contractAddress;
    this.name = name || this.metadata.defaultName;
  }
}

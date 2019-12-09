import coinType from './cointype';
import PathKeyPair from './pathkeypair';

const HDNode = require('hdkey');
const crypto = require('crypto');
const ethereumjsUtil = require('ethereumjs-util');

const MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8');

function deserializePrivate(privateKey) {
  const master = JSON.parse(privateKey);
  const ret = new HDNode();
  ret.chainCode = Buffer.from(master.cc, 'hex');
  ret.privateKey = Buffer.from(master.prk, 'hex');
  return ret;
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
  }

  derive(seed) {
    const networkId = this.metadata && this.metadata.networkId;

    try {
      const master = RBTCCoin.generateMasterFromSeed(seed);
      const networkNode = RBTCCoin.generateRootNodeFromMaster(master, networkId);
      const accountNode = RBTCCoin.generateAccountNode(networkNode, 0);
      const addressNode = RBTCCoin.generateAddressNode(accountNode, 0);
      this.address = RBTCCoin.getAddress(addressNode);
    } catch (ex) {
      console.error(ex);
    }

    console.log(`derive(), ${this.id}.address:`, this.address, ', privateKey:', this.privateKey);
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

  static getAddress(addressNode) {
    const publicKey = JSON.parse(addressNode.public_key).puk;
    const addressBin = ethereumjsUtil.pubToAddress(Buffer.from(publicKey, 'hex'), true);
    const address = Buffer.from(addressBin).toString('hex');
    return ethereumjsUtil.toChecksumAddress(address);
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
    const instance = new RBTCCoin(id, amount, address);
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

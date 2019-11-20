import coinType from './cointype';
import PathKeyPair from './pathkeypair';


const HDNode = require('hdkey');
const crypto = require('crypto');
const ethereumjsUtil = require('ethereumjs-util');

const MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8');

function deserializePrivate(s) {
  const master = JSON.parse(s);
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
  constructor(network) {
    this.type = network;
    this.networkId = coinType[network].networkId;
    this.network = coinType[network].network;
    this.icon = coinType[network].icon;
    this.queryKey = coinType[network].queryKey;
    this.defaultName = coinType[network].defaultName;
    this.amount = 0;
    this.value = 0;
    this.address = '';
    this.networkNode = null;
    this.accountNode = null;
    this.addressNode = null;
    this.master = '';
  }

  serializePrivate(node) {
    this.a = 1;
    const ret = {
      prk: node.privateKey.toString('hex'),
      cc: node.chainCode.toString('hex'),
    };
    return JSON.stringify(ret);
  }

  fromMasterSeed(seedBuffer) {
    this.a = 1;
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

  generateMasterFromSeed(seed) {
    console.log(`[TRACE]RBTCCoin::generate_master_from_recovery_phrase, seed: ${seed}`);
    const master = this.fromMasterSeed(seed);
    return this.serializePrivate(master);
  }

  generateRootNodeFromMaster(s) {
    console.log(`[TRACE]RBTCCoin::generate_root_node_from_master, s: ${s}`);
    let node = deserializePrivate(s);
    const path = `m/44'/${this.networkId}'/0'`;
    node = node.derive(path);
    return new PathKeyPair(path, serializePublic(node));
  }

  derive(seed) {
    const master = this.generateMasterFromSeed(seed);
    this.networkNode = this.generateRootNodeFromMaster(master);
    this.generateAccountNode(0);
    this.generateAddressNode(0);
    this.address = this.getAddress(this.addressNode.public_key);
  }

  generateAccountNode(index) {
    const path = `${this.networkNode.path}/${index}`;
    const publicKey = this.deriveChildFromNode(this.networkNode.public_key, index);
    this.accountNode = new PathKeyPair(path, publicKey);
    return this.accountNode;
  }

  generateAddressNode(index) {
    const path = `${this.accountNode.path}/${index}`;
    const publicKey = this.deriveChildFromNode(this.accountNode.public_key, index);
    this.addressNode = new PathKeyPair(path, publicKey);
    return this.addressNode;
  }

  deriveChildFromNode(s, index) {
    this.a = 1;
    const deserialized = deserializePublic(s) || deserializePrivate(s);
    return serializePublic(deserialized.deriveChild(index));
  }

  getAddress(s) {
    const publicKey = JSON.parse(s).puk;
    const addressBin = ethereumjsUtil.pubToAddress(Buffer.from(publicKey, 'hex'), true);
    const address = Buffer.from(addressBin).toString('hex');
    return this.toChecksumAddress(address);
  }

  toChecksumAddress(s) {
    this.a = 1;
    return ethereumjsUtil.toChecksumAddress(s);
  }

  /**
   * Returns a JSON of Coin to save required data to backend
   */
  toJson() {
    return {
      network: this.network,
      type: this.type,
      address: this.address,
    };
  }
}

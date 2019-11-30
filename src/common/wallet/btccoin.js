import { fromSeed, fromBase58 } from 'bip32';
import { payments } from 'bitcoinjs-lib';

import coinType from './cointype';
import PathKeyPair from './pathkeypair';

export default class Coin {
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

  generateMasterFromSeed(seed) {
    console.log(`generate_master_from_recovery_phrase, seed: ${seed}`);
    this.master = fromSeed(seed, this.network).toBase58();
    return this.master;
  }

  getNetworkNode() {
    const path = `m/44'/${this.networkId}'/0'`;
    const pk = fromBase58(this.master, this.network)
      .derivePath(path)
      .neutered()
      .toBase58();
    this.networkNode = new PathKeyPair(path, pk);
    return this.networkNode;
  }

  derive(seed) {
    this.generateMasterFromSeed(seed);
    this.getNetworkNode();
    this.generateAccountNode(0);
    this.generateAddressNode(0);
    this.generateAddress();
  }

  generateAccountNode(index) {
    const path = `${this.networkNode.path}/${index}`;
    const publickey = this.deriveChildFromNode(this.networkNode.public_key, index);
    this.accountNode = new PathKeyPair(path, publickey);
    return this.accountNode;
  }

  generateAddressNode(index) {
    const pk = this.accountNode;
    const path = `${pk.path}/${index}`;
    console.log(
      `[TRACE]generateAddressNode, index: ${index}, pk: ${JSON.stringify(pk)}, path: ${path}`,
    );
    const result = this.deriveChildFromNode(pk.public_key, index);
    console.log(`[TRACE]generateAddressNode, publicKey: ${result}`);
    this.addressNode = new PathKeyPair(path, result);
    return this.addressNode;
  }

  generateAddress() {
    const options = {
      pubkey: fromBase58(this.addressNode.public_key, this.network).publicKey,
      network: this.network,
    };
    console.log(
      `[TRACE]BaseBtcCryptoNetwork::get_address, pubkey: ${options.pubkey}, network: ${options.network}`,
    );
    this.address = payments.p2pkh(options).address;
    return this.address;
  }

  deriveChildFromNode(node, index) {
    const t = fromBase58(node, this.network).derive(index);
    return t.toBase58();
  }

  /**
   * Returns a JSON of Coin to save required data to backend
   */
  toJSON() {
    return {
      network: this.network,
      type: this.type,
      address: this.address,
    };
  }
}

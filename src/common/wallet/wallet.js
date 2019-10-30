const Mnemonic = require('bitcore-mnemonic');
import {BIP32, fromPrivateKey, fromPublicKey, fromSeed, fromBase58} from 'bip32';
import {mnemonicToSeed, generateMnemonic, wordlists} from 'bip39';
import storage from '../storage'
import {
    address, ECPair, networks, payments, TransactionBuilder, Transaction, Network
} from 'bitcoinjs-lib';
const HDNode = require('hdkey');
const crypto_1 = require("crypto");
const ethereumjs_util_1 = require("ethereumjs-util");
const MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8');

const btc = require('../../assets/images/icon/BTC.png')
const rbtc = require('../../assets/images/icon/RBTC.png')
const rif = require('../../assets/images/icon/RIF.png')


function deserializePrivate(s) {
    let master = JSON.parse(s);
    let ret = new HDNode();
    ret.chainCode = new Buffer(master.cc, 'hex');
    ret.privateKey = new Buffer(master.prk, 'hex');
    return ret;
}

function deserializePublic(s) {
    let master = JSON.parse(s);
    if (master.prk)
        return null;
    let ret = new HDNode();
    ret.chainCode = new Buffer(master.cc, 'hex');
    ret.publicKey = new Buffer(master.puk, 'hex');
    return ret;
}

function serializePublic(node) {
    let ret = {
        puk: node.publicKey.toString('hex'),
        cc: node.chainCode.toString('hex')
    };
    return JSON.stringify(ret);
}

class PathKeyPair {
    constructor(path = '', pk = '') {
        this.path = path;
        this.public_key = pk;
    }
}
//BTC TBTC RSK TRSK RIF TRIF
let coinType = {
    BTC: {
        networkId: 0,
        network: networks.bitcoin,
        icon: btc,
        queryKey: 'BTC',
        defaultName: 'Bitcoin',
    },
    RBTC: {
        networkId: 137,
        icon: rbtc,
        queryKey: 'RSK',
        defaultName: 'SmartBitcoin',
    },
    RIF: {
        networkId: 137,
        icon: rif,
        queryKey: 'RIF',
        defaultName: 'RIF',
    },
    BTCTestNet: {
        networkId: 1,
        network: networks.testnet,
        icon: btc,
        queryKey: 'TBTC',
        defaultName: 'Bitcoin Testnet',
    },
    RBTCTestNet: {
        networkId: 37310,
        icon: rbtc,
        queryKey: 'TRSK',
        defaultName: 'SmartBitcoin Testnet',
    },
    RIFTestNet: {
        networkId: 37310,
        icon: rif,
        queryKey: 'TRIF',
        defaultName: 'RIF Testnet',
    }
}

class Coin {
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
    async generate_master_from_recovery_phrase(phrase){
        let seed = await mnemonicToSeed(phrase);
        console.log(`generate_master_from_recovery_phrase, seed: ${seed}`);
        this.master = fromSeed(seed, this.network).toBase58();
        return this.master;
    }
    getNetworkNode() {
        let path = "m/44'/" + this.networkId + "'/0'";
        let pk = fromBase58(this.master, this.network)
            .derivePath(path)
            .neutered()
            .toBase58();
        this.networkNode = new PathKeyPair(path, pk);
        return this.networkNode;
    }
    async derive(phrase){
        await this.generate_master_from_recovery_phrase(phrase);
        this.getNetworkNode();
        this.generateAccountNode(0);
        this.generateAddressNode(0);
        this.generateAddress();
    }
    generateAccountNode(index){
        let path = this.networkNode.path + '/' + index;
        let public_key = this.deriveChildFromNode(
            this.networkNode.public_key,
            index
        );
        this.accountNode = new PathKeyPair(path, public_key);
        return this.accountNode;
    }
    generateAddressNode(index){
        let pk = this.accountNode;
        let path = pk.path + '/' + index;
        console.log(`[TRACE]generateAddressNode, index: ${index}, pk: ${JSON.stringify(pk)}, path: ${path}`);
        let result = this.deriveChildFromNode(pk.public_key, index)
        console.log(`[TRACE]generateAddressNode, publicKey: ${result}`);
        this.addressNode = new PathKeyPair(path, result);
        return this.addressNode;
    }
    generateAddress(){
        let options = {
            pubkey: fromBase58(this.addressNode.public_key, this.network).publicKey,
            network: this.network,
        };
        console.log(`[TRACE]BaseBtcCryptoNetwork::get_address, pubkey: ${options.pubkey}, network: ${options.network}`);
        this.address = payments.p2pkh(options).address
        return this.address;
    }
    deriveChildFromNode(node, index) {
        let t = fromBase58(node, this.network).derive(index);
        return t.toBase58();
    }
}

class RBTCCoin {
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
    serializePrivate(node: HDNode): string {
        let ret: any = {
            prk: node.privateKey.toString('hex'),
            cc: node.chainCode.toString('hex')
        };
        return JSON.stringify(ret);
    }
    fromMasterSeed(seed_buffer: Buffer) {
        //let t = HmacSHA512(lib.WordArray.create(seed_buffer), 'Bitcoin seed').toString();
        //let I = new Buffer(t, 'hex');
        let I = crypto_1.createHmac('sha512', MASTER_SECRET)
            .update(seed_buffer)
            .digest();
        let IL = I.slice(0, 32);
        let IR = I.slice(32);

        let ret = new HDNode();
        ret.chainCode = IR;
        ret.privateKey = IL;

        return ret;
    }
    async generate_master_from_recovery_phrase(phrase){
        let seed = await mnemonicToSeed(phrase);
        console.log(`[TRACE]RBTCCoin::generate_master_from_recovery_phrase, seed: ${seed}`);
        let master = this.fromMasterSeed(seed);
        return this.serializePrivate(master);
    }
    generate_root_node_from_master(s) {
        console.log(`[TRACE]RBTCCoin::generate_root_node_from_master, s: ${s}`);
        let node = deserializePrivate(s);
        let path = "m/44'/" + this.networkId + "'/0'";
        node = node.derive(path);
        return new PathKeyPair(path, serializePublic(node));
    }
    async derive(phrase){
        let master = await this.generate_master_from_recovery_phrase(phrase);
        this.networkNode = this.generate_root_node_from_master(master);
        this.generateAccountNode(0);
        this.generateAddressNode(0);
        this.address = this.get_address(this.addressNode.public_key);
    }

    generateAccountNode(index){
        let path = this.networkNode.path + '/' + index;
        let public_key = this.deriveChildFromNode(
            this.networkNode.public_key,
            index
        );
        this.accountNode = new PathKeyPair(path, public_key);
        return this.accountNode;
    }

    generateAddressNode(index){
        let path = this.accountNode.path + '/' + index;
        let public_key = this.deriveChildFromNode(
            this.accountNode.public_key,
            index
        );
        this.addressNode = new PathKeyPair(path, public_key);
        return this.addressNode;
    }

    deriveChildFromNode(s, index) {
        let deserialized = deserializePublic(s) || deserializePrivate(s);
        return serializePublic(deserialized.deriveChild(index));
    }
    get_address(s) {
        let public_key = JSON.parse(s).puk;
        let address_bin = ethereumjs_util_1.pubToAddress(new Buffer(public_key, 'hex'), true);
        let address = Buffer.from(address_bin).toString('hex');
        return this.to_checksum_address(address);
    }
    to_checksum_address(s) {
        return ethereumjs_util_1.toChecksumAddress(s);
    }
}

export default class Wallet {
    constructor(name='Account'){
        this.id = 0,
        this.name = name,
        this.coins = [
            new Coin('BTC'),
            // new Coin('BTCTestNet'),
            new RBTCCoin('RBTC'),
            // new RBTCCoin('RBTCTestNet'),
            new RBTCCoin('RIF'),
            // new RBTCCoin('RIFTestNet'),
        ];
    }
    static async create(name, phrase=null){
        if(!phrase){
            let mnemonic = new Mnemonic(Mnemonic.Words.ENGLISH);
            phrase = mnemonic.phrase;
        }
        let wallet = new Wallet(name);
        wallet.phrase = phrase;
        await wallet.derive();
        return wallet;
    }
    static async load(master){
        let wallet = new Wallet();
        return wallet;
    }
    async derive(){
        for(let i=0; i<this.coins.length; i++){
            let coin = this.coins[i];
            await coin.derive(this.phrase);
        }
    }
    // async getMaster(){
    //     let master = null;
    //     try{
    //         master = await storage.load({key: 'master'});
    //     }catch(e){}
    //     if(!master){
    //         let mnemonic = this.generateMnemonic();
    //         let master = await this.generate_master_from_recovery_phrase(mnemonic.phrase);
    //         await storage.save('master', master);
    //         return {master, phrase: mnemonic.phrase};
    //     } else {
    //         return {master};
    //     }
    // },
}

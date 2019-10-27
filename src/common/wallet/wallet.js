const Mnemonic = require('bitcore-mnemonic');
import {BIP32, fromPrivateKey, fromPublicKey, fromSeed, fromBase58} from 'bip32';
import {mnemonicToSeed, generateMnemonic, wordlists} from 'bip39';
import storage from '../storage'
import {
    address, ECPair, networks, payments, TransactionBuilder, Transaction, Network
} from 'bitcoinjs-lib';

class PathKeyPair {
    constructor(path = '', pk = '') {
        this.path = path;
        this.public_key = pk;
    }
}

let coinType = {
    BTC: {
        networkId: 0,
        network: networks.bitcoin,
    },
    RBTC: {
        networkId: 137,
    },
    RIF: {
        networkId: 137,
    },
    BTCTestNet: {
        networkId: 1,
        network: networks.testnet,
    },
    RBTCTestNet: {
        networkId: 37310,
    },
    RIFTestNet: {
        networkId: 37310,
    }
}

class Coin {
    constructor(network) {
        this.type = network;
        this.networkId = coinType[network].networkId;
        this.network = coinType[network].network;
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

export default class Wallet {
    constructor(name='Account'){
        this.id = 0,
        this.name = name,
        this.coins = [
            new Coin('BTC'),
            new Coin('BTCTestNet'),
        ];
    }
    static async create(name, phrase=null){
        if(!phrase){
            let mnemonic = new Mnemonic(Mnemonic.Words.ENGLISH);
            phrase = mnemonic.phrase;
        }
        let wallet = new Wallet(name);
        await wallet.derive(phrase);
        return wallet;
    }
    static async load(master){
        let wallet = new Wallet();
        return wallet;
    }
    async derive(phrase){
        for(let i=0; i<this.coins.length; i++){
            let coin = this.coins[i];
            await coin.derive(phrase);
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

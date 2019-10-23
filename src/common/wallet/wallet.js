const Mnemonic = require('bitcore-mnemonic');
import {BIP32, fromPrivateKey, fromPublicKey, fromSeed, fromBase58} from 'bip32';
import {mnemonicToSeed, generateMnemonic, wordlists} from 'bip39';
import storage from '../storage'

import {
    address,
    ECPair,
    networks,
    payments,
    TransactionBuilder,
    Transaction,
    Network
} from 'bitcoinjs-lib';

class PathKeyPair {
    constructor(path = '', pk = '') {
        this.path = path;
        this.public_key = pk;
    }
}

// const web3 = require('web3');
export default wallet = {
	global_keystore: null,
	get_network() {
        return networks.bitcoin;
    },
    async getMnemonic(extraEntropy){
        var t = '';
        let mnemonic = await storage.load<t>('mnemonic');
        if(!mnemonic){
            mnemonic = this.generateMnemonic();
            let seed = mnemonic.toSeed();
            let phrase = mnemonic.phrase;
            mnemonic = {seed, phrase}
            await storage.save('mnemonic', JSON.stringify(mnemonic));
        } else {
            mnemonic = JSON.parse(mnemonic);
        }
        return mnemonic;
    },
	generateMnemonic(extraEntropy){
		let mnemonic = new Mnemonic(Mnemonic.Words.ENGLISH);
		return mnemonic;
	},
	async generate_master_from_recovery_phrase(phrase){
        let seed = await mnemonicToSeed(phrase);
        console.log(`generate_master_from_recovery_phrase, seed: ${seed}`);
        return fromSeed(seed, this.get_network()).toBase58();
    },
    generate_root_node_from_master(master) {
        let path = "m/44'/" + this.get_network_id() + "'/0'";
        let pk = fromBase58(master, this.get_network())
            .derivePath(path)
            .neutered()
            .toBase58();
        return new PathKeyPair(path, pk);
    },
    generate_local_root_node(rootNode, index){
        let path = rootNode.path + '/' + index;
        let public_key = this.derive_child_from_node(
            rootNode.public_key,
            index
        );
        return new PathKeyPair(path, public_key);
    },
    derive_child_from_node(node, index) {
        let t = fromBase58(node, this.get_network()).derive(index);
        return t.toBase58();
    },
    generate_child_public_key(local_root_node, index){
        let pk = local_root_node;
        let path = pk.path + '/' + index;
        console.log(`[TRACE]generate_child_public_key, index: ${index}, pk: ${JSON.stringify(pk)}, path: ${path}`);
        let result = this.derive_child_from_node(pk.public_key, index)
        console.log(
            'Generated key ' +
                path +
                ' ' +
                result +
                ' ' +
                (this.get_address(result))
        );
		let pkp = new PathKeyPair(path, result);
		return pkp;
    },
    get_address(node){
        console.log(`[TRACE]BaseBtcCryptoNetwork::get_address, node: ${node}`);
        let options = {
            pubkey: fromBase58(node, this.get_network()).publicKey,
            network: this.get_network()
        };
        console.log(`[TRACE]BaseBtcCryptoNetwork::get_address, pubkey: ${options.pubkey}, network: ${options.network}`);
        return payments.p2pkh(options).address;
    },

    get_receive_address(pk){
		let addr = this.get_address(pk.public_key);
		return addr;
    },

    get_network_id() {
        return 0;
    }
	// setWeb3Provider(keystore) {
	// 	var web3Provider = new HookedWeb3Provider({
	// 	  host: 'https://rinkeby.infura.io/',
	// 	  transaction_signer: keystore
	// 	});

	// 	web3.setProvider(web3Provider);
	// }
};

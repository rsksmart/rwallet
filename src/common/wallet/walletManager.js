const Mnemonic = require('bitcore-mnemonic');
import {BIP32, fromPrivateKey, fromPublicKey, fromSeed, fromBase58} from 'bip32';
import {mnemonicToSeed, generateMnemonic, wordlists} from 'bip39';
import storage from '../storage'
import {
    address, ECPair, networks, payments, TransactionBuilder, Transaction, Network
} from 'bitcoinjs-lib';
import Wallet from './wallet'

class PathKeyPair {
    constructor(path = '', pk = '') {
        this.path = path;
        this.public_key = pk;
    }
}

export default walletManager = {
    wallets: [],
    async createWallet(name, phrase=null){
        let wallet = await Wallet.create(name, phrase);
        this.wallets.push(wallet);
        return wallet;
    },
    loadWallets(){
        let wallets = [
            {master: '1111'},
            {master: '2222'},
        ];
        wallets.forEach((wallet2)=>{
            let wallet = Wallet.load(wallet2.master);
            this.wallets.push(wallet);
        });
    },
};

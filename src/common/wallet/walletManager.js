const Mnemonic = require('bitcore-mnemonic');
import {BIP32, fromPrivateKey, fromPublicKey, fromSeed, fromBase58} from 'bip32';
import {mnemonicToSeed, generateMnemonic, wordlists} from 'bip39';
import {
    address, ECPair, networks, payments, TransactionBuilder, Transaction, Network
} from 'bitcoinjs-lib';
import Wallet from './wallet'
import appContext from '../appContext'

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
        return wallet;
    },
    async addWallet(wallet){
       this.wallets.push(wallet);
       await this.saveWallets();
    },
    async saveWallets(){
        let wallets = [];
        for (var i = 0; i < this.wallets.length; i++) {
            wallets.push({phrase: this.wallets[i].phrase});
        }
        await appContext.set('wallets', wallets);
    },
    async loadWallets(){
        let wallets = appContext.data.wallets;
        for(let i=0; i<wallets.length; i++){
            let item = wallets[i];
            let wallet = await Wallet.create('', item.phrase);
            this.wallets.push(wallet);
        }
    }
};

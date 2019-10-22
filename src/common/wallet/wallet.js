const lightwallet = require('eth-lightwallet');

import {
    address,
    ECPair,
    networks,
    payments,
    TransactionBuilder,
    Transaction,
    Network
} from 'bitcoinjs-lib';

// const web3 = require('web3');
export default wallet = {
	global_keystore: null,
	generateRecoverPhrase(extraEntropy){
		let randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
		return randomSeed;
	},
	newWallet() {
	    let extraEntropy = 'xcvxd';
	    let randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
	    alert(randomSeed);
	    let password = '123456';
	    lightwallet.keystore.createVault({
	      password,
	      seedPhrase: randomSeed,
	      hdPathString: 'm/0\'/0\'/0\'' // random salt
	    }, (err, ks)=>{
			this.global_keystore = ks;
			alert(ks);
			this.newAddresses(password);
	      // setWeb3Provider(global_keystore);
	      // getBalances();
	    });
	},
  	newAddresses(password) {
		let numAddr = 3;
		this.global_keystore.keyFromPassword(password, (err, pwDerivedKey)=>{
			this.global_keystore.generateNewAddress(pwDerivedKey, numAddr);
			let addresses = this.global_keystore.getAddresses();
			alert(addresses[0])
		});
	},
	// setWeb3Provider(keystore) {
	// 	var web3Provider = new HookedWeb3Provider({
	// 	  host: 'https://rinkeby.infura.io/',
	// 	  transaction_signer: keystore
	// 	});

	// 	web3.setProvider(web3Provider);
	// }
};

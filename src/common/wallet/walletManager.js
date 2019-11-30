// import RNSecureStorage from 'rn-secure-storage';
import Wallet from './wallet';
import storage from '../storage';
import appContext from '../appContext';

class WalletManager {
  constructor() {
    this.wallets = [];
    this.currentKeyId = 0;
  }

  async createWallet(name, phrase = null, coins) {
    // 1. Create a Wallet instance and save into wallets
    const wallet = Wallet.create(this.currentKeyId, name, phrase, coins);

    this.wallets.push(wallet);

    this.savePhraseToSecureStorage(wallet.id, wallet.phrase);

    // Increment current pointer
    this.currentKeyId += 1;

    this.saveToStorage();

    // Save to storage

    return this.currentKeyId;
  }

  async saveToStorage() {
    const json = this.toJson();
    await storage.save('wallets', json);
  }


  async restoreFromStorage() {
    const { wallets } = this;

    const walletsJson = await storage.load({ key: 'wallets' });

    walletsJson.forEach(async (item) => {
      const phrase = await appContext.getPhrase(item.id);
      const wallet = Wallet.create('', phrase);

      if (wallet) {
        wallets.add(wallet);
      }
    });
  }

  /**
   * Returns a JSON containing an array of wallet to save required data to backend server.
   * Returns empty array if there's no wallet
   */
  toJson() {
    const results = {
      currentKeyId: this.currentKeyId,
      wallets: [],
    };

    this.wallets.forEach((wallet) => {
      results.wallets.push(wallet.toJson());
    });

    return results;
  }

  // serialize() {

  // }

  // deserialize() {

  // }
}

export default new WalletManager();


// const walletManager = {
//   wallets: [],

//   createWallet(name, phrase = null, coins) {
//     const wallet = Wallet.create(name, phrase, coins);
//     return wallet;
//   },
//   async addWallet(wallet) {
//     const newWallet = wallet;
//     this.wallets.push(newWallet);
//     const coins = [];
//     newWallet.coins.forEach((coin) => {
//       coins.push({ type: coin.type, address: coin.address });
//     });
//     const item = { phrase: newWallet.mnemonic.phrase, coins };
//     const keyId = await appContext.addWallet(item);
//     newWallet.keyId = keyId;
//     return keyId;
//   },
//   async loadWallets() {
//     const { wallets } = appContext.data;
//     for (let i = 0; i < wallets.length; i += 1) {
//       const item = wallets[i];
//       // eslint-disable-next-line no-await-in-loop
//       const phrase = await appContext.getPhrase(item.id);
//       const wallet = Wallet.create('', phrase);
//       wallet.id = item.id;
//       this.wallets.push(wallet);
//     }
//   },

// };

// export default walletManager;

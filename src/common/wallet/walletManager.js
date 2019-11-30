// import RNSecureStorage from 'rn-secure-storage';
import _ from 'lodash';
import Wallet from './wallet';
import storage from '../storage';
import appContext from '../appContext';

const STORAGE_KEY = 'wallets';

class WalletManager {
  constructor(wallets = [], currentKeyId = 0) {
    this.wallets = wallets;
    this.currentKeyId = currentKeyId;
  }

  async createWallet(name, phrase = null, coins) {
    // 1. Create a Wallet instance and save into wallets
    const wallet = Wallet.create({
      id: this.currentKeyId, name, phrase, coinTypes: coins,
    });

    this.wallets.push(wallet);

    // Increment current pointer
    this.currentKeyId += 1;

    // Save to storage
    this.serialize();
  }

  async restoreFromStorage() {
    const { wallets } = this;

    const walletsJson = await storage.load({ key: STORAGE_KEY });

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
  toJSON() {
    const results = {
      currentKeyId: this.currentKeyId,
      wallets: [],
    };

    this.wallets.forEach((wallet) => {
      results.wallets.push(wallet.toJSON());
    });

    return results;
  }

  /**
   * Save JSON presentation of Wallets data to permenate storage
   */
  async serialize() {
    const jsonData = this.data.toJSON();
    await storage.save(STORAGE_KEY, jsonData);
  }

  /**
   * Read permenate storage and load Wallets into this instance;
   */
  async deserialize() {
    const result = await storage.load({ key: 'wallets' });

    console.log('Deserialized Wallets from Storage.', result);

    if (!_.isNull(result) && _.isObject(result)) {
      if (_.isNumber(result.currentKeyId)) {
        this.currentKeyId = result.currentKeyId;
      }

      const { wallets } = this;

      _.each(result.wallets, (walletJSON) => {
        wallets.push(Wallet.fromJSON(walletJSON));
      });
    }
  }
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

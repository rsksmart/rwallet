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

  async createWallet(name, phrase, coins) {
    // 1. Create a Wallet instance and save into wallets
    const wallet = await Wallet.create({
      id: this.currentKeyId, name, phrase, coinTypes: coins,
    });

    this.wallets.push(wallet);

    // Increment current pointer
    this.currentKeyId += 1;

    // Save to storage
    await this.serialize();

    return wallet;
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
    const jsonData = {
      currentKeyId: this.currentKeyId,
      wallets: _.map(this.wallets, (wallet) => wallet.toJSON()),
    };

    await storage.save(STORAGE_KEY, jsonData);
  }

  /**
   * Read permenate storage and load Wallets into this instance;
   */
  async deserialize() {
    const result = await storage.load({ key: 'wallets' });

    console.log('Deserialized Wallets from Storage.', result);

    if (!_.isNull(result) && _.isObject(result)) {
      // Retrieve currentKeyId from storage result
      if (_.isNumber(result.currentKeyId)) {
        this.currentKeyId = result.currentKeyId;
      }

      // Re-create Wallet objects based on result.wallets JSON
      const promises = _.map(result.wallets, (walletJSON) => Wallet.fromJSON(walletJSON));
      const wallets = _.filter(await Promise.all(promises), (obj) => !_.isNull(obj));

      console.log('deserialize.wallets', wallets);
      this.wallets = wallets;
    }
  }
}

export default new WalletManager();

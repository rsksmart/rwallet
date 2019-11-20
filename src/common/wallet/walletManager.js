import Wallet from './wallet';
import appContext from '../appContext';

const walletManager = {
  wallets: [],
  createWallet(name, phrase = null, coins) {
    const wallet = Wallet.create(name, phrase, coins);
    return wallet;
  },
  async addWallet(wallet) {
    this.wallets.push(wallet);
    await this.saveWallets();
  },
  async saveWallets() {
    const wallets = [];
    for (let i = 0; i < this.wallets.length; i += 1) {
      const wallet = this.wallets[i];
      const coins = [];
      wallet.coins.forEach((coin) => {
        coins.push({ type: coin.type, address: coin.address });
      });
      wallets.push({ phrase: this.wallets[i].mnemonic.phrase, coins });
    }
    // await appContext.set('wallets', wallets);
    await appContext.saveWallets(wallets);
  },
  loadWallets() {
    const { wallets } = appContext.data;
    for (let i = 0; i < wallets.length; i += 1) {
      const item = wallets[i];
      const wallet = Wallet.create('', item.phrase);
      this.wallets.push(wallet);
    }
  },

  /**
   * Returns a JSON containing an array of wallet to save required data to backend server.
   * Returns empty array if there's no wallet
   */
  toJson() {
    const results = [];

    this.wallets.forEach((wallet) => {
      results.push(wallet.toJson());
    });

    return results;
  },
};

export default walletManager;

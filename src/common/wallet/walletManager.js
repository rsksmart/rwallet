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
      wallets.push({ phrase: this.wallets[i].phrase });
    }
    await appContext.set('wallets', wallets);
  },
  loadWallets() {
    const { wallets } = appContext.data;
    for (let i = 0; i < wallets.length; i += 1) {
      const item = wallets[i];
      const wallet = Wallet.create('', item.phrase);
      this.wallets.push(wallet);
    }
  },
};

export default walletManager;

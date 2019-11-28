import Wallet from './wallet';
import appContext from '../appContext';

const walletManager = {
  wallets: [],
  createWallet(name, phrase = null, coins) {
    const wallet = Wallet.create(name, phrase, coins);
    return wallet;
  },
  async addWallet(wallet) {
    const newWallet = wallet;
    const coins = [];
    newWallet.coins.forEach((coin) => {
      coins.push({ type: coin.type, address: coin.address });
    });
    const item = { phrase: newWallet.mnemonic.phrase, coins };
    const walletId = await appContext.addWallet(item);
    newWallet.walletId = walletId;
    this.wallets.push(newWallet);
    return walletId;
  },
  async loadWallets() {
    const { wallets } = appContext.data;
    for (let i = 0; i < wallets.length; i += 1) {
      const item = wallets[i];
      // eslint-disable-next-line no-await-in-loop
      const phrase = await appContext.getPhrase(item.id);
      const wallet = Wallet.create('', phrase);
      wallet.id = item.id;
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

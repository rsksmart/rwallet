import storage from './storage';

const appContext = {
  loadData() {
    this.walletKeyId = 0;
  },
  data: {
    walletKeyId: 0,
    wallets: [],
  },
  async init(walletManager) {
    let data = null;
    try {
      data = await storage.load({ key: 'data' });
    } catch (e) {
      console.log(e);
    }
    if (!data) {
      await storage.save('data', this.data);
    }
    data = await storage.load({ key: 'data' });
    this.data = data;
    walletManager.loadWallets();
  },
  async set(key, value) {
    this.data[key] = value;
    await storage.save('data', this.data);
  },
};
export default appContext;

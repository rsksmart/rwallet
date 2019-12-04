import RNSecureStorage from 'rn-secure-storage';
import storage from './storage';

const appContext = {
  loadData() {
    this.walletId = 0;
  },
  data: {
    walletId: 0,
    wallets: [],
    user: null,
    settings: {
      currency: 'USD',
      fingerprint: false,
      language: 'en',
    },
  },
  user: null,
  async set(key, value) {
    this.data[key] = value;
    await storage.save('data', this.data);
  },
  async secureSet(key, value) {
    await RNSecureStorage.set(key, value, {});
  },
  async secureGet(key) {
    try {
      const exists = await RNSecureStorage.exists(key);
      return exists ? await RNSecureStorage.get(key) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};

export default appContext;

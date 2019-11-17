import I18n from 'react-native-i18n';
import storage from './storage';

const appContext = {
  loadData() {
    this.walletKeyId = 0;
  },
  data: {
    walletKeyId: 0,
    wallets: [],
    language: I18n.currentLocale(),
  },
  async set(key, value) {
    this.data[key] = value;
    await storage.save('data', this.data);
  },
};


export default appContext;

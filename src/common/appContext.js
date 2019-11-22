import I18n from 'react-native-i18n';
import RNSecureStorage from 'rn-secure-storage';
import storage from './storage';
import ParseHelper from './parse';

const appContext = {
  loadData() {
    this.walletKeyId = 0;
  },
  data: {
    walletKeyId: 0,
    wallets: [],
    language: I18n.currentLocale(),
    user: null,
    settings: {
      fingerprint: false,
    },
  },
  user: null,
  async set(key, value) {
    this.data[key] = value;
    await storage.save('data', this.data);
  },
  secureSet(key, value, callback = null) {
    RNSecureStorage.set(key, value, {}).then((res) => {
      console.log(`RNSecureStorage.set, res: ${res}`);
      if (callback) {
        callback();
      }
    }, (err) => {
      console.log(err);
    });
  },
  secureGet(key, callback) {
    RNSecureStorage.exists(key).then((res) => {
      if (!res) {
        callback(null);
      } else {
        RNSecureStorage.get(key).then((value) => {
          console.log(`RNSecureStorage.get, key: ${key}`);
          if (callback) {
            callback(value);
          }
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  },
  async saveSettings(settings) {
    Object.assign(this.data.settings, settings);
    await this.set('settings', this.data.settings);
    await ParseHelper.uploadSettings(this.user, this.data.settings);
  },
  async saveWallets(wallets) {
    await this.set('wallets', wallets);
    const uploadWallets = [];
    wallets.forEach((wallet) => {
      const item = { coins: wallet.coins };
      uploadWallets.push(item);
    });
    await ParseHelper.uploadWallets(this.user, uploadWallets);
  },
};

export default appContext;

import I18n from 'react-native-i18n';
import RNSecureStorage from 'rn-secure-storage';
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
    RNSecureStorage.get(key).then((value) => {
      console.log(`RNSecureStorage.get, key: ${key}`);
      if (callback) {
        callback(value);
      }
    }, (err) => {
      console.log(err);
    });
  },
};


export default appContext;

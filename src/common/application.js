import I18n from './i18n';
import walletManager from './wallet/walletManager';
import storage from './storage';
import actions from '../redux/languageSwitcher/actions';
import appActions from '../redux/app/actions';
import store from '../redux/store';
import appContext from './appContext';

const Application = {
  async init() {
    let data = null;
    try {
      data = await storage.load({ key: 'data' });
    } catch (e) {
      console.log(e);
    }
    const currentLocale = I18n.currentLocale();
    console.log(`Application::init, currentLocale: ${currentLocale}`);
    if (!data) {
      appContext.data.language = this.initLanguage();
      await storage.save('data', appContext.data);
    }
    data = await storage.load({ key: 'data' });
    appContext.data = data;
    store.dispatch(
      actions.changeLanguage(data.settings.language),
    );
    store.dispatch(
      appActions.changeCurrency(data.settings.currency),
    );
    await walletManager.loadWallets();
  },
  initLanguage() {
    const currentLocale = I18n.currentLocale();
    console.log(`Application::initLanguage, currentLocale: ${currentLocale}`);
    if (currentLocale.indexOf('fr') === 0) {
      return 'fr';
    }
    if (currentLocale.indexOf('he') === 0) {
      return 'he';
    }
    if (currentLocale.indexOf('zh') === 0) {
      return 'zh';
    }
    return 'en';
  },
};

export default Application;

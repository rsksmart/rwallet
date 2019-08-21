
import * as config from './i18n-conf';

export default {
  type: 'backend',
  init: () => { },
  read: (language, namespace, callback) => {
    let resource = null;
    let error = null;
    try {
      resource = config
        .supportedLocales[language]
        .translationFileLoader[namespace];
    } catch (_error) {
      error = _error;
    }
    callback(error, resource);
  },
};

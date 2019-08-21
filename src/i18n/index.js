import i18next from 'i18next';
import * as config from './i18n-conf';

import languageDetector from './language-detector';
import translationLoader from './translation-loader';
import translationUpdater from './translation-updater';

const missingKeyHandler = (lng, ns, key, fallbackValue) => {
  translationUpdater(lng[0], key, fallbackValue);
};

const i18n = {
  /**
   * Returns a Promise to initialize the i18next
   * @returns {Promise}
   */
  init: () => new Promise((resolve, reject) => {
    i18next
      .use(languageDetector)
      .use(translationLoader)
      .init({
        fallbackLng: config.fallback,
        ns: config.namespaces,
        defaultNS: config.defaultNamespace,
        whitelist: ['en', 'es'], // New supported languages should be added here
        keySeparator: '__',
        saveMissing: true,
        saveMissingTo: 'all',
        missingKeyHandler,
      }, (error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
  }),


  /**
   * Returns the translated string.
   * @param {string} key
   * @param {Object} options
   * @returns {string}
   */
  t: (key, options) => i18next.t(key, options),

  /**
   * Returns the initialized language
   * @returns {string}
   */
  locale: () => i18next.language,

};

export const { t } = i18n;

export default i18n;

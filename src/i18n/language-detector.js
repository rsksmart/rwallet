import { getLanguage } from 'mellowallet/src/utils';

export default {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    // It will return a string like "en_US".
    // Changed it to return a string like "en" to match our language
    // files.
    const language = await getLanguage();
    callback(language);
  },
  init: () => { },
  cacheUserLanguage: () => { },
};

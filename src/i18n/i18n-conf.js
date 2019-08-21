export const fallback = 'en';

const enFile = require('../languages/en.json');
const esFile = require('../languages/es.json');

export const supportedLocales = {
  en: {
    name: 'English',
    translationFileLoader: enFile,
  },
  es: {
    name: 'Spanish',
    translationFileLoader: esFile,
  },
};

export const defaultNamespace = 'translations';

// All the new names spaces should be added here
export const namespaces = [
  'translations',
];

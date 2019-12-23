import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

// Import all locales
import en from './translations/en.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import zh from './translations/zh.json';

// Change the default separator
// https://github.com/AlexanderZaytsev/react-native-i18n/issues/73
I18n.defaultSeparator = '/';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en, es, pt, zh,
};

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// If contain translation, return translation, else return original text.
export function strings(name, params = {}) {
  const translation = I18n.t(name, { ...params, defaultValue: name });
  return translation;
}


export default I18n;

import ReactNative from 'react-native';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import config from '../../config';

// Import all locales
import en from './translations/en.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import zh from './translations/zh.json';
import ptBR from './translations/pt-BR.json';
import ja from './translations/ja.json';
import ko from './translations/ko.json';
import ru from './translations/ru.json';

// Change the default separator
// https://github.com/AlexanderZaytsev/react-native-i18n/issues/73
I18n.defaultSeparator = '.';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en, es, pt, zh, 'pt-BR': ptBR, ja, ko, ru,
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

/**
 * get matched language from current locale
 * for example
 * If currentLocale is en-us, en-nz or en-ca, return en
 * If currentLocale is zh-cn, zh-hk or zh-tw, return zh
 */
export function getCurrentLanguage() {
  const keys = Object.keys(I18n.translations);
  let foundLanguage = _.find(keys, (key) => key === currentLocale);
  if (foundLanguage) {
    return foundLanguage;
  }
  let currentLanguage = config.defaultSettings.language;
  const regex = /^([a-z]+)[_-].*/g;
  const language = currentLocale.replace(regex, '$1');
  foundLanguage = _.find(keys, (key) => key === language);
  currentLanguage = foundLanguage || currentLanguage;
  return currentLanguage;
}

export default I18n;

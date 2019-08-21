import {
  AsyncStorage,
  Clipboard,
  Linking,
} from 'react-native';
import { Toast } from 'native-base';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import { conf } from './constants';


export function showToast(msg, type) {
  return Toast.show({
    text: msg,
    position: 'bottom',
    type,
    textStyle: { textAlign: 'center' },
    duration: 5000
  });
}

/**
 * Copy value to the clipboard and show a toast after that
 * @param {*} value
 * @param {*} successMessage
 */
export async function copy(value, successMessage) {
  await Clipboard.setString(value);
  return showToast(successMessage, 'default');
}

/**
 * Get the value copied previously
 */
export async function paste() {
  return Clipboard.getString();
}

/**
 * Returns navigation optiosn with tabBarVisible equals true
 * if the tab navigation should be visible.
 * Otherwise returns it with equals false.
 * @param {*} navigation
 */
export function manageTabNavigatorVisibility({ navigation }) {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
}

export function truncate(value, digits, maxDigits = 0) {
  let finalDigits = digits;
  if (maxDigits) {
    const intValue = value.split('.')[0];
    if (intValue.length > maxDigits) {
      return intValue;
    }

    finalDigits = maxDigits - intValue.length;
  }

  return parseFloat(value)
    .toFixed(finalDigits);
}

export function round(value, digits) {
  return parseFloat(value)
    .toFixed(digits);
}

export function openLink(link) {
  return Linking.openURL(link);
}

export function printError(e) {
  const message = e.error_message || e.message || e;
  return showToast(message, 'danger');
}

export async function getLanguage() {
  let language = await AsyncStorage.getItem(AsyncStorageEnum.LANGUAGE);
  if (!language) {
    language = Expo.Localization.locale;
  }
  return language.split('_')[0];
}

export function cotizationVariationFormatter(variation) {
  if (variation < 0) {
    return `- ${Math.abs(round(variation, conf('FIAT_DECIMAL_PLACES')))
      .toFixed(conf('FIAT_DECIMAL_PLACES'))}`;
  }
  return `+ ${parseFloat(round(variation, conf('FIAT_DECIMAL_PLACES')))
    .toFixed(conf('FIAT_DECIMAL_PLACES'))}`;
}

export function fiatValueFormatter(fiatValue) {
  return `${parseFloat(round(fiatValue, conf('FIAT_DECIMAL_PLACES')))
    .toFixed(conf('FIAT_DECIMAL_PLACES'))}`;
}

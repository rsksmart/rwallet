import { PARSE_SERVER_URL, RWALLET_API_KEY, RWALLET_ENV } from 'react-native-dotenv';
import { isEmpty } from 'lodash';
import fontFamily from './src/assets/styles/font.family';

if (isEmpty(PARSE_SERVER_URL)) {
  throw new Error('PARSE_SERVER_URL needs to be defined in .env under the root.');
}

const config = {

  parse: {

    appId: 'rwallet',
    javascriptKey: '',
    serverURL: PARSE_SERVER_URL,
    rwalletApiKey: RWALLET_API_KEY,
    rwalletEnv: RWALLET_ENV,
  },
  defaultSettings: {
    username: undefined,
    language: 'en',
    currency: 'USD',
    fingerprint: false,
  },
  consts: {
    supportedTokens: ['BTC', 'RBTC', 'RIF', 'DOC', 'RIFP', 'RDOC', 'BITP', 'BRZ'],

    locales: [
      { name: 'English', id: 'en' },
      { name: 'Spanish', id: 'es' },
      { name: 'Portuguese', id: 'pt' },
      { name: 'Chinese', id: 'zh' },
      { name: 'Brazilian Portuguese', id: 'pt-BR' },
      { name: 'Japanese', id: 'ja' },
      { name: 'Russian', id: 'ru' },
      { name: 'Korean', id: 'ko' },
    ],
    currencies: [
      { name: 'USD', symbol: '$' },
      { name: 'ARS', symbol: 'ARS$' },
      { name: 'JPY', symbol: '￥' },
      { name: 'KRW', symbol: '₩' },
      { name: 'CNY', symbol: '￥' },
      { name: 'GBP', symbol: '£' },
    ],
  },
  development: {
    reduxLoggerEnabled: false,
  },
  symbolDecimalPlaces: {
    BTC: 6,
    RBTC: 6,
    RIF: 3,
    DOC: 3,
    CustomToken: 6,
  },
  assetValueDecimalPlaces: 2,
  transactionUrls: {
    BTC: {
      Mainnet: 'https://live.blockcypher.com/btc/txs',
      Testnet: 'https://live.blockcypher.com/btc-testnet/txs',
    },
    RBTC: {
      Mainnet: 'https://explorer.rsk.co/txs',
      Testnet: 'https://explorer.testnet.rsk.co/txs',
    },
    RIF: {
      Mainnet: 'https://explorer.rsk.co/txs',
      Testnet: 'https://explorer.testnet.rsk.co/txs',
    },
    DOC: {
      Mainnet: 'https://explorer.rsk.co/txs',
      Testnet: 'https://explorer.testnet.rsk.co/txs',
    },
  },
  addressUrls: {
    RBTC: {
      Mainnet: 'https://explorer.rsk.co/addresses',
      Testnet: 'https://explorer.testnet.rsk.co/addresses',
    },
  },
  defaultFontFamily: fontFamily.Roboto, // defaultFontFamily, for android
  coinswitch: {
    // Put the initPair here because
    // 1. constrain the user to select the pair, which is only supported by coinswitch.
    // 2. use it as a array, basically we need failback. Because always 2 precondition need to be fullfilled before useing going forward (1. coinswitch supporting 2. use has the specific coin)
    // 3. Since based on the current logic, we will alwauys know one of them beforehand. So to take advantage of this, by using key-value
    initPairs: {
      BTC: ['RBTC', 'DOC'],
      RBTC: ['BTC'],
      DOC: ['BTC'],
    },
  },
  appLock: {
    timeout: 300000,
  },
  termsUrl: {
    en: 'https://www.rsk.co/terms-conditions',
    zh: 'https://www.rsk.co/zh-Hans/terms-conditions',
    es: 'https://www.rsk.co/es/terms-conditions',
    pt: 'https://www.rsk.co/pt-pt/terms-conditions',
    'pt-BR': 'https://www.rsk.co/pt-pt/terms-conditions',
    ru: 'https://www.rsk.co/ru/terms-conditions',
    ko: 'https://www.rsk.co/ko/terms-conditions',
    ja: 'https://www.rsk.co/ja/terms-conditions',
  },
  accountBasedRskAddressUrl: 'https://developers.rsk.co/rsk/architecture/account-based/',
  rnsDomain: 'wallet.rsk',
  storageVersion: 3,
  defaultDappIcon: 'https://storage.googleapis.com/storage-rwallet/rwallet.png',
};

export default config;

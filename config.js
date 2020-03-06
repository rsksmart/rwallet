/** App level configurations */
// serverURL list
// Dogfood http://130.211.12.3/parse
// Dev Android Simulator http://10.0.2.2:1338/parse
// Dev iOS Simulator http://<YOUR_IP_ADDRESS>:1338/parse
const config = {
  parse: {
    appId: 'rwallet',
    javascriptKey: '',
    masterKey: '5a269cfebfde46a9acec7b3273bf6c245a269cfebfde46a9acec7b3273bf6c24',
    // serverURL: 'http://130.211.12.3/parse',
    serverURL: 'http://10.0.2.2:1338/parse',
  },
  defaultSettings: {
    username: 'Anonymous User',
    language: 'en',
    currency: 'USD',
    fingerprint: false,
  },
  consts: {
    supportedTokens: ['BTC', 'RBTC', 'RIF', 'DOC'],
    locales: [
      { name: 'English', id: 'en' },
      { name: 'Spanish', id: 'es' },
      { name: 'Portuguese', id: 'pt' },
      { name: 'Chinese', id: 'zh' },
    ],
    currencies: [
      { name: 'USD', fullName: 'US Dollar', symbol: '$' },
      { name: 'ARS', fullName: 'Argentine Peso', symbol: 'ARS$' },
      { name: 'JPY', fullName: 'Japanese Yen', symbol: '￥' },
      { name: 'KRW', fullName: 'South Korea won', symbol: '₩' },
      { name: 'CNY', fullName: 'Chinese Yuan', symbol: '￥' },
      { name: 'GBP', fullName: 'Pound sterling', symbol: '£' },
    ],
  },
  development: {
    reduxLoggerEnabled: false,
  },
  interval: {
    fetchPrice: 8000,
    fetchBalance: 8000,
    fetchTransaction: 8000,
    fetchLatestBlockHeight: 8000,
  },
  symbolDecimalPlaces: {
    BTC: 6,
    RBTC: 6,
    RIF: 3,
    DOC: 3,
  },
  assetValueDecimalPlaces: 2,
  transactionUrls: {
    BTC: {
      Mainnet: 'https://live.blockcypher.com/btc/tx',
      Testnet: 'https://live.blockcypher.com/btc-testnet/tx',
    },
    RBTC: {
      Mainnet: 'https://explorer.rsk.co/tx',
      Testnet: 'https://explorer.testnet.rsk.co/tx',
    },
    RIF: {
      Mainnet: 'https://explorer.rsk.co/tx',
      Testnet: 'https://explorer.testnet.rsk.co/tx',
    },
    DOC: {
      Mainnet: 'https://explorer.rsk.co/tx',
      Testnet: 'https://explorer.testnet.rsk.co/tx',
    },
  },
  defaultFontFamily: 'Roboto', // defaultFontFamily, for android
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
};

export default config;

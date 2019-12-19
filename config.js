/** Store app level configurations */
// serverURL list
// product http://130.211.12.3/parse
// dev1 http://10.0.2.2:1338/parse
// dev2 http://192.168.31.177:1338/parse
const config = {
  parse: {
    appId: 'rwallet',
    javascriptKey: '',
    masterKey: '5a269cfebfde46a9acec7b3273bf6c245a269cfebfde46a9acec7b3273bf6c24',
    serverURL: 'http://130.211.12.3/parse',
  },
  defaultSettings: {
    language: 'en',
    currency: 'USD',
    fingerprint: false,
  },
  consts: {
    supportedTokens: ['BTC', 'RBTC', 'RIF'],
    languages: ['en', 'fr', 'he', 'zh'],
    currencies: [
      { name: 'USD', fullName: 'US Dollar', symbol: '$' },
      { name: 'CNY', fullName: 'Chinese Yuan', symbol: '￥' },
      { name: 'ARS', fullName: 'Argentine Peso', symbol: 'ARS$' },
      { name: 'KRW', fullName: 'South Korea won', symbol: '₩' },
      { name: 'JPY', fullName: 'Japanese Yen', symbol: '￥' },
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
  },
};

export default config;

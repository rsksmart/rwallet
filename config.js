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
    serverURL: 'http://10.0.2.2:1338/parse',
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
      { name: 'USD', symbol: '$' },
      { name: 'CNY', symbol: '￥' },
      { name: 'ARS', symbol: 'ARS$' },
      { name: 'KRW', symbol: '₩' },
      { name: 'JPY', symbol: '￥' },
      { name: 'GBP', symbol: '£' },
    ],
  },
};

export default config;

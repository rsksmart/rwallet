/** Store app level configurations */

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

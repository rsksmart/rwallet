/** Store app level configurations */

const config = {
  parse: {
    appId: 'rwallet',
    javascriptKey: '',
    masterKey: '5a269cfebfde46a9acec7b3273bf6c245a269cfebfde46a9acec7b3273bf6c24',
    serverURL: 'http://192.168.31.177:1338/parse',
  },
  settings: {
    currency: [
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

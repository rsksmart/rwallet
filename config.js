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
    serverURL: 'http://10.0.2.2:1338/parse',
  },
  defaultSettings: {
    language: 'en',
    currency: 'USD',
    fingerprint: false,
  },
  consts: {
    supportedTokens: ['BTC', 'RBTC', 'RIF'],
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
  },
  symbolDecimalPlaces: {
    BTC: 6,
    RBTC: 6,
    RIF: 3,
  },
  assetValueDecimalPlaces: 2,
};

export default config;

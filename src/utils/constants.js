const CONF_BASE = {
  privacityPoliceURL: 'http://www.mellowallet.com/privacy',
  termsAndConditionURL: 'http://www.mellowallet.com/terms-and-conditions',
  wordsListSize: 12,
  ASK_FOR_COMPLETED_ON_BOARDING: true,
  FIAT_DECIMAL_PLACES: 2,
  SPANISH_RSS_FEEDS_URL: 'https://es.cointelegraph.com/rss',
  ENGLISH_RSS_FEEDS_URL: 'https://cointelegraph.com/rss',
};

let CONF;
let LOGGER;
if (process.env.NODE_ENV !== 'development') {
  // Production / Stagging.
  CONF = Object.assign({
    apiUrl: 'https://mellowapi.coinfabrik.com',
    showPin: true,
    useBadRandom: false,
  }, CONF_BASE);
  LOGGER = {
    // eslint-disable-next-line no-unused-vars
    log(...args) {
    },
    // eslint-disable-next-line no-unused-vars
    warn(...args) {
    },
    // eslint-disable-next-line no-unused-vars
    error(...args) {
      console.error(...args);
    },
  };
  // Configure the library
  console.log('----------------> STARTING IN PRODUCTION', CONF.apiUrl);
} else {
  // Development.
  CONF = Object.assign({
    apiUrl: 'http://46.101.117.238',
    showPin: false,
    useBadRandom: true,
  }, CONF_BASE);
  LOGGER = {
    log(...args) {
      console.log(...args);
    },
    warn(...args) {
      console.warn(...args);
    },
    error(...args) {
      console.error(...args);
    },
  };
  LOGGER.log('----------------> STARTING IN DEVELOPMENT', CONF.apiUrl);
}


export function conf(key) {
  if (key in CONF) {
    LOGGER.log('Got', key, ' => ', CONF[key]);
    return CONF[key];
  }
  throw new Error(`INVALID CONFIGURATION KEY "${key}"`);
}

export const logger = (function () {
  return LOGGER;
}());

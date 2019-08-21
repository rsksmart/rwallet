// eslint-disable-next-line prefer-destructuring
const Application = require('./lib').Application;
// eslint-disable-next-line prefer-destructuring
const ExpoStorage = require('./ExpoStorage/Storage').ExpoStorage;
const WebRequester = require('./WebRequester');
const SecureRandom = require('./SecureRandom');
const constants = require('../src/utils/constants');


async function newApplication() {
  const ret = new Application(new ExpoStorage(), {
    get: WebRequester.http_get_request,
    put: WebRequester.http_put_request,
    post: WebRequester.http_post_request,
    rand: SecureRandom.generate_secure_random,
    getServerUrl: () => constants.conf('apiUrl'),
    getLogger: () => ({
      debug: (...args: any[]) => {
        constants.logger.log(...args);
      },

      info: (...args: any[]) => {
        constants.logger.warn(...args);
      },

      warn: (...args: any[]) => {
        constants.logger.warn(...args);
      },

      error: (...args: any[]) => {
        constants.logger.error(...args);
      },
    }),
  });
  await ret.initialize();
  return ret;
}

let globalApp = null;

function getApp(f) {
  return new Promise(async (resolve, reject) => {
    if (!globalApp) {
      globalApp = await newApplication();
    }
    f(globalApp)
      .then(resolve)
      .catch(reject);
  });
}

module.exports = getApp;

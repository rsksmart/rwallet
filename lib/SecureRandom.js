import { NativeModules } from 'react-native';

const { RNSecureRandom } = NativeModules;
const constants = require('../src/utils/constants');

function generate_secure_random(length) {
  if (!RNSecureRandom || !RNSecureRandom.generateSecureRandomAsBase64) {
    if (constants.conf('useBadRandom')) {
      console.log('USING BAD RANDOM');
      return Promise.resolve(Date.now()
        .toString());
    }
    console.error('CAN\'T RUN SECURE RANDOM IS MISSING');
    throw new Error('CAN\'T RUN SECURE RANDOM IS MISSING');
  }
  console.log('USING STRONG RANDOM');
  return RNSecureRandom.generateSecureRandomAsBase64(length);
}

module.exports.generate_secure_random = generate_secure_random;

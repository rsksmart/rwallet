import { expect } from 'chai';
import _ from 'lodash';

import walletManager from '../src/common/wallet/walletManager';

describe('Wallet Manager Suite', () => {
  it('CreateWallet', async () => {
    // Test seed. DO NOT use in dev code or production
    const phrase = 'chronic vote exotic upgrade security area add blossom soul youth plate dish';
    const expected = {
      name: 'Wallet Name',
      mnemonic: 'chronic vote exotic upgrade security area add blossom soul youth plate dish',
      symbol: 'RBTC',
      precision: 18,
      address: '0x1Bf155ffd327d645358B6279cEf147BB74146431',
      type: 'Mainnet',
      coinType: 137,
      path: 'm/44\'/137\'/1\'/0/0',
    };
    const wallet = await walletManager.createWallet('Wallet Name', phrase, [{ symbol: 'RBTC', type: 'Mainnet' }], { RBTC: "m/44'/137'/1'/0/0" });
    const { name, mnemonic, coins } = wallet;
    const {
      symbol, address, type, precision, coinType, path,
    } = coins[0];
    const result = {
      name, mnemonic, symbol, address, type, precision, coinType, path,
    };

    _.map(expected, (value, key) => {
      expect(result[key]).to.equal(value);
    });
  });

  it('CreateReadOnlyWallet', async () => {
    const expected = {
      address: '0x1Bf155ffd327d645358B6279cEf147BB74146431',
      chain: 'Rootstock',
      id: 1,
      name: 'My 2nd Wallet',
      type: 'Mainnet',
      walletType: 'Readonly',
    };
    const wallet = await walletManager.createReadOnlyWallet('Rootstock', 'Mainnet', '0x1Bf155ffd327d645358B6279cEf147BB74146431', [{ symbol: 'RBTC', type: 'Mainnet' }]);
    _.map(expected, (value, key) => {
      expect(wallet[key]).to.equal(value);
    });
  });
});

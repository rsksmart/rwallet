import { expect } from 'chai';
import _ from 'lodash';

import walletManager from '../src/common/wallet/walletManager';
import storage from '../src/common/storage';

describe('Wallet Manager Suite', () => {
  it('Normal Wallet', async () => {
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

    // Test createWallet function
    const wallet = await walletManager.createWallet('Wallet Name', phrase, [{ symbol: 'RBTC', type: 'Mainnet' }], { RBTC: "m/44'/137'/1'/0/0" });
    const { name, mnemonic, coins } = wallet;
    const {
      symbol, address, type, precision, coinType, path,
    } = coins[0];
    const result = {
      name, mnemonic, symbol, address, type, precision, coinType, path,
    };
    expect(result).that.deep.equals(expected);

    // Test renameWallet function
    await walletManager.renameWallet(wallet, 'New Wallet Name');
    const newWallets = _.filter(walletManager.wallets, (item) => item === wallet);
    expect(newWallets.length).to.equal(1);
    const renamedWallet = newWallets[0];
    expect(renamedWallet.name).to.equal('New Wallet Name');

    // Test deleteWallet function
    await walletManager.deleteWallet(wallet);
    expect(walletManager.wallets).that.deep.equals([]);
  });

  it('Read Only Wallet', async () => {
    const expected = {
      address: '0x1Bf155ffd327d645358B6279cEf147BB74146431',
      chain: 'Rootstock',
      id: 1,
      name: 'My 2nd Wallet',
      type: 'Mainnet',
      walletType: 'Readonly',
    };
    const wallet = await walletManager.createReadOnlyWallet('Rootstock', 'Mainnet', '0x1Bf155ffd327d645358B6279cEf147BB74146431', [{ symbol: 'RBTC', type: 'Mainnet' }]);
    const {
      address, chain, id, name, type, walletType,
    } = wallet;
    const result = {
      address, chain, id, name, type, walletType,
    };
    expect(result).that.deep.equals(expected);
  });
});

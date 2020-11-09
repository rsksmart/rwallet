import { expect } from 'chai';

import common from '../src/common/common';
import walletManager from '../src/common/wallet/walletManager';
import { rbtcTransaction } from '../src/common/transaction/index';

describe('Common Test', () => {
  it('ConvertCoinAmountToUnitHex', () => {
    const unitHex = common.convertCoinAmountToUnitHex('RBTC', 1);
    expect(unitHex).to.equal('0xde0b6b3a7640000');
  });

  it('ConvertUnitToCoinAmount', () => {
    const coinAmount = common.convertUnitToCoinAmount('RBTC', '0xde0b6b3a7640000');
    expect(coinAmount.toString()).to.equal('1');
  });
});

describe('Transaction Test', () => {
  it('Gat Transaction Fee', async () => {
    const address = '0xe52502d423F98B19DCa21a054b630C10f66527A8';
    const fee = await rbtcTransaction.getTransactionFees('Testnet', { symbol: 'RBTC' }, address, address, '0x0', '');
    expect(fee.gas).to.equal('0');
  });
});

describe('Wallet Manager Test', () => {
  it('Create Wallet', async () => {
    const phrase = 'chronic vote exotic upgrade security area add blossom soul youth plate dish';
    const wallet = await walletManager.createWallet('Wallet Name', phrase, [{ symbol: 'RBTC', type: 'Mainnet' }], { RBTC: "m/44'/137'/1'/0/0" });
    const { name, mnemonic, coins } = wallet;
    const {
      symbol, address, type, precision, coinType, path,
    } = coins[0];
    expect(name).to.equal('Wallet Name');
    expect(mnemonic).to.equal('chronic vote exotic upgrade security area add blossom soul youth plate dish');
    expect(symbol).to.equal('RBTC');
    expect(precision).to.equal(18);
    expect(address).to.equal('0x1Bf155ffd327d645358B6279cEf147BB74146431');
    expect(type).to.equal('Mainnet');
    expect(coinType).to.equal(137);
    expect(path).to.equal('m/44\'/137\'/1\'/0/0');
  });
});

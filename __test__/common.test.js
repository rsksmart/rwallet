import { expect } from 'chai';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

import common from '../src/common/common';

describe('Common Suite', () => {
  it('ConvertCoinAmountToUnitHex success', () => {
    let unitHex = common.convertCoinAmountToUnitHex('RBTC', 1);
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('BTC', 1);
    expect(unitHex).to.equal('0x5f5e100');

    unitHex = common.convertCoinAmountToUnitHex('RBTC', 1, 18);
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex(null, 1);
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('XBTC', 1);
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('XBTC', 100, 16);
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('XBTC', 1, 16);
    expect(unitHex).to.equal('0x2386f26fc10000');

    unitHex = common.convertCoinAmountToUnitHex('', 1);
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex(undefined, 1);
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('RBTC', '1');
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('RBTC', new BigNumber(1));
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('RBTC', '0x1');
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('RBTC', 1, '18');
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('RBTC', 1, '0x12');
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    unitHex = common.convertCoinAmountToUnitHex('RBTC', 1, new BigNumber(18));
    expect(unitHex).to.equal('0xde0b6b3a7640000');
  });

  // it('ConvertCoinAmountToUnitHex failure', () => {
  //   let unitHex = common.convertCoinAmountToUnitHex('RBTC', 2);
  //   expect(unitHex).to.equal('0xde0b6b3a7640000');

  //   unitHex = common.convertCoinAmountToUnitHex('RBTC', 1, 10);
  //   expect(unitHex).to.equal('0xde0b6b3a7640000');

  //   unitHex = common.convertCoinAmountToUnitHex('BTC', 1);
  //   expect(unitHex).to.equal('0xde0b6b3a7640000');

  //   unitHex = common.convertCoinAmountToUnitHex('BTC', 1, 10);
  //   expect(unitHex).to.equal('0x5f5e100');
  // });

  it('ConvertUnitToCoinAmount success', () => {
    let coinAmount = common.convertUnitToCoinAmount('RBTC', '0xde0b6b3a7640000');
    expect(coinAmount.toString()).to.equal('1');

    coinAmount = common.convertUnitToCoinAmount('RBTC', '0xde0b6b3a7640000', 18);
    expect(coinAmount.toString()).to.equal('1');

    coinAmount = common.convertUnitToCoinAmount('', '0xde0b6b3a7640000');
    expect(coinAmount.toString()).to.equal('1');

    coinAmount = common.convertUnitToCoinAmount('XBTC', '0xde0b6b3a7640000');
    expect(coinAmount.toString()).to.equal('1');

    coinAmount = common.convertUnitToCoinAmount(undefined, '0xde0b6b3a7640000');
    expect(coinAmount.toString()).to.equal('1');

    coinAmount = common.convertUnitToCoinAmount(null, '0xde0b6b3a7640000');
    expect(coinAmount.toString()).to.equal('1');

    coinAmount = common.convertUnitToCoinAmount('CBTC', '0xde0b6b3a7640000', 16);
    expect(coinAmount.toString()).to.equal('100');

    coinAmount = common.convertUnitToCoinAmount('CBTC', '0xde0b6b3a7640000', 20);
    expect(coinAmount.toString()).to.equal('0.01');

    coinAmount = common.convertUnitToCoinAmount('BTC', '0x5F5E100');
    expect(coinAmount.toString()).to.equal('1');
  });

  // it('ConvertUnitToCoinAmount failure', () => {
  //   let coinAmount = common.convertUnitToCoinAmount('RBTC', '0xde0b6b3a7640000');
  //   expect(coinAmount.toString()).to.equal('2');

  //   coinAmount = common.convertUnitToCoinAmount('RBTC', '0xde0b6b3a7640000', 10);
  //   expect(coinAmount.toString()).to.equal('1');

  //   coinAmount = common.convertUnitToCoinAmount('BTC', '0x5F5E100');
  //   expect(coinAmount.toString()).to.equal('1');
  // });

  it('GetCoinType success', () => {
    const expected = {
      networkId: 30,
      coinType: 137,
      defaultName: 'Smart Bitcoin',
      chain: 'Rootstock',
      type: 'Mainnet',
      symbol: 'RBTC',
      precision: 18,
    };
    const coinType = common.getCoinType('RBTC', 'Mainnet');
    _.map(expected, (value, key) => {
      expect(coinType[key]).to.equal(value);
    });
  });

  it('GetDomain success', () => {
    const expected = 'baidu.com';

    let url = 'https://www.baidu.com';
    let domain = common.getDomain(url);
    expect(domain).to.equal(expected);

    url = 'https://www.baidu.com/id/123';
    domain = common.getDomain(url);
    expect(domain).to.equal(expected);

    url = 'http://www.baidu.com/id/123';
    domain = common.getDomain(url);
    expect(domain).to.equal(expected);

    url = 'http://www.baidu.com?id=123&page=1';
    domain = common.getDomain(url);
    expect(domain).to.equal(expected);

    url = 'baidu.com/id/123';
    domain = common.getDomain(url);
    expect(domain).to.equal(expected);

    domain = common.getDomain(null);
    expect(domain).to.equal(null);

    domain = common.getDomain('');
    expect(domain).to.equal('');
  });

  it('SortTokens success', () => {
    const tokens = [
      { symbol: 'BTC', type: 'Mainnet' },
      { symbol: 'RBTC', type: 'Testnet' },
      { symbol: 'RBTC', type: 'Mainnet' },
      { symbol: 'DOC', type: 'Testnet' },
      { symbol: 'XBTC', type: 'Testnet' },
      { symbol: 'BTC', type: 'Testnet' },
      { symbol: 'DOC', type: 'Mainnet' },
      { symbol: 'XBTC', type: 'Mainnet' },
    ];

    const expected = [
      { symbol: 'BTC', type: 'Mainnet' },
      { symbol: 'RBTC', type: 'Mainnet' },
      { symbol: 'DOC', type: 'Mainnet' },
      { symbol: 'XBTC', type: 'Mainnet' },
      { symbol: 'BTC', type: 'Testnet' },
      { symbol: 'RBTC', type: 'Testnet' },
      { symbol: 'DOC', type: 'Testnet' },
      { symbol: 'XBTC', type: 'Testnet' },
    ];

    let sortedTokens = common.sortTokens(tokens);
    expect(sortedTokens.length).to.equal(expected.length);
    _.forEach(expected, (item, index) => {
      const { symbol, type } = item;
      const token = sortedTokens[index];
      expect(token.symbol).to.equal(symbol);
      expect(token.type).to.equal(type);
    });

    sortedTokens = common.sortTokens(null);
    expect(typeof (sortedTokens)).to.equal('array');
    expect(sortedTokens.length).to.equal(0);
  });

  it('ParseAccountFromDerivationPath success', () => {
    let derivationPath = "m/44'/0'/1'/0/0";
    let account = common.parseAccountFromDerivationPath(derivationPath);
    expect(account).to.equal('1');

    derivationPath = "m/44'/0'/-1'/0/0";
    account = common.parseAccountFromDerivationPath(derivationPath);
    expect(account).to.equal('-1');

    derivationPath = 'm/44';
    account = common.parseAccountFromDerivationPath(derivationPath);
    expect(account).to.equal('0');

    account = common.parseAccountFromDerivationPath('');
    expect(account).to.equal('0');

    account = common.parseAccountFromDerivationPath(null);
    expect(account).to.equal('0');
  });

  it('IsWalletAddress success', () => {
    let address = '0xb1C55DdA8ce352607A9e16944b632A0ce53ba9e2';
    let type = 'Mainnet';
    let symbol = 'RBTC';
    let isWalletAddress = common.isWalletAddress(address, symbol, type);
    expect(isWalletAddress).to.equal(true);

    address = '135Zt5CfXi8ieZg1buy2N95gdLD4jtpZBd';
    type = 'Mainnet';
    symbol = 'BTC';
    isWalletAddress = common.isWalletAddress(address, symbol, type);
    expect(isWalletAddress).to.equal(true);

    address = '0xCc3cAB530e2AD0Eb960bAf3C7B59F3447b55D490';
    type = 'Testnet';
    symbol = 'RBTC';
    isWalletAddress = common.isWalletAddress(address, symbol, type);
    expect(isWalletAddress).to.equal(true);

    address = '0xcc3cAb530e2AD0Eb960bAf3C7B59F3455D490';
    type = 'Testnet';
    symbol = 'RBTC';
    isWalletAddress = common.isWalletAddress(address, symbol, type);
    expect(isWalletAddress).to.equal(false);
  });

  it('GetCoinValue success', () => {
    const prices = [{ symbol: 'RBTC', price: { CNY: '6.6', USDT: '1' } }];
    const coinValue = common.getCoinValue(1, 'RBTC', 'Mainnet', 'CNY', prices);
    expect(coinValue.toString()).to.equal('6.6');
  });
});

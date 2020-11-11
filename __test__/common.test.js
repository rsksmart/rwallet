import { expect } from 'chai';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

import common from '../src/common/common';

describe('Common Suite', () => {
  it('ConvertCoinAmountToUnitHex', () => {
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

  it('ConvertUnitToCoinAmount', () => {
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

  it('GetCoinType', () => {
    let expected = {
      networkId: 30,
      coinType: 137,
      defaultName: 'Smart Bitcoin',
      chain: 'Rootstock',
      type: 'Mainnet',
      symbol: 'RBTC',
      precision: 18,
    };
    let coinType = common.getCoinType('RBTC', 'Mainnet');
    _.map(expected, (value, key) => {
      expect(coinType[key]).to.equal(value);
    });

    expected = {
      networkId: 30,
      coinType: 137,
      chain: 'Rootstock',
      type: 'Mainnet',
      precision: 18,
    };
    coinType = common.getCoinType('XBTC', 'Mainnet');
    _.map(expected, (value, key) => {
      expect(coinType[key]).to.equal(value);
    });
    coinType = common.getCoinType('XBTC', '');
    _.map(expected, (value, key) => {
      expect(coinType[key]).to.equal(value);
    });
    coinType = common.getCoinType('', '');
    _.map(expected, (value, key) => {
      expect(coinType[key]).to.equal(value);
    });

    expected = {
      networkId: 31,
      coinType: 37310,
      chain: 'Rootstock',
      type: 'Testnet',
      precision: 18,
    };
    coinType = common.getCoinType('XBTC', 'Testnet');
    _.map(expected, (value, key) => {
      expect(coinType[key]).to.equal(value);
    });
  });

  it('GetDomain', () => {
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

  it('SortTokens', () => {
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

    const sortedTokens = common.sortTokens(tokens);
    expect(sortedTokens.length).to.equal(expected.length);
    expect(sortedTokens).that.deep.equals(expected);

    expect(() => common.sortTokens(null)).to.throw("Cannot read property 'sort' of null");
    expect(() => common.sortTokens(undefined)).to.throw("Cannot read property 'sort' of undefined");
    expect(() => common.sortTokens(1)).to.throw('tokens.sort is not a function');
    expect(() => common.sortTokens('1')).to.throw('tokens.sort is not a function');
  });

  it('ParseAccountFromDerivationPath', () => {
    let derivationPath = "m/44'/0'/1'/0/0";
    let account = common.parseAccountFromDerivationPath(derivationPath);
    expect(account).to.equal('1');

    derivationPath = "m/44'/0'/-1'/0/0";
    account = common.parseAccountFromDerivationPath(derivationPath);
    expect(account).to.equal('-1');

    derivationPath = 'm/44/3';
    account = common.parseAccountFromDerivationPath(derivationPath);
    expect(account).to.equal('0');

    account = common.parseAccountFromDerivationPath('');
    expect(account).to.equal('0');

    account = common.parseAccountFromDerivationPath(null);
    expect(account).to.equal('0');
  });

  it('IsWalletAddress', () => {
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

    address = '';
    type = '';
    symbol = '';
    isWalletAddress = common.isWalletAddress(address, symbol, type);
    expect(isWalletAddress).to.equal(false);
  });

  it('GetCoinValue', () => {
    let prices = [{ symbol: 'RBTC', price: { CNY: '6.6', USDT: '1' } }];
    let coinValue = common.getCoinValue(1, 'RBTC', 'Mainnet', 'CNY', prices);
    expect(coinValue.toString()).to.equal('6.6');

    prices = [{ symbol: 'RBTC', price: { CNY: undefined, USDT: '1' } }];
    coinValue = common.getCoinValue(1, 'RBTC', 'Mainnet', 'CNY', prices);
    expect(coinValue).to.equal(null);

    prices = [{ symbol: 'RBTC', price: { CNY: undefined, USDT: '1' } }];
    coinValue = common.getCoinValue(1, 'RBTC', 'Testnet', 'CNY', prices);
    expect(coinValue.toString()).to.equal('0');

    prices = [];
    coinValue = common.getCoinValue(1, 'RBTC', 'Mainnet', 'CNY', prices);
    expect(coinValue).to.equal(null);

    prices = [{ symbol: 'RBTC', price: { CNY: '6.6', USDT: '1' } }];
    coinValue = common.getCoinValue(1, '', 'Mainnet', 'CNY', prices);
    expect(coinValue).to.equal(null);

    prices = [{ symbol: 'RBTC', price: { CNY: '6.6', USDT: '1' } }];
    coinValue = common.getCoinValue(1, 'RBTC', 'Mainnet', '', prices);
    expect(coinValue).to.equal(null);
  });
});

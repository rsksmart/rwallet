import { expect } from 'chai';
import BigNumber from 'bignumber.js';

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
    const rbtcExpected = {
      networkId: 30,
      coinType: 137,
      defaultName: 'Smart Bitcoin',
      chain: 'Rootstock',
      type: 'Mainnet',
      symbol: 'RBTC',
      precision: 18,
      icon: { testUri: '../../../src/assets/images/icon/RBTC.png' },
    };
    const trbtcExpected = {
      networkId: 31,
      coinType: 37310,
      defaultName: 'Smart Bitcoin',
      chain: 'Rootstock',
      type: 'Testnet',
      symbol: 'RBTC',
      precision: 18,
      icon: { testUri: '../../../src/assets/images/icon/RBTC.grey.png' },
    };
    const xbtcExpected = {
      networkId: 30,
      coinType: 137,
      chain: 'Rootstock',
      type: 'Mainnet',
      precision: 18,
      icon: { testUri: '../../../src/assets/images/icon/customToken.png' },
    };
    const txbtcExpected = {
      networkId: 31,
      coinType: 37310,
      chain: 'Rootstock',
      type: 'Testnet',
      precision: 18,
      icon: { testUri: '../../../src/assets/images/icon/customToken.grey.png' },
    };

    let coinType = common.getCoinType('RBTC', 'Mainnet');
    expect(coinType).that.deep.equals(rbtcExpected);

    coinType = common.getCoinType('RBTC', 'Testnet');
    expect(coinType).that.deep.equals(trbtcExpected);

    coinType = common.getCoinType('XBTC', 'Mainnet');
    expect(coinType).that.deep.equals(xbtcExpected);

    coinType = common.getCoinType('XBTC', '');
    expect(coinType).that.deep.equals(xbtcExpected);

    coinType = common.getCoinType('', '');
    expect(coinType).that.deep.equals(xbtcExpected);

    coinType = common.getCoinType('XBTC', 'Testnet');
    expect(coinType).that.deep.equals(txbtcExpected);
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

    expect(() => common.sortTokens(null)).to.throw();
    expect(() => common.sortTokens(undefined)).to.throw();
    expect(() => common.sortTokens(1)).to.throw();
    expect(() => common.sortTokens('1')).to.throw();
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
    let isWalletAddress = common.isWalletAddress('0xb1C55DdA8ce352607A9e16944b632A0ce53ba9e2', 'RBTC', 'Mainnet');
    expect(isWalletAddress).to.equal(true);

    isWalletAddress = common.isWalletAddress('135Zt5CfXi8ieZg1buy2N95gdLD4jtpZBd', 'BTC', 'Mainnet');
    expect(isWalletAddress).to.equal(true);

    isWalletAddress = common.isWalletAddress('0xCc3cAB530e2AD0Eb960bAf3C7B59F3447b55D490', 'RBTC', 'Testnet');
    expect(isWalletAddress).to.equal(true);

    isWalletAddress = common.isWalletAddress('0xcc3cAb530e2AD0Eb960bAf3C7B59F3455D490', 'RBTC', 'Testnet');
    expect(isWalletAddress).to.equal(false);

    isWalletAddress = common.isWalletAddress('', '', '');
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

  it('GetSymbolName', () => {
    let symbolName = common.getSymbolName('RBTC', 'Mainnet');
    expect(symbolName).to.equal('RBTC');

    symbolName = common.getSymbolName('DOC', 'Testnet');
    expect(symbolName).to.equal('tDOC');
  });

  it('ToChecksumAddress', () => {
    const checksumAddress = common.toChecksumAddress('0x95708CA0902d5ac81A37450556396CA6511a6fdE', 31);
    expect(checksumAddress).to.equal('0x95708CA0902D5AC81A37450556396CA6511A6FdE');

    expect(() => common.toChecksumAddress('9ED44100F8DE11EAADF1C35744E5C417')).to.throw();
  });

  it('GetServerUrl', () => {
    let serverUrl = common.getServerUrl('https://rwallet.app');
    expect(serverUrl).to.equal('https://rwallet.app');

    serverUrl = common.getServerUrl('https://rwallet.app', 'Production');
    expect(serverUrl).to.equal('https://rwallet.app');

    serverUrl = common.getServerUrl('https://rwallet.app', 'production');
    expect(serverUrl).to.equal('https://rwallet.app');

    serverUrl = common.getServerUrl('https://rwallet.app', 'Dogfood');
    expect(serverUrl).to.equal('https://dogfood.rwallet.app');

    serverUrl = common.getServerUrl('https://rwallet.app', 'dogfood');
    expect(serverUrl).to.equal('https://dogfood.rwallet.app');
  });

  it('EllipsisAddress', () => {
    let serverUrl = common.ellipsisAddress('0xe62278ac258bda2ae6e8EcA32d01d4cB3B631257', 6);
    expect(serverUrl).to.equal('0xe62278...631257');

    serverUrl = common.ellipsisAddress('0xe62278ac258bda2ae6e8EcA32d01d4cB3B631257');
    expect(serverUrl).to.equal('0xe62278ac...3B631257');
  });

  it('uppercaseFirstLetter', () => {
    let serverUrl = common.uppercaseFirstLetter('onoznxiu123Z');
    expect(serverUrl).to.equal('Onoznxiu123Z');

    serverUrl = common.uppercaseFirstLetter('_onoznxiu123Z');
    expect(serverUrl).to.equal('Onoznxiu123Z');
  });
});

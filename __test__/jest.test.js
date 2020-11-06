import React from 'react';

import { Text } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import JestTest from '../JestTest';

import common from '../src/common/common';
import { rbtcTransaction } from '../src/common/transaction/index';

describe('Enzyme shallow', () => {
  it('Jest Test', () => {
    const wrapper = shallow(<JestTest params="Jest Test 2" />);

    const state = wrapper.state();
    expect(state.content).to.equal('Jest Test 1');

    expect(wrapper.find(Text)).to.have.length(3);

    expect(wrapper.find(Text).first().props().children).to.equal('Jest Test 1');

    expect(wrapper.props().params).to.equal('Jest Test 2');
  });

  it('Common Test', () => {
    const unitHex = common.convertCoinAmountToUnitHex('RBTC', 1);
    expect(unitHex).to.equal('0xde0b6b3a7640000');

    const coinAmount = common.convertUnitToCoinAmount('RBTC', '0xde0b6b3a7640000');
    expect(coinAmount.toString()).to.equal('1');
  });

  it('Transaction Test', async () => {
    const address = '0xe52502d423F98B19DCa21a054b630C10f66527A8';
    const fee = await rbtcTransaction.getTransactionFees('Testnet', { symbol: 'RBTC' }, address, address, '0x0', '');
    expect(fee).to.equal('0');
  });
});

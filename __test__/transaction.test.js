import { expect as cexpect } from 'chai';

import { rbtcTransaction } from '../src/common/transaction/index';

describe('Transaction Suite', () => {
  it('GatTransactionFee', async () => {
    const expected = { gas: 21000, gasPrice: { high: '0', low: '0', medium: '0' } };
    const address = '0xe52502d423F98B19DCa21a054b630C10f66527A8';
    const fee = await rbtcTransaction.getTransactionFees('Testnet', { symbol: 'RBTC' }, address, address, '0x0', '');
    cexpect(fee).that.deep.equals(expected);
  });
});

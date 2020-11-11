import { expect as cexpect } from 'chai';

import { rbtcTransaction } from '../src/common/transaction/index';

describe('Transaction Suite', () => {
  it('GatTransactionFee success', async () => {
    const expected = { gas: 21000, gasPrice: { high: '0', low: '0', medium: '0' } };
    const address = '0xe52502d423F98B19DCa21a054b630C10f66527A8';
    const fee = await rbtcTransaction.getTransactionFees('Testnet', { symbol: 'RBTC' }, address, address, '0x0', '');
    cexpect(fee).to.equal(expected.gas);
    cexpect(fee.gas).to.equal(expected.gas);
    cexpect(fee.gasPrice.high).to.equal(expected.gasPrice.high);
    cexpect(fee.gasPrice.low).to.equal(expected.gasPrice.low);
    cexpect(fee.gasPrice.medium).to.equal(expected.gasPrice.medium);
  });
});

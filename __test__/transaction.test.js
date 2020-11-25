import { expect } from 'chai';

import { rbtcTransaction } from '../src/common/transaction/index';

const docContractAddress = '0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db';
const docData = '0xa9059cbb0000000000000000000000001c067e968bff32a2f231bed86cc6f56f3ff49ad00000000000000000000000000000000000000000000000000000000000000001';

// Check async method throw error
const expectThrowsAsync = async (method) => {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }

  expect(error).to.be.an('Error');
};

describe('Transaction Suite', () => {
  it('GatTransactionFee', async () => {
    const address = '0xe52502d423F98B19DCa21a054b630C10f66527A8';
    const fee = await rbtcTransaction.getTransactionFees('Testnet', { symbol: 'RBTC' }, address, address, '0x0', '');
    const { gas, gasPrice } = fee;
    const { high, low, medium } = gasPrice;
    expect(typeof (gas)).to.equal('number');
    expect(typeof (gasPrice)).to.equal('object');
    expect(typeof (high)).to.equal('string');
    expect(typeof (low)).to.equal('string');
    expect(typeof (medium)).to.equal('string');
  });

  it('ProcessRawTransaction', async () => {
    const expected = {
      data: undefined,
      from: '0x1c067E968bFF32a2f231BED86cc6f56f3fF49Ad0',
      gas: 21000,
      gasPrice: { high: '1000', low: '500', medium: '800' },
      nonce: 0,
      to: '0x1c067E968bFF32a2f231BED86cc6f56f3fF49Ad0',
      value: 1,
    };
    const docExpected = {
      to: docContractAddress, value: '0x00', data: docData,
    };
    const params = {
      symbol: 'RBTC',
      sender: '0x1c067E968bFF32a2f231BED86cc6f56f3fF49Ad0',
      receiver: '0x1c067E968bFF32a2f231BED86cc6f56f3fF49Ad0',
      value: 1,
      gasFee: { gas: 21000, gasPrice: { high: '1000', low: '500', medium: '800' } },
      data: '',
      memo: '',
      contractAddress: '',
    };
    const docParams = {
      symbol: 'DOC',
      contractAddress: docContractAddress,
      data: docData,
    };

    // Test RBTC Mainent process rawTransaction
    let rawTransaction = await rbtcTransaction.processRawTransaction({ ...params, netType: 'Mainnet' });
    expect(rawTransaction).that.deep.equals({ ...expected, chainId: 30 });

    // Test RBTC Testnet process rawTransaction
    rawTransaction = await rbtcTransaction.processRawTransaction({ ...params, netType: 'Testnet' });
    expect(rawTransaction).that.deep.equals({ ...expected, chainId: 31 });

    // Test DOC Mainnet process rawTransaction
    rawTransaction = await rbtcTransaction.processRawTransaction({
      ...params,
      ...docParams,
      netType: 'Mainnet',
    });
    expect(rawTransaction).that.deep.equals({
      ...expected, chainId: 30, ...docExpected,
    });

    // Test DOC Testnet process rawTransaction
    rawTransaction = await rbtcTransaction.processRawTransaction({
      ...params,
      ...docParams,
      netType: 'Testnet',
    });
    expect(rawTransaction).that.deep.equals({
      ...expected, chainId: 31, ...docExpected,
    });

    // Test RBTC Mainnet process rawTransaction without gasFee
    expectThrowsAsync(() => rbtcTransaction.processRawTransaction({ ...params, netType: 'Mainnet', gasFee: null }));

    // Test RBTC Mainnet process rawTransaction without sender
    expectThrowsAsync(() => rbtcTransaction.processRawTransaction({ ...params, netType: 'Mainnet', sender: '' }));

    // Test RBTC Mainnet process rawTransaction without receiver
    expectThrowsAsync(() => rbtcTransaction.processRawTransaction({ ...params, netType: 'Mainnet', receiver: '' }));
  });

  it('SignTransaction', async () => {
    // Just for unit test
    const privateKey = '3f98102e063576efc92513e3465b7432d000c3047274d60eefd27af1f6ef82c0';
    const rawTransaction = {
      chainId: 30,
      data: undefined,
      from: '0x1c067E968bFF32a2f231BED86cc6f56f3fF49Ad0',
      gas: 600000,
      gasPrice: 10000000,
      nonce: 0,
      to: '0x1c067E968bFF32a2f231BED86cc6f56f3fF49Ad0',
      value: 1,
    };

    // Test RBTC Mainnet Sign Transaction
    const rbtcMainnetExpected = {
      messageHash: '2f6394d2144f5c50431afba571e14a4aead792a9df8d0bf764fccf7e8c9a2cc9',
      r: '0x9dbe40bcd7bd37279119cebd56303611529d92d505ec55ad42a77d98e9e72dbc',
      rawTransaction: '0xf8638083989680830927c0941c067e968bff32a2f231bed86cc6f56f3ff49ad0018060a09dbe40bcd7bd37279119cebd56303611529d92d505ec55ad42a77d98e9e72dbca02e63958dd0f937147241ef79f30aef2c893d328f6dc22b563a1728b6ee9e84ba',
      s: '0x2e63958dd0f937147241ef79f30aef2c893d328f6dc22b563a1728b6ee9e84ba',
      transactionHash: '0x81bba41a2b06b6a5bc24f4b180a72078dba1a959ab4bc3d0ba68d92208e0108c',
      v: '0x60',
    };
    let signedTransaction = await rbtcTransaction.signTransaction(rawTransaction, privateKey);
    expect(signedTransaction).that.deep.equals(rbtcMainnetExpected);

    // Test RBTC Testnet Sign Transaction
    const rbtcTestnetExpected = {
      messageHash: 'c6708516e629039e38c24569037f756dcf855084f32d1a6f1cb4ba9ea363cb41',
      r: '0x5901894efc5eb971e0777062bbb71f32b2885d89b42616cdb652351153cc3a9d',
      rawTransaction: '0xf8638083989680830927c0941c067e968bff32a2f231bed86cc6f56f3ff49ad0018061a05901894efc5eb971e0777062bbb71f32b2885d89b42616cdb652351153cc3a9da047943503bb8b20cbbd5bfa8e9486184dc126a14214c8631ec6d04c1785eb8ad0',
      s: '0x47943503bb8b20cbbd5bfa8e9486184dc126a14214c8631ec6d04c1785eb8ad0',
      transactionHash: '0x19955f5f40cd3254a6e2b58434ebf78cfb6f4785a0e5a6b532e41a3309507530',
      v: '0x61',
    };
    signedTransaction = await rbtcTransaction.signTransaction({ ...rawTransaction, chainId: 31 }, privateKey);
    expect(signedTransaction).that.deep.equals(rbtcTestnetExpected);

    // Test DOC Mainnet Sign Transaction
    const docParams = {
      to: docContractAddress, value: '0x00', data: docData,
    };
    const docMainnetExpected = {
      messageHash: 'f94e68ed96775c5b0f7fa5bea4522f63ff871a5ea81da94f6e50648c139e6c72',
      r: '0x98df12d46a1b0a0e71bd72b926f39a99fd5e99eaacf59dc4e00e6c6dd8fe31db',
      rawTransaction: '0xf8a88083989680830927c094e700691da7b9851f2f35f8b8182c69c53ccad9db80b844a9059cbb0000000000000000000000001c067e968bff32a2f231bed86cc6f56f3ff49ad0000000000000000000000000000000000000000000000000000000000000000160a098df12d46a1b0a0e71bd72b926f39a99fd5e99eaacf59dc4e00e6c6dd8fe31dba008271abe3147a052b35b28ab4d6d5bbe8c9c41b92a980c46e95aa4c397090cd1',
      s: '0x08271abe3147a052b35b28ab4d6d5bbe8c9c41b92a980c46e95aa4c397090cd1',
      transactionHash: '0xdedaa6493cb83fb891ec6896a51f973b2e7a1925f8e999641560b32aaa379749',
      v: '0x60',
    };
    signedTransaction = await rbtcTransaction.signTransaction({
      ...rawTransaction, ...docParams, chainId: 30,
    }, privateKey);
    expect(signedTransaction).that.deep.equals(docMainnetExpected);

    // Test DOC Testnet Sign Transaction
    const docTestExpected = {
      messageHash: 'e79312ceb8f9d2b9a00c76e1f5506fae2a6f13690b40fdc8e42448500358933b',
      r: '0x2988582a0980d152371919a8a1992f02e4327191413907c81df2f3e11e6ee7e3',
      rawTransaction: '0xf8a88083989680830927c094e700691da7b9851f2f35f8b8182c69c53ccad9db80b844a9059cbb0000000000000000000000001c067e968bff32a2f231bed86cc6f56f3ff49ad0000000000000000000000000000000000000000000000000000000000000000161a02988582a0980d152371919a8a1992f02e4327191413907c81df2f3e11e6ee7e3a051b2be2a8bd3eee6382ad12346d8380df64da639925fe03d767c8b89ca586618',
      s: '0x51b2be2a8bd3eee6382ad12346d8380df64da639925fe03d767c8b89ca586618',
      transactionHash: '0x2d9c11f96d4324b7747aadecef5a53a7936be90c393aa18b4305ad1e9c1cf21f',
      v: '0x61',
    };
    signedTransaction = await rbtcTransaction.signTransaction({
      ...rawTransaction, ...docParams, chainId: 31,
    }, privateKey);
    expect(signedTransaction).that.deep.equals(docTestExpected);

    // Test DOC Mainnet Sign Transaction with low gas limit
    expectThrowsAsync(() => rbtcTransaction.signTransaction({
      ...rawTransaction, ...docParams, chainId: 30, gas: 100,
    }, privateKey));

    // Test RBTC Mainnet Sign Transaction with low gas limit
    expectThrowsAsync(() => rbtcTransaction.signTransaction({
      ...rawTransaction, chainId: 30, gas: 100,
    }, privateKey));

    // Test RBTC Mainnet Sign Transaction without from address
    expectThrowsAsync(() => rbtcTransaction.signTransaction({
      ...rawTransaction, chainId: 30, from: '',
    }, privateKey));

    // Test RBTC Mainnet Sign Transaction without to address
    expectThrowsAsync(() => rbtcTransaction.signTransaction({
      ...rawTransaction, chainId: 30, to: '',
    }, privateKey));
  });
});

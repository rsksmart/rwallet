import Rsk3 from '@rsksmart/rsk3';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import { NETWORK, ASSETS_CONTRACT } from '../constants';

const { MAINNET, TESTNET } = NETWORK;

export const getTransactionFees = async (type, address, toAddress, fee, memo) => {
  const rskEndpoint = type === 'Mainnet' ? MAINNET.RSK_END_POINT : TESTNET.RSK_END_POINT;
  const rsk3 = new Rsk3(rskEndpoint);
  const from = Rsk3.utils.toChecksumAddress(address);
  const to = Rsk3.utils.toChecksumAddress(toAddress);
  const gas = await rsk3.estimateGas({
    from, to, value: fee, data: memo,
  });
  const latestBlock = await rsk3.getBlock('latest');
  const { minimumGasPrice } = latestBlock;
  const miniGasPrice = new BigNumber(minimumGasPrice, 16);
  return {
    gas,
    gasPrice: {
      low: miniGasPrice.toString(),
      medium: miniGasPrice.multipliedBy(2).toString(),
      high: miniGasPrice.multipliedBy(4).toString(),
    },
  };
};

export const createRawTransaction = async ({
  symbol, type, sender, receiver, value, data, memo, gasPrice, gas, fallback,
}) => {
  const rskEndpoint = type === 'Mainnet' ? MAINNET.RSK_END_POINT : TESTNET.RSK_END_POINT;
  const rsk3 = new Rsk3(rskEndpoint);
  const from = Rsk3.utils.toChecksumAddress(sender);
  const to = Rsk3.utils.toChecksumAddress(receiver);
  const nonce = await rsk3.getTransactionCount(from, 'pending');
  const rawTransaction = {
    from,
    nonce,
    chainId: type === 'Mainnet' ? MAINNET.NETWORK_VERSION : TESTNET.NETWORK_VERSION,
    gas,
    gasPrice,
    value,
  };
  if (symbol === 'RBTC') {
    rawTransaction.to = to;
    rawTransaction.data = memo;
  } else {
    const assetContract = ASSETS_CONTRACT[symbol][type];
    const contract = new Rsk3.Contract({
      name: 'transfer',
      type: 'function',
      inputs: [{
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      }],
    }, assetContract);
    rawTransaction.to = assetContract;
    rawTransaction.data = memo;
    rawTransaction.value = '0x00';
  }
  return rawTransaction;
};

export const getRawTransactionParam = ({
  symbol, netType, sender, receiver, value, data, memo, gasFee, fallback,
}) => {
  const { gasPrice, gas } = gasFee;
  const param = {
    symbol,
    type: netType,
    sender,
    receiver,
    value,
    data,
    gasPrice,
    gas: Math.floor(gas), // gas must be integer
    fallback,
  };
  if (!_.isEmpty(memo)) {
    param.memo = memo;
  }
  return param;
};

export const signTransaction = async (rawTransaction, privateKey) => {
  const rsk3 = new Rsk3('https://public-node.testnet.rsk.co');
  const accountInfo = await rsk3.accounts.privateKeyToAccount(privateKey);
  const signedTransaction = await accountInfo.signTransaction(
    rawTransaction, privateKey,
  );
  console.log(`signedTransaction: ${JSON.stringify(signedTransaction)}`);
  return signedTransaction;
};

export const getSignedTransactionParam = (signedTransaction, netType, memo, coinSwitch) => {
  const param = {
    name: 'Rootstock',
    hash: signedTransaction.rawTransaction,
    type: netType,
  };
  if (!_.isEmpty(memo)) {
    param.memo = memo;
  }
  if (coinSwitch) {
    param.coinSwitch = coinSwitch;
  }
  return param;
};

export const getTxHash = (txResult) => txResult.hash;

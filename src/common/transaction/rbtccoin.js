import Rsk3 from '@rsksmart/rsk3';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import storage from '../storage';
import { NETWORK, ASSETS_CONTRACT } from '../constants';
import assetAbi from '../assetAbi.json';

const { MAINNET, TESTNET } = NETWORK;

export const getContractAddress = (symbol, type) => {
  if (ASSETS_CONTRACT[symbol] && ASSETS_CONTRACT[symbol][type]) {
    return ASSETS_CONTRACT[symbol][type];
  }
  return '';
};

export const encodeContractTransfer = async (contractAddress, type, to, value) => {
  const rskEndpoint = type === 'Mainnet' ? MAINNET.RSK_END_POINT : TESTNET.RSK_END_POINT;
  const rsk3 = new Rsk3(rskEndpoint);
  const contract = rsk3.Contract(assetAbi, Rsk3.utils.toChecksumAddress(contractAddress));
  const data = await contract.methods.transfer(to, value).encodeABI();
  return data;
};

export const getTransactionFees = async (type, coin, address, toAddress, value, memo) => {
  const { symbol, contractAddress } = coin;
  const rskEndpoint = type === 'Mainnet' ? MAINNET.RSK_END_POINT : TESTNET.RSK_END_POINT;
  const rsk3 = new Rsk3(rskEndpoint);
  const latestBlock = await rsk3.getBlock('latest');
  const { minimumGasPrice } = latestBlock;
  const miniGasPrice = new BigNumber(minimumGasPrice, 16);
  const from = Rsk3.utils.toChecksumAddress(address);
  const to = Rsk3.utils.toChecksumAddress(toAddress);

  // Set default gas to 40000
  let gas = 40000;
  if (symbol === 'RBTC') {
    gas = await rsk3.estimateGas({
      from, to, value, data: memo,
    });
  } else {
    const contractAddr = Rsk3.utils.toChecksumAddress(contractAddress || getContractAddress(symbol, type));
    const data = await encodeContractTransfer(contractAddr, type, to, value);
    gas = await rsk3.estimateGas({
      from, to: contractAddr, value: 0, data,
    });
  }
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
  symbol, type, sender, receiver, value, memo, gasPrice, gas, contractAddress,
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
  } else if (contractAddress) {
    const contractAddr = Rsk3.utils.toChecksumAddress(contractAddress);
    const contract = rsk3.Contract(assetAbi, contractAddr);
    rawTransaction.to = contractAddr;
    rawTransaction.data = await contract.methods.transfer(to, value).encodeABI();
    rawTransaction.value = '0x00';
  } else {
    throw new Error(`Contract address for ${symbol} is undefined.`);
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

export const getSignedTransactionParam = ({
  signedTransaction, netType, memo, coinSwitch, rawTransaction,
}) => {
  const param = {
    name: 'Rootstock',
    hash: signedTransaction.rawTransaction,
    type: netType,
    raw: rawTransaction,
  };
  if (!_.isEmpty(memo)) {
    param.memo = memo;
  }
  if (coinSwitch) {
    param.coinSwitch = coinSwitch;
  }
  return param;
};

export const processRawTransaction = async ({
  symbol, netType, sender, receiver, value, data, memo, gasFee, contractAddress,
}) => {
  console.log('rbtc.processRawTransaction start');
  let result = null;
  try {
    // If the last transaction is time out, createRawTransaction should use the fallback parameter
    const isUseTransactionFallback = await storage.isUseTransactionFallbackAddress(sender);
    const param = getRawTransactionParam({
      symbol, netType, sender, receiver, value, data, memo, gasFee, fallback: isUseTransactionFallback, contractAddress,
    });
    console.log(`rbtc.processRawTransaction, rawTransactionParam: ${JSON.stringify(param)}`);
    result = await createRawTransaction({ ...param, contractAddress });
  } catch (e) {
    console.log('rbtc.processRawTransaction err: ', e.message);
    throw e;
  }
  console.log(`rbtc.processRawTransaction finished, result: ${JSON.stringify(result)}`);
  return result;
};

export const getTxHash = (txResult) => txResult.hash;

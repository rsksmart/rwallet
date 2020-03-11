import Rsk3 from 'rsk3';
import _ from 'lodash';

export const getRawTransactionParam = ({
  symbol, netType, sender, receiver, value, data, memo, gasFee,
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

export const getSignedTransactionParam = (signedTransaction, netType, memo, coinswitch) => {
  const param = {
    name: 'Rootstock',
    hash: signedTransaction.rawTransaction,
    type: netType,
  };
  if (!_.isEmpty(memo)) {
    param.memo = memo;
  }
  if (coinswitch) {
    param.coinswitch = coinswitch;
  }
  return param;
};

export const getTxHash = (txResult) => txResult.hash;

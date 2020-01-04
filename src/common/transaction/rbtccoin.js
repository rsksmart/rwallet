import Rsk3 from 'rsk3';

export const getRawTransactionParam = ({
  symbol, netType, sender, receiver, value, data, gasFee,
}) => {
  const { gasPrice, gas } = gasFee;
  return {
    symbol,
    type: netType,
    sender,
    receiver,
    value,
    data,
    gasPrice,
    gas,
  };
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

export const getSignedTransactionParam = (signedTransaction, netType) => ({
  name: 'Rootstock',
  hash: signedTransaction.rawTransaction,
  type: netType,
});

export const getTxHash = (txResult) => txResult.hash;

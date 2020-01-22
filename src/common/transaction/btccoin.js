import _ from 'lodash';

const buffer = require('buffer');
const bitcoin = require('bitcoinjs-lib');

export const getRawTransactionParam = ({
  netType, sender, receiver, value, data, memo, gasFee,
}) => {
  const param = {
    symbol: 'BTC',
    type: netType,
    sender,
    receiver,
    value,
    data,
  };
  if (!_.isEmpty(memo)) {
    param.memo = memo;
  }
  if (gasFee.preference) {
    param.preference = gasFee.preference;
  } else {
    param.fees = gasFee.fees;
  }
  return param;
};

export const signTransaction = async (transaction, privateKey) => {
  const rawTransaction = _.cloneDeep(transaction);
  const buf = Buffer.from(privateKey, 'hex');
  const keys = bitcoin.ECPair.fromPrivateKey(buf);
  rawTransaction.pubkeys = [];
  rawTransaction.signatures = rawTransaction.tosign.map((tosign) => {
    rawTransaction.pubkeys.push(keys.publicKey.toString('hex'));
    const signature = keys.sign(new buffer.Buffer(tosign, 'hex'));
    const encodedSignature = bitcoin.script.signature.encode(signature, bitcoin.Transaction.SIGHASH_NONE);
    let hexStr = encodedSignature.toString('hex');
    hexStr = hexStr.substr(0, hexStr.length - 2);
    return hexStr;
  });
  console.log(`signedTransaction: ${JSON.stringify(rawTransaction)}`);
  return rawTransaction;
};

export const getSignedTransactionParam = (signedTransaction, netType, memo) => {
  const param = {
    name: 'Bitcoin',
    hash: signedTransaction,
    type: netType,
  };
  if (!_.isEmpty(memo)) {
    param.memo = memo;
  }
  return param;
};

export const getTxHash = (txResult) => txResult.tx.hash;

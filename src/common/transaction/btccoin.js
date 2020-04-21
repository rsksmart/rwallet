import _ from 'lodash';
import { Buffer } from 'buffer';
import * as bitcoin from 'bitcoinjs-lib';

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
    const signature = keys.sign(Buffer.from(tosign, 'hex'));
    const encodedSignature = bitcoin.script.signature.encode(signature, bitcoin.Transaction.SIGHASH_NONE);
    let hexStr = encodedSignature.toString('hex');
    hexStr = hexStr.substr(0, hexStr.length - 2);
    return hexStr;
  });
  console.log(`signedTransaction: ${JSON.stringify(rawTransaction)}`);
  return rawTransaction;
};

export const getSignedTransactionParam = (signedTransaction, netType, memo, coinSwitch) => {
  const param = {
    name: 'Bitcoin',
    hash: signedTransaction,
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

export const getTxHash = (txResult) => txResult.tx.hash;

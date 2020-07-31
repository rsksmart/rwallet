import _ from 'lodash';
import { Buffer } from 'buffer';
import * as bitcoin from 'bitcoinjs-lib';

export const getRawTransactionParam = ({
  netType, sender, receiver, value, data, memo, gasFee, fallback,
}) => {
  const param = {
    symbol: 'BTC',
    type: netType,
    sender,
    receiver,
    value,
    data,
    fallback,
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
  const { tx: { addresses } } = rawTransaction;
  const fromAddress = addresses[0];
  // The signatures of segwit and legacy addresses are somewhat different
  const isSegwitAddress = _.startsWith(fromAddress, 'bc') || _.startsWith(fromAddress, 'tb');
  const hashType = isSegwitAddress ? bitcoin.Transaction.SIGHASH_ALL : bitcoin.Transaction.SIGHASH_NONE;
  const buf = Buffer.from(privateKey, 'hex');
  const keys = bitcoin.ECPair.fromPrivateKey(buf);
  rawTransaction.pubkeys = [];
  rawTransaction.signatures = rawTransaction.tosign.map((tosign) => {
    rawTransaction.pubkeys.push(keys.publicKey.toString('hex'));
    const signature = keys.sign(Buffer.from(tosign, 'hex'));
    const encodedSignature = bitcoin.script.signature.encode(signature, hashType);
    let hexStr = encodedSignature.toString('hex');
    hexStr = isSegwitAddress ? hexStr : hexStr.substr(0, hexStr.length - 2);
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

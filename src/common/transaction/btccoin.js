import _ from 'lodash';
import { Buffer } from 'buffer';
import * as bitcoin from 'bitcoinjs-lib';
import parseHelper from '../parse';
import common from '../common';

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

/**
 * Create and sign transaction
 * @param {object} params, { transaction, privateKey, fromAddress, toAddress, amount, netType }
 * @returns {string} transaction hex
 */
export const getSignedTransactionHex = ({
  transaction, privateKey, fromAddress, toAddress, amount, netType, fees,
}) => {
  const { tx: { inputs } } = transaction;
  const network = netType === 'Mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;

  const isSegwitAddress = _.startsWith(fromAddress, 'bc') || _.startsWith(fromAddress, 'tb');
  const buf = Buffer.from(privateKey, 'hex');
  const keyPair = bitcoin.ECPair.fromPrivateKey(buf, { network });
  const txb = new bitcoin.TransactionBuilder(network);

  // Calculate redeem script
  let redeemScript = null;
  if (isSegwitAddress) {
    const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network });
    const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network });
    redeemScript = p2sh.redeem.output;
  }

  // Add transaction inputs
  let inputsValue = 0;
  _.each(inputs, (input) => {
    txb.addInput(input.prev_hash, input.output_index, null, redeemScript);
    inputsValue += input.output_value;
  });

  const value = parseInt(amount, 16);
  txb.addOutput(toAddress, value);
  const restValue = inputsValue - value - parseInt(fees, 16);
  if (restValue > 0) {
    txb.addOutput(fromAddress, restValue);
  }

  // sign
  _.each(inputs, (input, index) => {
    if (isSegwitAddress) {
      txb.sign(index, keyPair, null, null, input.output_value);
    } else {
      txb.sign(index, keyPair);
    }
  });

  return txb.build().toHex();
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

export const estimateTxSize = async ({
  netType, amount, fromAddress, destAddress, privateKey, isSendAllBalance,
}) => {
  const inputTxs = await parseHelper.getInputAddressTXHash(fromAddress, netType, amount);
  return common.estimateBtcTxSize({
    netType, inputTxs, fromAddress, destAddress, privateKey, isSendAllBalance,
  });
};

export const getTxHash = (txResult) => txResult.tx.hash;

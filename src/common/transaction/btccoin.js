import _ from 'lodash';
import { Buffer } from 'buffer';
import * as bitcoin from 'bitcoinjs-lib';
import parseHelper from '../parse';
import common from '../common';
import { InsufficientBtcError } from '../error';

/**
 * Get signed transaction hex
 * @param {object} params, { addressInfo, privateKey, fromAddress, toAddress, amount, netType, fees }
 * @returns {string} transaction hex
 */
export const getSignedTransactionHex = ({
  addressInfo, privateKey, fromAddress, toAddress, amount, netType, fees,
}) => {
  // eslint-disable-next-line camelcase
  const { txrefs: confirmedTransactions, unconfirmed_txrefs: unconfirmedTransactions } = addressInfo;
  const network = netType === 'Mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
  const isSegwitAddress = _.startsWith(fromAddress, 'bc') || _.startsWith(fromAddress, 'tb');
  const buf = Buffer.from(privateKey, 'hex');
  const keyPair = bitcoin.ECPair.fromPrivateKey(buf, { network });
  const txb = new bitcoin.TransactionBuilder(network);
  const value = parseInt(amount, 16);
  const feesValue = parseInt(fees, 16);
  const cost = value + feesValue;

  // Calculate redeem script
  let redeemScript = null;
  if (isSegwitAddress) {
    const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network });
    const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network });
    redeemScript = p2sh.redeem.output;
  }

  // merge confirmedTransactions and unconfirmedTransactions to transactions.
  let transactions = [];
  if (!_.isEmpty(confirmedTransactions)) {
    transactions = _.concat(transactions, confirmedTransactions);
  }
  if (!_.isEmpty(unconfirmedTransactions)) {
    transactions = _.concat(transactions, unconfirmedTransactions);
  }

  // Use past transaction associated with this address as the inputs of the next transaction.
  // Calculate transaction inputs. Find the output whose sum is not greater than amount.
  const inputs = [];
  let inputsValue = 0;
  _.some(transactions, (transaction) => {
    // Filter transaction with input and spent
    if (transaction.tx_output_n === -1) {
      return false;
    }
    if (transaction.spent) {
      return false;
    }
    txb.addInput(transaction.tx_hash, transaction.tx_output_n, null, redeemScript);
    inputs.push(transaction);
    inputsValue += transaction.value;
    return inputsValue > cost;
  });

  if (inputsValue < cost) {
    throw new InsufficientBtcError();
  }

  // Add transaction outputs
  txb.addOutput(toAddress, value);
  const restValue = inputsValue - cost;
  if (restValue > 0) {
    txb.addOutput(fromAddress, restValue);
  }

  // Sign
  _.each(inputs, (input, index) => {
    if (isSegwitAddress) {
      txb.sign(index, keyPair, null, null, input.value);
    } else {
      txb.sign(index, keyPair);
    }
  });

  // Build transaction and return hex
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

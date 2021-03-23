import _ from 'lodash';
import { Buffer } from 'buffer';
import * as bitcoin from 'bitcoinjs-lib';
import parseHelper from '../parse';
import common from '../common';
import { InsufficientBtcError } from '../error';
import { BtcAddressType } from '../constants';

/**
 * Get transaction inputs
 * @param {object} params, { symbol, netType, sender, cost }
 * @returns {array} transaction inputs
 */
export const getTransactionInputs = async ({
  symbol, netType, sender, cost,
}) => {
  // Get the past transactions associated with this address as the inputs of the next transaction.
  const addressInfo = await parseHelper.getAddress(symbol, netType, sender);
  const { txrefs: confirmedTransactions, unconfirmed_txrefs: unconfirmedTransactions } = addressInfo;

  // merge confirmedTransactions and unconfirmedTransactions to transactions.
  let transactions = [];
  if (!_.isEmpty(confirmedTransactions)) {
    transactions = _.concat(transactions, confirmedTransactions);
  }
  if (!_.isEmpty(unconfirmedTransactions)) {
    transactions = _.concat(transactions, unconfirmedTransactions);
  }

  // Use past transaction associated with this address as the inputs of the next transaction.
  // Calculate transaction inputs. Find the output whose sum is not greater than cost.
  const inputs = [];
  let inputsValue = 0;
  _.each(transactions, (transaction) => {
    // Filter transaction with input and spent
    if (transaction.tx_output_n === -1 || transaction.spent) {
      return true;
    }
    inputs.push(transaction);
    inputsValue += transaction.value;
    return inputsValue < cost;
  });

  if (inputsValue < cost) {
    throw new InsufficientBtcError();
  }

  return inputs;
};

/**
 * Build transaction
 * @param {object} params, { inputs, fromAddress, addressType, toAddress, netType, amount, fees, publicKey }
 * @returns {object} Transaction builder
 */
export const buildTransaction = ({
  inputs, fromAddress, addressType, toAddress, netType, amount, fees, privateKey,
}) => {
  const network = netType === 'Mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
  const cost = amount + fees;
  const txb = new bitcoin.TransactionBuilder(network);

  // Calculate redeem script
  let redeemScript = null;
  if (addressType === BtcAddressType.segwit) {
    const buf = Buffer.from(privateKey, 'hex');
    const { publicKey } = bitcoin.ECPair.fromPrivateKey(buf, { network });
    const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: publicKey, network });
    const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network });
    redeemScript = p2sh.redeem.output;
  }

  // Add transaction inputs
  const inputsValue = _.reduce(inputs, (sum, input) => {
    txb.addInput(input.tx_hash, input.tx_output_n, null, redeemScript);
    return sum + input.value;
  }, 0);

  // Add transaction outputs
  txb.addOutput(toAddress, amount);
  const restValue = inputsValue - cost;
  if (restValue > 0) {
    txb.addOutput(fromAddress, restValue);
  }

  return txb;
};

/**
 * Get signed transaction hex
 * @param {object} params, { transactionBuilder, inputs, privateKey, netType, addressType }
 * @returns {string} transaction hex
 */
export const signTransaction = ({
  transactionBuilder, inputs, privateKey, netType, addressType,
}) => {
  const network = netType === 'Mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
  const buf = Buffer.from(privateKey, 'hex');
  const keyPair = bitcoin.ECPair.fromPrivateKey(buf, { network });

  // Sign
  _.each(inputs, (input, index) => {
    if (addressType === BtcAddressType.segwit) {
      transactionBuilder.sign(index, keyPair, null, null, input.value);
    } else {
      transactionBuilder.sign(index, keyPair);
    }
  });

  // Build transaction and return hex
  return transactionBuilder.build().toHex();
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

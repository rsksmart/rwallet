import Parse from 'parse/lib/react-native/Parse';
import common from '../common';
import { ERROR_CODE } from '../error';
import storage from '../storage';

import * as btc from './btccoin';
import * as rbtc from './rbtccoin';

import { ASSETS_CONTRACT } from '../constants';

const createRawTransactionParam = (params) => (params.symbol === 'BTC' ? btc.getRawTransactionParam(params) : rbtc.getRawTransactionParam(params));

const createSendSignedTransactionParam = (symbol, signedTransaction, netType, memo, coinswitch) => (symbol === 'BTC'
  ? btc.getSignedTransactionParam(signedTransaction, netType, memo, coinswitch)
  : rbtc.getSignedTransactionParam(signedTransaction, netType, memo, coinswitch));

const getTxHash = (symbol, txResult) => (symbol === 'BTC' ? btc.getTxHash(txResult) : rbtc.getTxHash(txResult));

export default class Transaction {
  constructor(coin, receiver, value, extraParams) {
    const {
      symbol, type, privateKey, address, contractAddress, precision,
    } = coin;
    const {
      data, memo, gasFee, coinswitch,
    } = extraParams;
    this.symbol = symbol;
    this.netType = type;

    // If coin is custom token added by user, coin.contractAddress is not null and the value is saved in rwallet locally
    this.contractAddress = contractAddress || (ASSETS_CONTRACT[symbol] && ASSETS_CONTRACT[symbol][type]) || '';
    this.sender = address;
    this.receiver = receiver;
    this.value = common.convertCoinAmountToUnitHex(symbol, value, precision);
    this.gasFee = gasFee;
    this.privateKey = privateKey;
    this.data = data || '';
    this.memo = memo;
    this.rawTransaction = null;
    this.signedTransaction = null;
    this.txHash = null;
    this.coinswitch = coinswitch;
  }

  async processRawTransaction() {
    console.log('Transaction.processRawTransaction start');
    let result = null;
    const {
      symbol, netType, sender, receiver, value, data, memo, gasFee, contractAddress,
    } = this;
    try {
      // If the last transaction is time out, createRawTransaction should use the fallback parameter
      const isUseTransactionFallback = await storage.isUseTransactionFallbackAddress(this.sender);
      const param = createRawTransactionParam({
        symbol, netType, sender, receiver, value, data, memo, gasFee, fallback: isUseTransactionFallback,
      });
      console.log(`Transaction.processRawTransaction, rawTransactionParam: ${JSON.stringify(param)}`);
      if (symbol === 'BTC') {
        result = await Parse.Cloud.run('createRawTransaction', param);
      } else {
        result = await rbtc.createRawTransaction({ ...param, contractAddress });
      }
    } catch (e) {
      console.log('Transaction.processRawTransaction err: ', e.message);
      throw e;
    }
    console.log(`Transaction.processRawTransaction finished, result: ${JSON.stringify(result)}`);
    this.rawTransaction = result;
  }

  async signTransaction() {
    console.log('Transaction.signTransaction start');
    let result = null;
    if (this.rawTransaction) {
      const { symbol, rawTransaction, privateKey } = this;
      try {
        if (symbol === 'BTC') {
          result = btc.getSignedTransactionHex({
            rawTransaction,
            privateKey,
            fromAddress: this.sender,
            toAddress: this.receiver,
            amount: this.value,
            netType: this.netType,
            fees: this.gasFee.fees,
          });
        } else {
          result = await rbtc.signTransaction(rawTransaction, privateKey);
        }
      } catch (e) {
        console.log('Transaction.signTransaction err: ', e.message);
        throw e;
      }
      console.log(`Transaction.processRawTransaction finished, result: ${JSON.stringify(result)}`);
      this.signedTransaction = result;
    } else {
      throw new Error('Transaction.signTransaction err: this.rawTransaction is null');
    }
  }

  async processSignedTransaction() {
    console.log('Transaction.processSignedTransaction start');
    let result = null;
    if (this.signedTransaction) {
      try {
        const param = createSendSignedTransactionParam(this.symbol, this.signedTransaction, this.netType, this.memo, this.coinswitch);
        console.log(`processSignedTransaction, param: ${JSON.stringify(param)}`);
        result = await Parse.Cloud.run('sendSignedTransaction', param);
        // If the transaction uses the fallback parameter and is sent successfully, you need to delete this address in the list
        await storage.removeUseTransactionFallbackAddress(this.sender);
      } catch (e) {
        console.log('Transaction.processSignedTransaction err: ', e.message);
        if (e.code === ERROR_CODE.ERR_REQUEST_TIMEOUT) {
          // If it times out, record the address of the transaction so that the fallback parameter can be used in the next transaction
          await storage.addUseTransactionFallbackAddress(this.sender);
        }
        throw e;
      }
    } else {
      throw new Error('Transaction.processSignedTransaction err: this.signedTransaction is null');
    }
    console.log(`Transaction.processSignedTransaction finished, result: ${JSON.stringify(result)}`);
    this.txHash = getTxHash(this.symbol, result);
    return result;
  }
}

export {
  btc as btcTransaction,
  rbtc as rbtcTransaction,
};

import Parse from 'parse/lib/react-native/Parse';
import common from '../common';

import * as btc from './btccoin';
import * as rbtc from './rbtccoin';

const createSignedTransaction = async (symbol, rawTransaction, privateKey) => {
  console.log('Transaction.processSignedTransaction start');
  const signedTransaction = await symbol === 'BTC' ? btc.signTransaction(rawTransaction, privateKey) : rbtc.signTransaction(rawTransaction, privateKey);
  return signedTransaction;
};

const createRawTransactionParam = (params) => (params.symbol === 'BTC' ? btc.getRawTransactionParam(params) : rbtc.getRawTransactionParam(params));

const convertTransferValue = (symbol, value) => (symbol === 'BTC' ? common.btcToSatoshiHex(value) : common.rskCoinToWeiHex(value));

const createSendSignedTransactionParam = (symbol, signedTransaction, netType, memo, coinswitch) => (symbol === 'BTC'
  ? btc.getSignedTransactionParam(signedTransaction, netType, memo, coinswitch)
  : rbtc.getSignedTransactionParam(signedTransaction, netType, memo, coinswitch));

const getTxHash = (symbol, txResult) => (symbol === 'BTC' ? btc.getTxHash(txResult) : rbtc.getTxHash(txResult));

class Transaction {
  constructor(coin, receiver, value, extraParams) {
    const {
      symbol, type, privateKey, address,
    } = coin;
    const {
      data, memo, gasFee, coinswitch,
    } = extraParams;
    this.symbol = symbol;
    this.netType = type;
    this.sender = address;
    this.receiver = receiver;
    this.value = convertTransferValue(symbol, value);
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
      symbol, netType, sender, receiver, value, data, memo, gasFee,
    } = this;
    try {
      const param = createRawTransactionParam({
        symbol, netType, sender, receiver, value, data, memo, gasFee,
      });
      console.log(`Transaction.processRawTransaction, rawTransactionParam: ${JSON.stringify(param)}`);
      result = await Parse.Cloud.run('createRawTransaction', param);
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
        result = await createSignedTransaction(symbol, rawTransaction, privateKey);
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
        result = await Parse.Cloud.run('sendSignedTransaction', param);
      } catch (e) {
        console.log('Transaction.processSignedTransaction err: ', e.message);
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

export default Transaction;

import Parse from 'parse/lib/react-native/Parse';
import common from '../common';
import { ERROR_CODE } from '../error';
import storage from '../storage';

import * as btc from './btccoin';
import * as rbtc from './rbtccoin';

import { ASSETS_CONTRACT } from '../constants';

const createSendSignedTransactionParam = (symbol, signedTransaction, netType, memo, coinswitch) => (symbol === 'BTC'
  ? btc.getSignedTransactionParam(signedTransaction, netType, memo, coinswitch)
  : rbtc.getSignedTransactionParam(signedTransaction, netType, memo, coinswitch));

const getTxHash = (symbol, txResult) => (symbol === 'BTC' ? btc.getTxHash(txResult) : rbtc.getTxHash(txResult));

export default class Transaction {
  constructor(coin, receiver, value, extraParams) {
    const {
      symbol, type, privateKey, address, contractAddress, precision, addressType, publicKey,
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
    this.signedTransaction = null;
    this.txHash = null;
    this.coinswitch = coinswitch;
    this.addressType = addressType;
    this.publicKey = publicKey;
  }

  async processTransaction() {
    console.log('Transaction.processTransaction start');
    let result = null;
    const {
      symbol, privateKey, netType, sender, receiver, value, data, memo, gasFee, contractAddress, addressType, publicKey,
    } = this;
    try {
      if (symbol === 'BTC') {
        const amount = parseInt(value, 16);
        const fees = parseInt(gasFee.fees, 16);
        const inputs = await btc.getTransactionInputs({
          symbol, netType, sender, cost: amount + fees,
        });
        const transactionBuilder = btc.buildTransaction({
          inputs,
          fromAddress: sender,
          addressType,
          toAddress: receiver,
          netType,
          amount,
          fees,
          publicKey,
        });
        result = btc.signTransaction({
          transactionBuilder, inputs, privateKey, netType, addressType,
        });
      } else {
        const rawTransaction = await rbtc.processRawTransaction({
          symbol, netType, sender, receiver, value, data, memo, gasFee, contractAddress,
        });
        result = await rbtc.signTransaction(rawTransaction, privateKey);
      }
    } catch (e) {
      console.log('Transaction.processTransaction err: ', e.message);
      throw e;
    }
    console.log(`Transaction.processTransaction finished, result: ${JSON.stringify(result)}`);
    this.signedTransaction = result;
  }

  async sendSignedTransaction() {
    console.log('Transaction.sendSignedTransaction start');
    let result = null;
    if (this.signedTransaction) {
      try {
        const param = createSendSignedTransactionParam(this.symbol, this.signedTransaction, this.netType, this.memo, this.coinswitch);
        console.log(`sendSignedTransaction, param: ${JSON.stringify(param)}`);
        result = await Parse.Cloud.run('sendSignedTransaction', param);
        // If the transaction uses the fallback parameter and is sent successfully, you need to delete this address in the list
        await storage.removeUseTransactionFallbackAddress(this.sender);
      } catch (e) {
        console.log('Transaction.sendSignedTransaction err: ', e.message);
        if (e.code === ERROR_CODE.ERR_REQUEST_TIMEOUT) {
          // If it times out, record the address of the transaction so that the fallback parameter can be used in the next transaction
          await storage.addUseTransactionFallbackAddress(this.sender);
        }
        throw e;
      }
    } else {
      throw new Error('Transaction.sendSignedTransaction err: this.signedTransaction is null');
    }
    console.log(`Transaction.sendSignedTransaction finished, result: ${JSON.stringify(result)}`);
    this.txHash = getTxHash(this.symbol, result);
    return result;
  }

  /**
   * Broadcast transaction
   */
  broadcast = async () => {
    await this.processTransaction();
    await this.sendSignedTransaction();
  }
}

export {
  btc as btcTransaction,
  rbtc as rbtcTransaction,
};

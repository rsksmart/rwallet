import Parse from 'parse/lib/react-native/Parse';
import Transaction from './transaction';
import ParseHelper from '../parse';

import * as btc from './btccoin';

class MultisigTransaction extends Transaction {
  sendSignedTransaction = async () => {
    const {
      signedTransaction, netType, memo, coinSwitch,
    } = this;
    const params = btc.getSignedTransactionParam(signedTransaction, netType, memo, coinSwitch);
    const newParams = params;
    newParams.proposalId = this.proposalId;
    return ParseHelper.sendSignedMultisigTransaction(params);
  }

  setTxHash(proposal) {
    this.txHash = proposal.hash;
  }

  async processTransaction() {
    console.log('Transaction.processRawTransaction start');
    let result = null;
    const {
      symbol, netType, sender, receiver, value, data, memo, gasFee,
    } = this;
    try {
      const param = btc.getRawTransactionParam({
        symbol, netType, sender, receiver, value, data, memo, gasFee,
      });
      console.log(`createRawMultisigTransaction!!!!, param: ${JSON.stringify(param)}`);
      result = await Parse.Cloud.run('createRawMultisigTransaction', param);
      console.log('createRawMultisigTransaction, result: ', result);
      this.rawTransaction = result.get('rawTransaction');
      this.proposalId = result.id;
      this.signedTransaction = this.signTransaction();
    } catch (e) {
      console.log('Transaction.processRawTransaction err: ', e.message);
      throw e;
    }
    console.log(`Transaction.processRawTransaction finished, result: ${JSON.stringify(result)}`);
  }

  async signTransaction() {
    console.log('Transaction.signTransaction start');
    let result = null;
    if (this.rawTransaction) {
      const { rawTransaction, privateKey } = this;
      try {
        result = await btc.signRawTransaction(rawTransaction, privateKey);
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
}

export default MultisigTransaction;

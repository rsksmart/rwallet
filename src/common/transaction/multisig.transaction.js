import Parse from 'parse/lib/react-native/Parse';
import Transaction from './transaction';
import ParseHelper from '../parse';

import * as btc from './btccoin';

class MultisigTransaction extends Transaction {
  sendSignedTransaction = async (params) => {
    const newParams = params;
    newParams.proposalId = this.proposalId;
    const proposal = await ParseHelper.sendSignedMultisigTransaction(params);
    return proposal;
  }

  setTxHash(proposal) {
    this.txHash = proposal.hash;
  }

  async processRawTransaction() {
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
    } catch (e) {
      console.log('Transaction.processRawTransaction err: ', e.message);
      throw e;
    }
    console.log(`Transaction.processRawTransaction finished, result: ${JSON.stringify(result)}`);
  }
}

export default MultisigTransaction;

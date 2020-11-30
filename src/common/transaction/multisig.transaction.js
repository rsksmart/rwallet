import _ from 'lodash';
import Parse from 'parse/lib/react-native/Parse';
import Transaction from './transaction';
import ParseHelper from '../parse';

import * as btc from './btccoin';

const bitcoin = require('bitcoinjs-lib');

class MultisigTransaction extends Transaction {
  constructor(coin, receiver, value, extraParams) {
    super(coin, receiver, value, extraParams);
    this.invitationCode = coin.invitationCode;
  }

  sendSignedTransaction = async () => {
    const {
      signedTransaction, netType, memo, coinSwitch,
    } = this;
    const params = btc.getSignedTransactionParam(signedTransaction, netType, memo, coinSwitch);
    const newParams = params;
    newParams.proposalId = this.proposalId;
    const result = await ParseHelper.sendSignedMultisigTransaction(params);
    this.setTxHash(result);
    return result;
  }

  setTxHash(proposal) {
    this.txHash = proposal.hash;
  }

  async processTransaction() {
    console.log('Transaction.processRawTransaction start');
    let result = null;
    const {
      symbol, netType, sender, receiver, value, data, memo, gasFee, invitationCode,
    } = this;
    try {
      const amount = parseInt(value, 16);
      const fees = parseInt(gasFee.fees, 16);
      const cost = amount + fees;
      const network = netType === 'Mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;

      // Get multisig wallet members' public Keys
      const invitation = await ParseHelper.getMultisigInvitation(invitationCode);
      const pubkeys = _.map(invitation.copayerMembers, (copayerMember) => Buffer.from(copayerMember.publicKey, 'hex'));

      // Build PSBT(Partially Signed Bitcoin Transactions)
      const psbt = new bitcoin.Psbt({ network });

      // Calculate redeem script
      const redeem = bitcoin.payments.p2ms({ m: invitation.signatureNumber, pubkeys, network });
      const p2sh = bitcoin.payments.p2sh({ redeem, network });
      const redeemScript = p2sh.redeem.output;

      // Get transaction inputs
      const inputs = await btc.getTransactionInputs({
        symbol: 'BTC', netType, sender, cost,
      });

      // Get transaction hexs
      const hashes = _.map(inputs, (input) => input.tx_hash);
      const hexs = await ParseHelper.getBitcoinTransactionHex(netType, hashes);

      // Add transaction inputs
      let inputsValue = 0;
      _.each(inputs, (input, index) => {
        const { tx_hash: hash, tx_output_n: outputIndex, value: txValue } = input;
        psbt.addInput({
          hash,
          index: outputIndex,
          nonWitnessUtxo: Buffer.from(hexs[index], 'hex'),
          redeemScript,
        });
        inputsValue += txValue;
      });

      // Add outputs
      psbt.addOutput({ address: receiver, value: amount });
      psbt.addOutput({ address: sender, value: inputsValue - amount - fees });

      // Encode to send out to the signers
      const rawTransaction = psbt.toBase64();

      // Create transaction proposal
      const param = btc.getRawTransactionParam({
        symbol, netType, sender, receiver, value, data, memo, gasFee, rawTransaction,
      });
      console.log(`createRawMultisigTransaction, param: ${JSON.stringify(param)}`);
      result = await Parse.Cloud.run('createRawMultisigTransaction', param);
      console.log('createRawMultisigTransaction, result: ', result);

      this.rawTransaction = rawTransaction;
      this.proposalId = result.id;

      // Signed transaction
      this.signTransaction();
    } catch (e) {
      console.log('Transaction.processRawTransaction err: ', e.message);
      throw e;
    }
    console.log(`Transaction.processRawTransaction finished, result: ${JSON.stringify(result)}`);
  }

  signTransaction = () => {
    console.log('Transaction.signTransaction start');
    const { netType, rawTransaction, privateKey } = this;
    const network = netType === 'Mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
    const buf = Buffer.from(privateKey, 'hex');
    const keyPair = bitcoin.ECPair.fromPrivateKey(buf, { network });
    try {
      const signedTransaction = bitcoin.Psbt.fromBase64(rawTransaction);
      signedTransaction.signAllInputs(keyPair);
      this.signedTransaction = signedTransaction.toBase64();
      console.log('this.signedTransaction: ', this.signedTransaction);
    } catch (e) {
      console.log('MultisigTransaction.signTransaction err: ', e.message);
      throw e;
    }
  }
}

export default MultisigTransaction;

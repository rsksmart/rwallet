import _ from 'lodash';

const bitcoin = require('bitcoinjs-lib');

export default class PsbtHelper {
  static fromBase64(base64, netType) {
    const network = netType === 'Mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
    const psbt = bitcoin.Psbt.fromBase64(base64, { network });
    return psbt;
  }

  static getTransactionInfo = (psbt) => {
    const inputsValue = _.reduce(psbt.data.inputs, (sum, input) => {
      const tx = bitcoin.Transaction.fromBuffer(input.nonWitnessUtxo);
      return sum + tx.outs[1].value;
    }, 0);

    const { txOutputs } = psbt;

    return {
      total: inputsValue,
      outputs: psbt.txOutputs,
      fee: inputsValue - txOutputs[0].value - txOutputs[1].value,
    };
  }
}

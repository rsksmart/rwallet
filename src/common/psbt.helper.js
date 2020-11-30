import _ from 'lodash';

const bitcoin = require('bitcoinjs-lib');

/**
 * PSBT Helper
 * Some functions to help use PSBT
 */
export default class PsbtHelper {
  /**
   * restore from psbt base64 data
   * @param {string} base64, psbt base64 data
   * @param {string} netType
   * @return {object} psbt
   */
  static fromBase64(base64, netType) {
    const network = netType === 'Mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
    return bitcoin.Psbt.fromBase64(base64, { network });
  }

  /**
   * Get transaction info from psbt
   * @param {*} base64, psbt base64 data
   * @return {object} info, { total, outputs, fee }
   */
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

import MultisigTransaction from './multisig.transaction';
import Transaction from './transaction';

/**
 * createTransaction, returns transaction or multisig transaction
 * @param {token} coin
 * @param {string} receiver
 * @param {string} value
 * @param {object} extraParams
 */
const createTransaction = (coin, receiver, value, extraParams) => (coin.isMultisig
  ? new MultisigTransaction(coin, receiver, value, extraParams)
  : new Transaction(coin, receiver, value, extraParams));

export { createTransaction, MultisigTransaction, Transaction };

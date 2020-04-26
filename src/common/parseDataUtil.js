import moment from 'moment';
import definitions from './definitions';

const parseDataUtil = {
  /**
   * get transaction from parse transaction object
   * @param {*} txOjbect, parse transaction object
   */
  getTransaction(txOjbect) {
    const createdAt = txOjbect.get('createdAt');
    const confirmedAt = txOjbect.get('confirmedAt');
    const transaction = {
      createdAt: createdAt ? moment(createdAt) : null,
      confirmedAt: confirmedAt ? moment(confirmedAt) : null,
      chain: txOjbect.get('chain'),
      type: txOjbect.get('type'),
      from: txOjbect.get('from'),
      hash: txOjbect.get('hash'),
      value: txOjbect.get('value'),
      blockHeight: txOjbect.get('blockHeight'),
      symbol: txOjbect.get('symbol'),
      to: txOjbect.get('to'),
      confirmations: txOjbect.get('confirmations'),
      memo: txOjbect.get('memo'),
      status: txOjbect.get('status'),
      objectId: txOjbect.id,
    };
    return transaction;
  },

  /**
   * get balance from parse transaction object
   * @param {*} balanceObj, parse balance object
   */
  getBalance(balanceObj) {
    const balance = {
      objectId: balanceObj.id, balance: balanceObj.get('balance'), address: balanceObj.get('address'), symbol: balanceObj.get('symbol'),
    };
    return balance;
  },

  getPrices(priceObj) {
    return priceObj ? priceObj.get('value') : [];
  },

  getBlockHeight(row) {
    const key = row.get('key');
    const value = row.get('value');
    const { blockHeightKeyInfos } = definitions;
    return { ...blockHeightKeyInfos[key], blockHeight: value[0] };
  },
};

export default parseDataUtil;

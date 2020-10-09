import _ from 'lodash';
import moment from 'moment';
import { blockHeightKeyInfos, TxStatus } from './constants';

const parseDataUtil = {
  /**
   * get transaction from parse transaction object
   * @param {*} txOjbect, parse transaction object
   */
  getTransaction(txObject) {
    const transaction = {
      chain: txObject.get('chain'),
      type: txObject.get('type'),
      from: txObject.get('from'),
      hash: txObject.get('hash'),
      value: txObject.get('value'),
      blockHeight: txObject.get('blockHeight'),
      symbol: txObject.get('symbol'),
      to: txObject.get('to'),
      confirmations: txObject.get('confirmations'),
      memo: txObject.get('memo'),
      confirmedAt: txObject.get('confirmedAt'),
      createdAt: txObject.get('createdAt'),
      status: txObject.get('status'),
      objectId: txObject.id,
    };
    return transaction;
  },

  /**
   * processTransaction, process transaction with transaction, isSender
   * @param {object} transaction
   * @param {boolean} isSender
   */
  processTransaction(transaction, isSender) {
    const newTransaction = transaction;
    const dateTime = newTransaction.status === TxStatus.SUCCESS ? transaction.confirmedAt : transaction.createdAt;
    // Handling the case where datetime is undefined
    newTransaction.dateTime = dateTime ? moment(dateTime) : undefined;

    let statusText = 'Failed';
    switch (transaction.status) {
      case TxStatus.PENDING:
        statusText = isSender ? 'Sending' : 'Receiving';
        break;
      case TxStatus.SUCCESS:
        statusText = isSender ? 'Sent' : 'Received';
        break;
      default:
    }
    newTransaction.statusText = statusText;
    newTransaction.isSender = isSender;
    return newTransaction;
  },

  /**
   * get balance from parse transaction object
   * @param {*} balanceObj, parse balance object
   */
  getToken(tokenObj) {
    const balance = {
      objectId: tokenObj.id,
      balance: tokenObj.get('balance'),
      address: tokenObj.get('address'),
      symbol: tokenObj.get('symbol'),
      type: tokenObj.get('type'),
      subdomain: tokenObj.get('subdomain'),
    };
    return balance;
  },

  getPrices(priceObj) {
    return priceObj ? priceObj.get('valObj').value : [];
  },

  getBlockHeight(row) {
    const key = row.get('key');
    const { value } = row.get('valObj');
    return { ...blockHeightKeyInfos[key], blockHeight: value };
  },

  getDapp(dappObject) {
    const dapp = {
      id: dappObject.id,
      name: dappObject.get('name'),
      title: dappObject.get('title'),
      description: dappObject.get('description'),
      url: dappObject.get('url'),
      iconUrl: dappObject.get('iconUrl'),
      isActive: dappObject.get('isActive'),
      isRecommended: dappObject.get('isRecommended'),
      type: dappObject.get('type'),
      contractAddresses: dappObject.get('contractAddresses'),
      tokens: dappObject.get('tokens'),
      networks: dappObject.get('networks'),
    };
    return dapp;
  },

  getDappTypes(dappTypesObject) {
    return dappTypesObject ? dappTypesObject.get('value') : [];
  },

  getAdvertisement(advertisementObject) {
    const advertisement = {
      id: advertisementObject.id,
      imgUrl: advertisementObject.get('imgUrl'),
      url: advertisementObject.get('url'),
      isActive: advertisementObject.get('isActive'),
      start: advertisementObject.get('start'),
      end: advertisementObject.get('end'),
    };
    return advertisement;
  },

  getSubdomainStatus(subdomains, records) {
    // The data queried from the database should correspond to the local records one by one
    if (subdomains.length < records.length) {
      throw new Error('err.subdomainnotfound');
    }
    _.each(subdomains, (row) => {
      const status = row.get('status');
      const address = row.get('address');
      const subdomain = row.get('subdomain');
      const item = _.find(records, (record) => address === record.address && subdomain === record.subdomain);
      if (!item) {
        throw new Error('err.subdomainnotfound');
      }
      item.status = status;
    });
    return records;
  },
};

export default parseDataUtil;

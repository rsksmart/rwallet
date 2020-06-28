import _ from 'lodash';
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
    const receivedAt = txOjbect.get('receivedAt');
    const transaction = {
      createdAt: createdAt ? moment(createdAt) : null,
      confirmedAt: confirmedAt ? moment(confirmedAt) : null,
      receivedAt,
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
  getToken(tokenObj) {
    const balance = {
      objectId: tokenObj.id,
      balance: tokenObj.get('balance'),
      address: tokenObj.get('address'),
      symbol: tokenObj.get('symbol'),
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
    const { blockHeightKeyInfos } = definitions;
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

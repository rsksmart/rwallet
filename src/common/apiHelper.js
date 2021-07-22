import axios from 'axios';
import Web3 from 'web3';

import ParseHelper from './parse';

const headers = {
  'X-Parse-Application-Id': 'rwallet',
  'X-Parse-REST-API-KEY': '',
  'Content-Type': 'application/json',
  'X-RWALLET-API-KEY': 'masterKey',
};

const apiHelper = {
  async getAbiByAddress(address) {
    try {
      const parseServer = ParseHelper.getServerUrl();
      const url = `${parseServer}/functions/getAbiByAddress`;
      // using Web3.utils.toChecksumAddress without chainId to match the backend to get the erc20 token's info(symbol, abi)
      const result = await axios.post(url, { address: Web3.utils.toChecksumAddress(address) }, { headers, timeout: 5000 });
      return result.data.result;
    } catch (error) {
      console.log('getAbiByAddress error: ', error);
      return null;
    }
  },
};

export default apiHelper;

import axios from 'axios';

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
      const parseServer = ParseHelper.serverUrl;
      const url = `${parseServer}/functions/getAbiByAddress`;
      const result = await axios.post(url, { address }, { headers, timeout: 5000 });
      return result.data.result;
    } catch (error) {
      console.log('getAbiByAddress error: ', error);
      return null;
    }
  },
};

export default apiHelper;

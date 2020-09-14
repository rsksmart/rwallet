import axios from 'axios';

import { PARSE_SERVER_URL } from 'react-native-dotenv';

const headers = {
  'X-Parse-Application-Id': 'rwallet',
  'X-Parse-REST-API-KEY': '',
  'Content-Type': 'application/json',
  'X-RWALLET-API-KEY': 'masterKey',
};

const apiHelper = {
  async getAbiByAddress(address) {
    try {
      const url = `${PARSE_SERVER_URL}/functions/getAbiByAddress`;
      const result = await axios.post(url, { address }, { headers });
      return result.data.result;
    } catch (error) {
      console.log('getAbiByAddress error: ', error);
      return null;
    }
  },
};

export default apiHelper;

import axios from 'axios';
import qs from 'qs';

import { PARSE_SERVER_URL, RWALLET_API_KEY } from 'react-native-dotenv';

const headers = {
  'X-Parse-Application-Id': 'rwallet',
  'X-Parse-REST-API-KEY': '',
  'Content-Type': 'application/json',
  'X-RWALLET-API-KEY': 'masterKey',
};

const apiHelper = {
  async getAbiByAddress(type, address) {
    try {
      const result = await axios.post(`${PARSE_SERVER_URL}/functions/getAbiByAddress`, { type, address }, { headers });
      return result.data.result;
    } catch (error) {
      console.log('getAbiByAddress error: ', error);
      return null;
    }
  },
};

export default apiHelper;

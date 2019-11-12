import axios from 'axios';
import common from './common';
import actions from '../redux/app/actions';
import storage from './storage';

const { loading } = actions;
const { baseUrl } = common;

const headers = {
  'Content-Type': 'application/json;charset=utf-8',
  'Accept-Encoding': 'gzip, deflate',
};

const getTokenHeader = async () => {
  const timestamp = new Date().getTime();
  let accessToken = '';

  try {
    accessToken = await storage.getLocaItem('login', 'token');
  } catch (e) {
    console.log('未成功从storage中取得login-token');
  }

  return {
    accessToken,
    timestamp,
  };
};

axios.interceptors.request.use(
  async (config) => {
    config.headers = {
      ...headers,
      ...await getTokenHeader(),
    };
    return config;
  },
  (err) => Promise.reject(err),
);

axios.interceptors.response.use(
  (response) => new Promise((resolve, reject) => {
    resolve(response);
  }),
  (err) => Promise.reject(err) // 返回接口返回的错误信息
  ,
);

const get = (url, params = {}) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}${url}`, {
    params,
  }).then((response) => {
    if (response) {
      resolve(response);
    } else {
      resolve(undefined);
    }
  })
    .catch((err) => {
      reject(err);
    });
});

const asyncGet = (url, params = {}) => {
  loading(true);
  return new Promise<T>((resolve, reject) => {
    get(url, params).then((resp) => {
      loading(false);
      resolve(resp);
    }).catch((err) => {
      loading(false);
      reject(err);
    });
  });
};

const asyncPost = (url, data = {}) => {
  loading(true);
  return new Promise<T>((resolve, reject) => {
    post(url, data).then((resp) => {
      loading(false);
      resolve(resp as T);
    }).catch((err) => {
      loading(false);
      reject(err);
    });
  });
};

class FormDataBuffer {
    data:any = {};

    constructor(data = {}) {
      this.data = data;
    }

    append(key : string, value: any) {
      this.data[key] = value;
      return this;
    }

    appendImage(key : string, image : any) {
      this.append(key, {
        uri: image.path,
        type: image.mime,
        size: image.size,
        name: image.path,
      });
      return this;
    }

    appendImages(key : string, images : any[]) {
      images.forEach(((value, index, array) => {
        this.append(key, {
          uri: value.path,
          type: value.mime,
          size: value.size,
          name: value.path,
        });
      }));
      return this;
    }

    toFormData() {
      const formData = new FormData();
      for (const key of Object.keys(this.data)) {
        const value = this.data[key];
        // @ts-ignore
        formData.append(key, value);
      }
      return formData;
    }
}

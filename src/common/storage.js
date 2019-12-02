import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

class RNStorage {
  constructor() {
    this.instance = new Storage({
      // maximum capacity, default 1000
      size: 9000,
      // Use AsyncStorage for RN apps, or window.localStorage for web apps.
      // If storageBackend is not set, data will be lost after reload.
      storageBackend: AsyncStorage,
      // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
      // can be null, which means never expire.
      defaultExpires: 1000 * 60 * 60 * 24 * 365,
      // cache data in the memory. default is true.
      enableCache: true,
    });

    this.remove = this.remove.bind(this);
  }

  /**
   *
   * @param {string} key
   * @param {*} data
   * @param {*} id
   * @param {number|null} expires
   * @returns {Promise}
   */
  save(key, data, expires) {
    return this.instance.save({
      key, data, expires,
    });
  }

  /**
   * Load data in Storage by params, for example { key: "settings" }
   * @param {object} params { key: "" }
   */
  async load(params) {
    // eslint-disable-next-line no-return-await
    return this.instance.load(params)
      .catch((err) => {
      // any exception including data not found goes to catch()
        switch (err.name) {
          case 'NotFoundError':
            return null;
          case 'ExpiredError':
          // TODO: figure out what we actually want to do to this case
            return null;
          default:
            return null;
        }
      });
  }

  /**
   *
   * @param {string} key
   * @param {*} id
   * @returns {Promise}
   */
  getLocalItem(key, id) {
    return this.instance.load({
      key, id: id || undefined, autoSync: false, syncInBackground: false,
    });
  }


  /**
   *
   * @param {string} key
   * @param {*} syncParams
   * @param {*} id
   * @returns {Promise}
   */
  getAsyncItem(key, syncParams, id) {
    return this.instance.load({
      key,
      id: id || undefined,
      // autoSync (default: true) means if data is not found or has expired,
      // then invoke the corresponding sync method
      autoSync: true,
      // syncInBackground (default: true) means if data expired,
      // return the outdated data first while invoking the sync method.
      // If syncInBackground is set to false, and there is expired data,
      // it will wait for the new data and return only after the sync completed.
      // (This, of course, is slower)
      syncInBackground: false,
      syncParams: { ...syncParams },
    });
  }

  /**
   *
   * @param {string} key
   * @param {*} id
   * @returns {Promise}
   */
  removeId(key, id) {
    // const that = this;

    if (id) {
      return this.instance.remove({
        key,
        id,
      });
    }

    // // Get storage Ids by key
    // const ids = await this.getIdsForKey(key);

    // // Push all remove promise into an array and handle parallelly
    // const promises = ids.map((storageId) => that.instance.remove({ key, storageId }));

    // return Promise.all(promises);
    return null;
  }

  /**
   * Remove all key values from the Storage instance
   * @returns {Promise}
   */
  remove(key) {
    return this.instance.remove({ key });
  }

  /**
   *
   * @param {string} key
   * @returns {Promise} Array of string
   */
  getIdsForKey(key) {
    return this.instance.getIdsForKey(key);
  }
}

export default new RNStorage();

import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

class RNStorage {
  constructor() {
    this.instance = new Storage({
      size: 9000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 60 * 60 * 24 * 365,
      enableCache: true,
    });
  }

  /**
   *
   * @param {string} key
   * @param {*} data
   * @param {*} id
   * @param {number|null} expires
   * @returns {Promise}
   */
  save(key, data, id, expires) {
    return this.instance.save({
      key, id, data, expires,
    });
  }

  /**
   *
   * @param {*} params
   */
  async load(params) {
    // eslint-disable-next-line no-return-await
    return this.instance.load(params);
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
      key, id: id || undefined, autoSync: true, syncInBackground: false, syncParams: { ...syncParams },
    });
  }

  /**
   *
   * @param {string} key
   * @param {*} id
   * @returns {Promise}
   */
  async remove(key, id) {
    const that = this;

    if (id) {
      return this.instance.remove({
        key,
        id,
      });
    }

    // Get storage Ids by key
    const ids = await this.getIdsForKey(key);

    // Push all remove promise into an array and handle parallelly
    const promises = ids.map((storageId) => that.instance.remove({ key, storageId }));

    return Promise.all(promises);
  }

  /**
   * Remove all key values from the Storage instance
   * @returns {Promise}
   */
  clear() {
    return this.instance.clearMap();
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

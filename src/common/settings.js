import { Map } from 'immutable';
import _ from 'lodash';
import storage from './storage';
import config from '../../config';
import { getCurrentLanguage } from './i18n';
import CONSTANTS from './constants.json';

/**
* defaultSettings
* {
*   username: "Anonymous User"
*   language: 'en',
*   currency: 'USD',
*   fingerprint: false,
* }
*/
const { defaultSettings } = config;

/**
 * Settings instance is initialized by deserialize()
 */
class Settings {
  constructor() {
    this.data = Map(defaultSettings);
    this.set('language', getCurrentLanguage());
    this.serialize = this.serialize.bind(this);
    this.deserialize = this.deserialize.bind(this);
  }

  get(key) {
    return this.data.get(key);
  }

  set(key, value) {
    this.data = this.data.set(key, value);
  }

  toJSON() {
    return this.data.toJSON();
  }

  /**
   * Save JSON presentation of settings data to permenate storage
   */
  serialize() {
    const jsonData = this.data.toJSON();

    console.log('Serializing Settings to Storage.', jsonData);

    return storage.save('settings', jsonData);
  }

  /**
   * Read permenate storage and load settins into this instance;
   * Load default settings if Settings is empty in storage
   */
  async deserialize() {
    const result = await storage.load({ key: 'settings' });

    console.log('Deserialized Settings from Storage.', result);

    if (!_.isNull(result) && _.isObject(result)) {
      // store settings will merge to defaultSettings, avoids undefined value
      this.data = Map(defaultSettings).merge(Map(result));
      return;
    }

    // If there is no valid settings yet, we save default into storage
    this.serialize();
  }

  /*
   * validateName
   * @param {string} name, accept a-z, A-Z, 0-9 and space, max length is 32
   */
  // eslint-disable-next-line class-methods-use-this
  validateName(name) {
    if (name.length < 1) {
      throw new Error('err.nametooshort');
    } else if (name.length > CONSTANTS.NAME_MAX_LENGTH) {
      throw new Error('err.nametoolong');
    }
    const regex = /^[a-zA-Z0-9 ]+$/;
    const match = regex.exec(name);
    if (!match) {
      throw new Error('err.nameinvalid');
    }
  }
}

export default new Settings();

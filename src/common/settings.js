import { Map } from 'immutable';
import _ from 'lodash';
import storage from './storage';
import config from '../../config';

/**
* defaultSettings
* {
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
  async serialize() {
    const jsonData = this.data.toJSON();
    await storage.save('settings', jsonData);
  }

  /**
   * Read permenate storage and load settins into this instance;
   * Load default settings if Settings is empty in storage
   */
  async deserialize() {
    const result = await storage.load({ key: 'settings' });

    console.log('Deserialized Settings from Storage.', result);

    if (!_.isNull(result) && _.isObject(result)) {
      this.data = Map(result);
      return;
    }

    // If there is no valid settings yet, we save default into storage
    this.serialize();
  }
}

export default new Settings();

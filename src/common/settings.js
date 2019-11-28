import { Map } from 'immutable';
import storage from './storage';
import config from '../../config';

const { defaultSettings } = config;

class Settings {
  constructor() {
    /**
    * {
    *   language: 'en',
    *   currency: 'USD',
    *   fingerprint: false,
    * }
    */
    this.data = new Map(defaultSettings);
  }

  get(key) {
    return this.data.get(key);
  }

  set(key, value) {
    this.data.set(key, value);
  }

  toJson() {
    return this.data.toJson();
  }

  serialize() {
    const promises = this.data.map((value, key) => storage.save(key, value));
    return Promise.all(promises);
  }

  deserialize() {
    const promises = this.data.map((value, key) => storage.load(key));
    return Promise.all(promises);
  }
}

export default new Settings();

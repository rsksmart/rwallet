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
    this.data = this.data.set(key, value);
    return this;
  }

  toJson() {
    return this.data.toJSON();
  }

  serialize() {
    const promises = [...this.data.entries()]
      .map(([key, value]) => storage.save(key, value));

    return Promise.all(promises);
  }

  deserialize() {
    const promises = [...this.data.keys()]
      .map((key) => storage.load({ key }));

    return Promise.all(promises);
  }
}

export default new Settings();

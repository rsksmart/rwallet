import { Map } from 'immutable';
import _ from 'lodash';
import storage from './storage';
import config from '../../config';

/**
* defaultUser
* {
*   name: 'Anonymous User',
* }
*/
const { defaultUser } = config;

/**
 * User instance is initialized by deserialize()
 */
class User {
  constructor() {
    this.data = Map(defaultUser);
    this.serialize = this.serialize.bind(this);
    this.deserialize = this.deserialize.bind(this);
    this.rename = this.rename.bind(this);
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
   * Save JSON presentation of user data to permenate storage
   */
  serialize() {
    const jsonData = this.data.toJSON();

    console.log('Serializing user to Storage.', jsonData);

    return storage.save('user', jsonData);
  }

  /**
   * Read permenate storage and load user into this instance;
   * Load default User if User is empty in storage
   */
  async deserialize() {
    const result = await storage.load({ key: 'user' });

    console.log('Deserialized user from Storage.', result);

    if (!_.isNull(result) && _.isObject(result)) {
      this.data = Map(result);
      return;
    }

    // If there is no valid User yet, we save default into storage
    this.serialize();
  }

  /*
   * Rename
   * @param {string} name, accept a-z, A-Z, 0-9 and space, max length is 32
   */
  async rename(name) {
    if (name.length < 1) {
      throw new Error('Name is too short.');
    } else if (name.length > 32) {
      throw new Error('Name is too long.');
    }
    const regex = /^[a-zA-Z0-9 ]{1,32}$/g;
    const match = regex.exec(name);
    if (!match) {
      console.log('rename, regex validatiton failed');
      throw new Error('Name contains invalid characters.');
    }
    this.set('name', name);
    await this.serialize();
  }
}

export default new User();

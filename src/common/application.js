import _ from 'lodash';
import { Map } from 'immutable';
import UUIDGenerator from 'react-native-uuid-generator';
import storage from './storage';

class Application {
  constructor() {
    this.data = Map({
      id: undefined,
    });

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
    await storage.save('app', jsonData);
  }

  /**
   * Read permenate storage and load settins into this instance;
   * Load default settings if Settings is empty in storage
   */
  async deserialize() {
    const result = await storage.load({ key: 'app' });

    console.log('Deserialized Application from Storage.', result);

    if (!_.isNull(result)) {
      this.data = Map(result);
      return;
    }

    // If result is null; meaning there's no Application in storage
    // therefore we create a new one here
    const newId = await this.createId();
    await this.saveId(newId);
  }

  createId = async () => new Promise((resolve) => {
    UUIDGenerator.getRandomUUID((uuid) => resolve(uuid));
  })

  saveId = async (id) => {
    this.set('id', id);
    await this.serialize();
  }
}

export default new Application();

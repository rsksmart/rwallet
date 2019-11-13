/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-await */
/* eslint-disable consistent-return */
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

const rnStorage = new Storage({
  size: 9000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 60 * 60 * 24 * 365,
  enableCache: true,
});

const storage = {
  async save(key: string, data: any, id?: any, expires?: number | null): Promise<void> {
    // eslint-disable-next-line no-return-await
    return await rnStorage.save({
      key,
      id,
      data,
      expires,
    });
  },

  async load(param) {
    // eslint-disable-next-line no-return-await
    return await rnStorage.load(param);
  },

  async getLocaItem<T = any>(key: string, id?: string): Promise<T> {
    return (
      (await this.load)
      < T
      > {
        key,
        id: id || undefined,
        autoSync: false,
        syncInBackground: false,
      }
    );
  },

  async getAsyncItem<T = any>(key: string, syncParams: any, id?: string): Promise<T> {
    return (
      (await this.load)
      < T
      > {
        key,
        id: id || undefined,
        autoSync: true,
        syncInBackground: false,
        syncParams: {
          ...syncParams,
        },
      }
    );
  },

  async remove(key: string, id?: string): Promise<void> {
    if (id) {
      return await rnStorage.remove({
        key,
        id,
      });
    }
    const ids = await this.getIdsForKey(key);
    for (id of ids) {
      await rnStorage.remove({
        key,
        id,
      });
    }
  },

  async clearMaps(): Promise<void> {
    return await rnStorage.clearMap();
  },
  async getIdsForKey(key: string): Promise<string[]> {
    return await rnStorage.getIdsForKey(key);
  },
};

export default storage;

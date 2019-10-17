import Storage, {LoadParams} from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

const _storage = new Storage({

    size: 9000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 60 * 60 * 24 * 365,
    enableCache: true,
});

const storage = {
    async save(key: string, data: any, id?: any, expires?: number | null): Promise<void> {
        return await _storage.save({key,id,data, expires});
    },

    async load<T=any>(param:LoadParams):Promise<T>{
        return await _storage.load<T>(param);
    },

    async getLocaItem<T=any>(key:string,id?:string):Promise<T>{
        return await this.load<T>({
            key: key,
            id : id ? id : undefined,
            autoSync: false,
            syncInBackground: false,
        })
    },

    async getAsyncItem<T=any>(key: string, syncParams: any, id?: string): Promise<T> {
        return await this.load<T>({
            key: key,
            id: id ? id : undefined,
            autoSync: true,
            syncInBackground: false,
            syncParams: {
                ...syncParams
            },
        })
    },

    async remove(key:string,id?:string):Promise<void>{
        if(id){
            return await _storage.remove({
                key: key,
                id : id,
            });
        }else{
            let ids = await this.getIdsForKey(key)
            for(id of ids){
                await _storage.remove({
                    key: key,
                    id : id,
                });
            }
        }
    },

    async clearMaps():Promise<void>{
        return await _storage.clearMap();
    },
    async getIdsForKey(key:string):Promise<string[]>{
        return await _storage.getIdsForKey(key);
    }
};

export default storage;
import { SecureStore } from 'expo';
import { AsyncStorage } from 'react-native';
import { IStorage } from '../Application/IStorage';

export class ExpoStorage implements IStorage {
    secure_set(key: string, value: string): Promise<void> {
        return SecureStore.setItemAsync(key, value);
    }
    secure_get(key: string): Promise<string | null> {
        return SecureStore.getItemAsync(key);
    }
    set(key: string, value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            AsyncStorage.setItem(key, value, error => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
    get(key: string): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            AsyncStorage.getItem(key, (error, value) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(value);
            });
        });
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_1 = require("expo");
const react_native_1 = require("react-native");
class ExpoStorage {
    secure_set(key, value) {
        return expo_1.SecureStore.setItemAsync(key, value);
    }
    secure_get(key) {
        return expo_1.SecureStore.getItemAsync(key);
    }
    set(key, value) {
        return new Promise((resolve, reject) => {
            react_native_1.AsyncStorage.setItem(key, value, error => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
    get(key) {
        return new Promise((resolve, reject) => {
            react_native_1.AsyncStorage.getItem(key, (error, value) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(value);
            });
        });
    }
}
exports.ExpoStorage = ExpoStorage;
;

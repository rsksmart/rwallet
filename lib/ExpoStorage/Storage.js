"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_1 = require("expo");
const SecureStore = require("expo-secure-store");
const react_native_1 = require("react-native");
class ExpoStorage {
    secure_set(key, value) {
        return SecureStore.setItemAsync(key, value);
    }
    secure_get(key) {
        return SecureStore.getItemAsync(key);
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

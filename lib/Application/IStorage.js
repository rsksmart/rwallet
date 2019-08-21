"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DummyStorage {
    secure_set(key, value) {
        return this.set(key, value);
    }
    secure_get(key) {
        return this.get(key);
    }
    set(key, value) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    get(key) {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
    }
}
exports.DummyStorage = DummyStorage;

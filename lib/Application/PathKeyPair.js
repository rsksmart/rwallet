"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PathKeyPair {
    constructor(path = '', pk = '') {
        this.path = path;
        this.public_key = pk;
    }
}
exports.PathKeyPair = PathKeyPair;

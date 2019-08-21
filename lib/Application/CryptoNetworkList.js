"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CryptoNetworkList {
    constructor() {
        this.networks = [];
    }
    add(network) {
        this.networks.push(network);
    }
    find(name) {
        for (let n of this.networks)
            if (n.name == name)
                return n;
        return null;
    }
    find_by_symbol(symbol) {
        for (let n of this.networks)
            if (n.symbol == symbol)
                return n;
        return null;
    }
    get_list() {
        return new Promise((resolve, reject) => resolve(this.networks));
    }
}
exports.CryptoNetworkList = CryptoNetworkList;

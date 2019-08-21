"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Wallet_1 = require("./Wallet");
const bignumber_js_1 = require("bignumber.js");
const CryptoNetworkType_1 = require("./CryptoNetworkType");
const ErrorCodes_1 = require("./ErrorCodes");
class Utxo {
    constructor(tx_id, txo_index, value) {
        this.tx_id = tx_id;
        this.txo_index = txo_index;
        this.value = value;
    }
}
exports.Utxo = Utxo;
class AddressUtxo {
    constructor(address, utxos) {
        this.address = address;
        this.utxos = utxos;
    }
}
exports.AddressUtxo = AddressUtxo;
class TransactionParameters {
    constructor() {
        this.fee = new bignumber_js_1.BigNumber(0);
        this.utxos = [];
        this.nonces = new Map();
    }
    static construct_empty() {
        return new TransactionParameters();
    }
    static from_json_btc(params) {
        let ret = new TransactionParameters();
        ret.fee = new bignumber_js_1.BigNumber(params.mediumFee);
        let map = new Map();
        for (let i = 0; i < params.utxos.length; i++) {
            let utxo = params.utxos[i];
            let array = map.get(utxo.address);
            if (array == undefined)
                map.set(utxo.address, (array = []));
            array.push(new Utxo(utxo.txid, utxo.vout, new bignumber_js_1.BigNumber(utxo.satoshis)));
        }
        map.forEach((v, k) => ret.utxos.push(new AddressUtxo(k, v)));
        return ret;
    }
    static from_json_eth(params) {
        let ret = new TransactionParameters();
        ret.fee = new bignumber_js_1.BigNumber(params.gasPrice);
        for (let i = 0; i < params.nonces.length; i++) {
            let kv = params.nonces[i];
            ret.nonces.set(kv.addr, new bignumber_js_1.BigNumber(kv.nonce));
        }
        return ret;
    }
    static from_json_rsk(params) {
        let ret = new TransactionParameters();
        ret.fee = new bignumber_js_1.BigNumber(params.gasPrice);
        for (let i = 0; i < params.nonces.length; i++) {
            let kv = params.nonces[i];
            ret.nonces.set(kv.addr.toLowerCase(), new bignumber_js_1.BigNumber(kv.nonce));
        }
        return ret;
    }
    static from_json(network, json) {
        switch (network.type) {
            case CryptoNetworkType_1.CryptoNetworkType.BTC:
            case CryptoNetworkType_1.CryptoNetworkType.BTCTestnet:
                return this.from_json_btc(JSON.parse(json));
            case CryptoNetworkType_1.CryptoNetworkType.ETH:
            case CryptoNetworkType_1.CryptoNetworkType.ETHRopsten:
                return this.from_json_eth(JSON.parse(json));
            case CryptoNetworkType_1.CryptoNetworkType.RSK:
            case CryptoNetworkType_1.CryptoNetworkType.RSKTestnet:
                return this.from_json_rsk(JSON.parse(json));
            default:
                throw new Error(ErrorCodes_1.ErrorCode.ERROR_UNKNOWN_NETWORK);
        }
    }
    get_fee(size, weight) {
        let fee = this.fee;
        if (size)
            fee = fee.times(size).dividedToIntegerBy(1000);
        switch (weight) {
            case Wallet_1.FeeWeight.Low:
                return fee.times(8).dividedToIntegerBy(10);
            case Wallet_1.FeeWeight.Normal:
                return fee;
            case Wallet_1.FeeWeight.High:
                return fee.times(12).dividedToIntegerBy(10);
        }
        return this.fee;
    }
    get_gas_price(weight) {
        switch (weight) {
            case Wallet_1.FeeWeight.Low:
                return this.fee.times(8).dividedToIntegerBy(10);
            case Wallet_1.FeeWeight.Normal:
                return this.fee;
            case Wallet_1.FeeWeight.High:
                return this.fee.times(12).dividedToIntegerBy(10);
        }
        return this.fee;
    }
    get_utxo() {
        return this.utxos;
    }
    get_nonce(address) {
        let ret = this.nonces.get(address);
        return ret != undefined ? ret : new bignumber_js_1.BigNumber(0);
    }
}
exports.TransactionParameters = TransactionParameters;

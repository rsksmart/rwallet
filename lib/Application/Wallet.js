"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorCodes_1 = require("./ErrorCodes");
const bignumber_js_1 = require("bignumber.js");
const PathKeyPair_1 = require("./PathKeyPair");
const MyLogger_1 = require("./MyLogger");
var WalletConstructorMode;
(function (WalletConstructorMode) {
    WalletConstructorMode[WalletConstructorMode["Create"] = 0] = "Create";
    WalletConstructorMode[WalletConstructorMode["Derive"] = 1] = "Derive";
    WalletConstructorMode[WalletConstructorMode["Restore"] = 2] = "Restore";
})(WalletConstructorMode = exports.WalletConstructorMode || (exports.WalletConstructorMode = {}));
function empty_promise() {
    return new Promise((resolve, reject) => {
        resolve();
    });
}
var FeeWeight;
(function (FeeWeight) {
    FeeWeight["Low"] = "low";
    FeeWeight["Normal"] = "normal";
    FeeWeight["High"] = "high";
})(FeeWeight = exports.FeeWeight || (exports.FeeWeight = {}));
class Wallet {
    constructor(application, storage, ss) {
        this.id = 0;
        this.name = '';
        this.network = null;
        this.parent = null;
        this.private_key_name = '';
        this.recovery_phrase_name = '';
        this.global_root_node = new PathKeyPair_1.PathKeyPair();
        this.local_root_node = new PathKeyPair_1.PathKeyPair();
        this.subwallets = 0;
        this.public_keys = [];
        this.recovery_phrase = null;
        this.deleted = false;
        this.application = application;
        this.storage = storage;
        this.state_saver = ss;
    }
    static create_wallet(application, id, name, main_phrase_name, network, storage, ss) {
        return new Promise((resolve, reject) => {
            let ret = new Wallet(application, storage, ss);
            ret.id = id;
            ret.name = name;
            ret.network = network;
            ret.set_key_names();
            ret.finish_initializing(null, main_phrase_name)
                .then(() => {
                resolve(ret);
            })
                .catch(reject);
        });
    }
    static derive_wallet(parent, id, name) {
        return new Promise((resolve, reject) => {
            let ret = new Wallet(parent.application, parent.storage, parent.state_saver);
            ret.id = id;
            ret.name = name;
            ret.parent = parent;
            ret.network = ret.parent.network;
            ret.storage = ret.parent.storage;
            let root = ret.get_root_wallet();
            ret.private_key_name = root.private_key_name;
            ret.recovery_phrase_name = root.recovery_phrase_name;
            ret.finish_initializing(null, null)
                .then(() => {
                resolve(ret);
            })
                .catch(reject);
        });
    }
    generate_required_addresses(required_addresses) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (let i = 0; i < required_addresses.length; i++)
                    while (this.public_keys.length < required_addresses[i])
                        yield this.generate_address();
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    static restore_root_wallet(application, id, phrase, recovery_phrase_name, name, network, storage, ss, required_addresses) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let ret = new Wallet(application, storage, ss);
            ret.id = id;
            ret.name = name;
            ret.network = network;
            ret.set_key_names();
            try {
                yield ret.finish_initializing(phrase, recovery_phrase_name);
                yield ret.generate_required_addresses(required_addresses);
                resolve(ret);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    static restore_derived_wallet(application, id, parent, subwallet_index, name, required_addresses) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let ret = new Wallet(parent.application, parent.storage, parent.state_saver);
            ret.id = id;
            ret.name = name;
            ret.parent = parent;
            ret.network = ret.parent.network;
            ret.storage = ret.parent.storage;
            let root = ret.get_root_wallet();
            ret.private_key_name = root.private_key_name;
            ret.recovery_phrase_name = root.recovery_phrase_name;
            ret.global_root_node = root.global_root_node;
            if (ret.network == null) {
                //Should never happen.
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            let index = subwallet_index;
            try {
                ret.local_root_node = new PathKeyPair_1.PathKeyPair(ret.global_root_node.path + '/' + index, yield ret.network.derive_child_from_node(ret.global_root_node.public_key, index));
                yield ret.generate_required_addresses(required_addresses);
            }
            catch (e) {
                reject(e);
                return;
            }
            root.subwallets = Math.max(root.subwallets, subwallet_index);
            resolve(ret);
        }));
    }
    static load_wallet(application, serialized, loader, get_network, storage, ss) {
        return new Promise((resolve, reject) => {
            MyLogger_1.MyLogger.debug('Loading wallet: ' + serialized);
            let ret = new Wallet(application, storage, ss);
            let deserialized = JSON.parse(serialized);
            ret.id = deserialized.id;
            ret.name = deserialized.name;
            ret.network = get_network(deserialized.network);
            if (!ret.network) {
                reject(ErrorCodes_1.ErrorCode.ERROR_UNKNOWN_NETWORK);
                return;
            }
            ret.parent = deserialized.parent == null ? null : loader(deserialized.parent);
            ret.private_key_name = deserialized.private_key_name;
            ret.recovery_phrase_name = deserialized.recovery_phrase_name;
            ret.global_root_node = deserialized.global_root_node;
            ret.local_root_node = deserialized.local_root_node;
            ret.subwallets = deserialized.subwallets;
            ret.public_keys = deserialized.public_keys;
            ret.deleted = deserialized.deleted;
            resolve(ret);
        });
    }
    set_key_names() {
        this.private_key_name = 'wallet_' + this.id + '_private_key';
        this.recovery_phrase_name = 'wallet_' + this.id + '_recovery_phrase';
    }
    finish_initializing(phrase, recovery_phrase_name) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.network == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            try {
                let root = this.get_root_wallet();
                if (this.parent == null) {
                    if (!recovery_phrase_name) {
                        if (phrase == null)
                            phrase = yield this.network.generate_recovery_phrase();
                        this.recovery_phrase = phrase;
                        yield this.storage.secure_set(this.recovery_phrase_name, phrase);
                    }
                    else {
                        this.recovery_phrase_name = recovery_phrase_name;
                        phrase = yield this.storage.secure_get(this.recovery_phrase_name);
                        if (phrase == null)
                            //Shouldn't happen.
                            phrase = yield this.network.generate_recovery_phrase();
                    }
                    let master = yield this.network.generate_master_from_recovery_phrase(phrase);
                    yield this.storage.secure_set(this.private_key_name, master);
                    this.global_root_node = yield this.network.generate_root_node_from_master(master);
                }
                else {
                    this.global_root_node = root.global_root_node;
                }
                MyLogger_1.MyLogger.debug('global_root_node ' +
                    this.global_root_node.path +
                    ' ' +
                    this.global_root_node.public_key);
                let index = root.subwallets++;
                this.local_root_node = new PathKeyPair_1.PathKeyPair(this.global_root_node.path + '/' + index, yield this.network.derive_child_from_node(this.global_root_node.public_key, index));
                MyLogger_1.MyLogger.debug('local_root_node ' +
                    this.local_root_node.path +
                    ' ' +
                    this.local_root_node.public_key);
                //this.internal_generate_public_key();
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    get_id() {
        return new Promise((resolve, reject) => {
            resolve(this.id);
        });
    }
    get_root_wallet() {
        let current = this;
        while (true) {
            if (current.parent == null)
                return current;
            current = current.parent;
        }
    }
    get_recovery_phrase_name() {
        return this.recovery_phrase_name;
    }
    generate_child_public_key(index) {
        let pk = this.local_root_node;
        let path = pk.path + '/' + index;
        return new Promise((resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            this.network
                .derive_child_from_node(pk.public_key, index)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                if (this.network)
                    MyLogger_1.MyLogger.debug('Generated key ' +
                        path +
                        ' ' +
                        result +
                        ' ' +
                        (yield this.network.get_address(result)));
                resolve(new PathKeyPair_1.PathKeyPair(path, result));
            }))
                .catch(reject);
        });
    }
    get_private_key(index) {
        let path = this.local_root_node.path + '/' + index;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.network == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            let prk = yield this.storage.secure_get(this.private_key_name);
            if (prk == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            this.network
                .derive_path_from_node(prk, path)
                .then(resolve)
                .catch(reject);
        }));
    }
    get_name() {
        return new Promise((resolve, reject) => {
            resolve(this.name);
        });
    }
    set_name(value) {
        this.name = value;
        return this.state_saver.save_state();
    }
    get_phrase() {
        return new Promise((resolve, reject) => {
            if (this.recovery_phrase != null) {
                let ret = this.recovery_phrase;
                this.recovery_phrase = null;
                resolve(ret);
                return;
            }
            this.storage
                .secure_get(this.recovery_phrase_name)
                .then(result => {
                if (result == null) {
                    reject(ErrorCodes_1.ErrorCode.ERROR_VALUE_NOT_FOUND);
                    return;
                }
                resolve(result);
            })
                .catch(reject);
        });
    }
    get_network_object() {
        if (this.network == null)
            throw new Error(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
        return this.network;
    }
    get_network() {
        return new Promise((resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            resolve(this.network.type.toString());
        });
    }
    get_balance_internal() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.network == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            this.application
                .get_addresses_balance(this.network, yield this.get_addresses())
                .then(resolve)
                .catch(reject);
        }));
    }
    get_balance() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.network == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            try {
                let balance = yield this.application.get_addresses_balance(this.network, yield this.get_addresses());
                resolve(yield this.application.construct_Amount(balance, this.network, false));
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    get_addresses() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.network == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            let network = this.network;
            let ret = [];
            for (let i = 0; i < this.public_keys.length; i++)
                ret.push(yield network.get_address(this.public_keys[i].public_key));
            resolve(ret);
        }));
    }
    get_receive_address() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.network == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            if (this.public_keys.length == 0)
                yield this.internal_generate_public_key();
            let pks = this.public_keys;
            let pk = pks[pks.length - 1];
            let addr = yield this.network.get_address(pk.public_key);
            resolve(addr);
        }));
    }
    internal_generate_public_key() {
        return __awaiter(this, void 0, void 0, function* () {
            let index = this.public_keys.length;
            let pk;
            pk = this.generate_child_public_key(index);
            this.public_keys.push(yield pk);
            return this.state_saver.save_state();
        });
    }
    generate_address() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.internal_generate_public_key();
            return this.get_receive_address();
        });
    }
    serialize() {
        let o = {};
        return this.serialize_internal(o);
    }
    serialize_internal(o) {
        o.id = this.id;
        o.name = this.name;
        if (this.network == null)
            //Should normally never happen.
            o.network = null;
        else
            o.network = this.network.name;
        if (this.parent == null)
            o.parent = null;
        else
            o.parent = this.parent.id;
        o.private_key_name = this.private_key_name;
        o.recovery_phrase_name = this.recovery_phrase_name;
        o.global_root_node = this.global_root_node;
        o.local_root_node = this.local_root_node;
        o.subwallets = this.subwallets;
        o.public_keys = this.public_keys;
        o.deleted = this.deleted;
        return [this.id, JSON.stringify(o)];
    }
    get_history(page, page_size, criterion) {
        return this.application.get_wallet_history(this, page, page_size, criterion);
    }
    estimate_tx(dst_address, value, fee) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.network == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL);
                return;
            }
            let p = this.network.estimate_tx(this.application, yield this.get_addresses(), dst_address, new bignumber_js_1.BigNumber(value), fee, this.application, this.application);
            p.then(resolve).catch(reject);
        }));
    }
    delete() {
        return new Promise((resolve, reject) => {
            this.name = '';
            this.public_keys = [];
            this.deleted = true;
            this.application.save_state();
            resolve();
        });
    }
}
exports.Wallet = Wallet;
class TxEstimation {
}
exports.TxEstimation = TxEstimation;

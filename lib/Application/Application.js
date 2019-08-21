"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wallet_1 = require("./Wallet");
const CryptoNetworkList_1 = require("./CryptoNetworkList");
const BtcCryptoNetwork_1 = require("./BtcCryptoNetwork");
const EthCryptoNetwork_1 = require("./EthCryptoNetwork");
const DaiCryptoNetwork_1 = require("./DaiCryptoNetwork");
const RskCryptoNetwork_1 = require("./RskCryptoNetwork");
const ErrorCodes_1 = require("./ErrorCodes");
const Changelly_1 = require("./Changelly");
const Amount_1 = require("./Amount");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const TxParamGetter_1 = require("./TxParamGetter");
const mnemonic_1 = require("./mnemonic");
const RifCryptoNetwork_1 = require("./RifCryptoNetwork");
const MyLogger_1 = require("./MyLogger");
function clone_array(arr) {
    let ret = [];
    arr.forEach(x => ret.push(x));
    return ret;
}
function clone_array_if(arr, condition) {
    let ret = [];
    arr.forEach(x => {
        if (condition(x))
            ret.push(x);
    });
    return ret;
}
class CachedRatio {
    constructor(ratio, fetch_time) {
        this.ratio = ratio;
        this.fetch_time = fetch_time;
    }
}
class PortfolioElement {
    constructor(balance, change) {
        this.currency = '';
        this.balance = balance;
        this.change = change;
    }
}
exports.PortfolioElement = PortfolioElement;
class Portfolio {
    constructor() {
        this.total = new PortfolioElement(0, 0);
        this.currencies = [];
    }
}
exports.Portfolio = Portfolio;
class NetworkPathKey {
    constructor(network, node) {
        this.network = network;
        this.node = node;
    }
}
class RecoveredWallet {
    constructor(subwallet_index, used_addresses) {
        this.subwallet_index = subwallet_index;
        this.used_addresses = used_addresses;
    }
}
class RecoveredNetwork {
    constructor(network, wallets) {
        this.network = network;
        this.wallets = wallets;
    }
}
class RecoverWalletsParameter {
    constructor(data) {
        this.data = data;
    }
}
class Application {
    constructor(storage, external_js_interface) {
        this.networks = new CryptoNetworkList_1.CryptoNetworkList();
        this.wallets = [];
        this.next_wallet_id = 0;
        this.exchanges = [];
        this.display_currency = 'USD';
        this.main_phrase_name = null;
        this.state_string_name = 'mellowallet_state';
        this.history_page_size = 10;
        this.ratio_cache = new Map();
        this.cache_timeout = 5 * 60; //5 minutes
        this.fiat_currencies = ['USD', 'EUR', 'JPY', 'GBP'];
        this.storage = storage;
        this.external_js_interface = external_js_interface;
        mnemonic_1.set_generate_secure_random(this.external_js_interface.rand);
        this.networks.add(new BtcCryptoNetwork_1.BtcCryptoNetwork());
        this.networks.add(new EthCryptoNetwork_1.EthCryptoNetwork());
        this.networks.add(new DaiCryptoNetwork_1.DaiCryptoNetwork());
        this.networks.add(new RskCryptoNetwork_1.RskCryptoNetwork());
        this.networks.add(new RifCryptoNetwork_1.RifCryptoNetwork());
        this.networks.add(new BtcCryptoNetwork_1.BtcTestnetCryptonetwork());
        this.networks.add(new EthCryptoNetwork_1.EthRopstenCryptoNetwork());
        this.networks.add(new DaiCryptoNetwork_1.DaiRopstenCryptoNetwork());
        this.networks.add(new RskCryptoNetwork_1.RskTestnetCryptoNetwork());
        this.networks.add(new RifCryptoNetwork_1.RifTestnetCryptoNetwork());
        this.exchanges.push(new Changelly_1.Changelly(this));
        this.server_url = external_js_interface.getServerUrl();
        MyLogger_1.MyLogger.setLogger(external_js_interface.getLogger());
        MyLogger_1.MyLogger.debug('LIBRARY INITIALIZED!!!');
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            MyLogger_1.MyLogger.debug('Library initialized');
            if (!(yield this.load_wallets()))
                this.wallets = [];
        });
    }
    get_wallets() {
        return new Promise((resolve, reject) => resolve(clone_array_if(this.wallets, x => !x.deleted)));
    }
    get_wallet_by_id(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.wallets.length; i++) {
                if (this.wallets[i].deleted)
                    continue;
                if ((yield this.wallets[i].get_id()).toString() == id) {
                    resolve(this.wallets[i]);
                    return;
                }
            }
            reject(ErrorCodes_1.ErrorCode.ERROR_WALLET_NOT_FOUND);
        }));
    }
    create_wallet(name, network) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let net = this.networks.find(network);
            if (net == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_UNKNOWN_NETWORK);
                return;
            }
            let wallet = null;
            for (let i = 0; i < this.wallets.length; i++) {
                if (this.wallets[i].get_network_object().type != net.type)
                    continue;
                let root = this.wallets[i].get_root_wallet();
                wallet = yield Wallet_1.Wallet.derive_wallet(root, this.next_wallet_id++, name);
                break;
            }
            if (wallet == null) {
                wallet = yield Wallet_1.Wallet.create_wallet(this, this.next_wallet_id++, name, this.main_phrase_name, net, this.storage, this);
                if (!this.main_phrase_name)
                    this.main_phrase_name = wallet.get_recovery_phrase_name();
            }
            this.wallets.push(wallet);
            yield this.save_state();
            resolve(wallet);
        }));
    }
    wallet_from_phrase(phrase, network, set_global_phrase) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let networks = yield this.networks.get_list();
                let nodes = [];
                for (let i = 0; i < networks.length; i++) {
                    let network = networks[i];
                    let master = yield network.generate_master_from_recovery_phrase(phrase);
                    let global_root_node = yield network.generate_root_node_from_master(master);
                    nodes.push(new NetworkPathKey(network.name, global_root_node));
                }
                let response = yield this.server_post_request('/recoverWallet', JSON.stringify(new RecoverWalletsParameter(nodes)));
                let recovered_networks = JSON.parse(response);
                for (let i = 0; i < recovered_networks.length; i++) {
                    let rn = recovered_networks[i];
                    let network = this.networks.find(rn.network);
                    if (network == null || rn.wallets.length == 0)
                        continue;
                    let subwallets = rn.wallets.sort((x, y) => x.subwallet_index - y.subwallet_index);
                    let create_main = subwallets[0].subwallet_index != 0;
                    let root_wallet = null;
                    if (create_main) {
                        let mfn = set_global_phrase ? this.main_phrase_name : null;
                        root_wallet = yield Wallet_1.Wallet.restore_root_wallet(this, this.next_wallet_id++, phrase, mfn, '', network, this.storage, this, []);
                        this.wallets.push(root_wallet);
                        if (set_global_phrase && !this.main_phrase_name)
                            this.main_phrase_name = root_wallet.get_recovery_phrase_name();
                    }
                    for (let j = 0; j < rn.wallets.length; j++) {
                        let new_wallet = null;
                        if (root_wallet == null) {
                            let mfn = set_global_phrase
                                ? this.main_phrase_name
                                : null;
                            new_wallet = root_wallet = yield Wallet_1.Wallet.restore_root_wallet(this, this.next_wallet_id++, phrase, mfn, '', network, this.storage, this, subwallets[j].used_addresses);
                            if (set_global_phrase && !this.main_phrase_name)
                                this.main_phrase_name = root_wallet.get_recovery_phrase_name();
                        }
                        else
                            new_wallet = yield Wallet_1.Wallet.restore_derived_wallet(this, this.next_wallet_id++, root_wallet, subwallets[j].subwallet_index, '', subwallets[j].used_addresses);
                        this.wallets.push(new_wallet);
                    }
                }
                if (set_global_phrase && !this.main_phrase_name) {
                    MyLogger_1.MyLogger.warn('Could not recover any wallets. Saving recovery phrase.');
                    this.main_phrase_name = 'main_phrase_name';
                    yield this.storage.secure_set(this.main_phrase_name, phrase);
                }
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    save_state() {
        let state = {};
        state.next_wallet_id = this.next_wallet_id;
        let wallets = {};
        for (let i = 0; i < this.wallets.length; i++) {
            let kv = this.wallets[i].serialize();
            wallets[kv[0]] = kv[1];
        }
        state.wallets = wallets;
        state.main_phrase_name = this.main_phrase_name;
        let stringified = JSON.stringify(state);
        return this.storage.set(this.state_string_name, stringified);
    }
    load_wallets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let value = yield this.storage.get(this.state_string_name);
                if (value == null)
                    return false;
                MyLogger_1.MyLogger.debug('Loaded state: ' + value);
                let state = JSON.parse(value);
                this.next_wallet_id = state.next_wallet_id;
                this.main_phrase_name = state.main_phrase_name;
                let wallets = state.wallets;
                let loaded_wallets = {};
                let get_network = (name) => {
                    return this.networks.find(name);
                };
                let loader = (id) => __awaiter(this, void 0, void 0, function* () {
                    if (loaded_wallets[id])
                        return loaded_wallets[id];
                    let pushee = yield Wallet_1.Wallet.load_wallet(this, wallets[id], loader, get_network, this.storage, this);
                    loaded_wallets[id] = pushee;
                    this.wallets.push(pushee);
                    return pushee;
                });
                for (const key in wallets)
                    yield loader(key);
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    get_networks() {
        return this.networks.get_list();
    }
    get_network(id) {
        return new Promise((resolve, reject) => {
            let ret = this.networks.find(id);
            if (ret == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_UNKNOWN_NETWORK);
                return;
            }
            resolve(ret);
        });
    }
    get_exchanges() {
        return new Promise((resolve, reject) => {
            let ret = [];
            this.exchanges.forEach(w => ret.push(w));
            resolve(ret);
        });
    }
    get_history(page, page_size, criterion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let skip = page * this.history_page_size;
                let take = this.history_page_size;
                let coins = new Map();
                for (let i = 0; i < this.wallets.length; i++) {
                    let wallet = this.wallets[i];
                    let addrs = yield wallet.get_addresses();
                    let net = wallet.get_network_object().name;
                    let found = coins.get(net);
                    let list = [];
                    if (found == undefined)
                        coins.set(net, list);
                    else
                        list = found;
                    addrs.forEach(x => list.push(x));
                }
                let request_object = {};
                request_object.skip = skip;
                request_object.take = take;
                request_object.data = [];
                coins.forEach((v, k) => {
                    request_object.data.push({
                        coin: k,
                        addrs: v
                    });
                });
                let response = yield this.server_post_request('/getGlobalTransactionHistory', JSON.stringify(request_object));
                let parsed = JSON.parse(response);
                let promises = [];
                for (let i = 0; i < parsed.length; i++) {
                    let generic = parsed[i];
                    let net = this.networks.find(generic.coin);
                    if (!net)
                        continue;
                    promises.push(net.to_TransactionRecord(this, parsed[i]));
                }
                let ret = yield Promise.all(promises);
                resolve(ret);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    get_wallet_history(wallet, page, page_size, criterion) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                var addresses = (yield wallet.get_addresses()).join(',');
                let skip = page * this.history_page_size;
                let take = this.history_page_size;
                let net = wallet.get_network_object();
                let url = '/getTransactionHistory?' +
                    'sort=desc' +
                    '&addresses=' +
                    addresses +
                    '&' +
                    'coin=' +
                    net.name +
                    '&' +
                    'skip=' +
                    skip +
                    '&' +
                    'take=' +
                    take;
                let response = yield this.server_get_request(url);
                let parsed = JSON.parse(response);
                let promises = [];
                for (let i = 0; i < parsed.length; i++) {
                    promises.push(net.to_TransactionRecord(this, parsed[i]));
                }
                let ret = yield Promise.all(promises);
                resolve(ret);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    get_currency_ratio(from, to) {
        let ratio_name = from + ',' + to;
        let cached = this.ratio_cache.get(ratio_name);
        if (cached != undefined) {
            let now = Date.now() / 1000;
            let ratio = cached.ratio;
            if (now - cached.fetch_time < this.cache_timeout)
                return new Promise((resolve, reject) => resolve(ratio));
        }
        return this.server_get_request('/getCurrencyPrice?fromCoin=' + from + '&toCoin=' + to).then(x => {
            let now = Date.now() / 1000;
            let ratio = parseFloat(x);
            this.ratio_cache.set(ratio_name, new CachedRatio(ratio, now));
            return ratio;
        });
    }
    currency_conversion_internal(amount, src_network, dst_network) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let dst_decimal = 0;
            let inverted = false;
            let src = this.networks.find(src_network);
            if (src == null) {
                inverted = true;
                src = this.networks.find(dst_network);
                if (src == null) {
                    reject(ErrorCodes_1.ErrorCode.ERROR_UNKNOWN_NETWORK);
                    return;
                }
            }
            let dst = this.networks.find(!inverted ? dst_network : src_network);
            if (dst == null) {
                if (this.fiat_currencies.indexOf(!inverted ? dst_network : src_network) < 0) {
                    reject(ErrorCodes_1.ErrorCode.ERROR_UNKNOWN_NETWORK);
                    return;
                }
                dst_decimal = 4;
            }
            if (src && dst) {
                try {
                    amount = yield this.currency_conversion_internal(amount, src_network, 'USD');
                }
                catch (e) {
                    reject(e);
                    return;
                }
                this.currency_conversion_internal(amount, 'USD', dst_network)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            let ratio = 0;
            try {
                let p = !inverted
                    ? this.get_currency_ratio(src_network, dst_network)
                    : this.get_currency_ratio(dst_network, src_network);
                ratio = (yield p) * Math.pow(10, -dst_decimal);
            }
            catch (e) {
                reject(e);
                return;
            }
            if (inverted)
                ratio = 1.0 / ratio;
            MyLogger_1.MyLogger.debug(src_network + ' -> ' + dst_network + ' = ' + ratio);
            let result = amount.multipliedBy(ratio);
            let destination_crypto = this.networks.find(dst_network);
            if (destination_crypto)
                result = new bignumber_js_1.default(result.multipliedBy(destination_crypto.unit_to_atom).toFixed(0)).dividedBy(destination_crypto.unit_to_atom);
            resolve(result);
        }));
    }
    currency_conversion(amount, src_network, dst_network) {
        return this.currency_conversion_internal(new bignumber_js_1.default(amount), src_network, dst_network).then(x => x.toString());
    }
    is_address_valid(address, network) {
        return new Promise((resolve, reject) => {
            let net = this.networks.find(network);
            if (net == null) {
                reject(ErrorCodes_1.ErrorCode.ERROR_UNKNOWN_NETWORK);
                return;
            }
            resolve(net.is_address_valid(address));
        });
    }
    set_display_currency(symbol) {
        return new Promise((resolve, reject) => {
            symbol = symbol.toUpperCase();
            let found = false;
            this.fiat_currencies.forEach(x => (found = found || x === symbol));
            if (found) {
                this.display_currency = symbol;
                resolve();
            }
            else
                reject(ErrorCodes_1.ErrorCode.ERROR_UNSUPPORTED_CURRENCY);
        });
    }
    get_display_currency() {
        return new Promise((resolve, reject) => {
            resolve(this.display_currency);
        });
    }
    get_fiat_currencies() {
        return new Promise((resolve, reject) => {
            resolve(clone_array(this.fiat_currencies));
        });
    }
    get_http(url) {
        MyLogger_1.MyLogger.debug('sending request to: ' + url);
        return this.external_js_interface.get(url).then((x) => __awaiter(this, void 0, void 0, function* () {
            let ret = yield x.text();
            MyLogger_1.MyLogger.debug('Result for ' + url + ': ', ret);
            return ret;
        }));
    }
    server_get_request(path) {
        return this.get_http(this.server_url + path);
    }
    put_http(url, body) {
        MyLogger_1.MyLogger.debug('sending PUT request to: ' + url);
        return this.external_js_interface.put(url, body).then(x => x.text());
    }
    server_put_request(path, body) {
        return this.put_http(this.server_url + path, body);
    }
    post_http(url, body) {
        MyLogger_1.MyLogger.debug('sending POST request to: ' + url);
        MyLogger_1.MyLogger.debug('POST body: ' + body);
        return this.external_js_interface.post(url, body).then(x => x.text());
    }
    server_post_request(path, body) {
        return this.post_http(this.server_url + path, body);
    }
    get_portfolio() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let changes_p = this.get_price_variation();
                let balances = new Map();
                let total_balance = 0;
                for (let i = 0; i < this.wallets.length; i++) {
                    let wallet = this.wallets[i];
                    let network = wallet.get_network_object();
                    let old_balance = balances.get(network.name);
                    let balance = parseFloat((yield wallet.get_balance()).fiat_value);
                    total_balance += balance;
                    let new_balance = old_balance == undefined ? balance : old_balance + balance;
                    balances.set(network.name, new_balance);
                }
                let changes = yield changes_p;
                let ret = new Portfolio();
                let total_change = 0;
                changes.forEach((change, net) => {
                    let balance = balances.get(net);
                    if (!balance)
                        return;
                    let element = new PortfolioElement(balance, balance != 0 ? change * 100 : 0);
                    element.currency = net;
                    ret.currencies.push(element);
                    if (total_balance != 0)
                        total_change += (balance / total_balance) * change;
                });
                ret.total.balance = total_balance;
                ret.total.change = total_change * 100;
                ret.total.currency = 'total';
                MyLogger_1.MyLogger.debug('get_portfolio() = ' + JSON.stringify(ret));
                resolve(ret);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    //TxParamGetter
    get_transaction_parameters(network, addresses) {
        if (addresses.length == 0)
            return new Promise((resolve, reject) => resolve(TxParamGetter_1.TransactionParameters.construct_empty()));
        return this.server_get_request('/getTransactionParams?addresses=' + addresses.join(',') + '&coin=' + network.name).then(x => TxParamGetter_1.TransactionParameters.from_json(network, x));
    }
    get_private_key(network, address) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.wallets.length; i++) {
                let wallet = this.wallets[i];
                if (wallet.get_network_object().type != network.type)
                    continue;
                let addresses = yield wallet.get_addresses();
                for (let j = 0; j < addresses.length; j++) {
                    let address2 = addresses[j];
                    if (address2 != address)
                        continue;
                    wallet
                        .get_private_key(j)
                        .then(resolve)
                        .catch(reject);
                    return;
                }
            }
            reject(ErrorCodes_1.ErrorCode.ERROR_PRIVATE_KEY_NOT_FOUND);
        }));
    }
    get_addresses_balance(network, addresses) {
        if (addresses.length == 0)
            return new Promise((resolve, reject) => resolve(new bignumber_js_1.default(0)));
        let divisor = new bignumber_js_1.default(network.base).pow(network.decimal_places);
        return this.server_get_request('/getBalance?addresses=' + addresses.join(',') + '&coin=' + network.name)
            .then(x => new bignumber_js_1.default(x).dividedBy(divisor))
            .catch(x => new bignumber_js_1.default(NaN));
    }
    get_addresses_balances(network, addresses) {
        if (addresses.length == 0)
            return new Promise((resolve, reject) => resolve([]));
        let url = '/getBalances?addresses=' + addresses.join(',') + '&coin=' + network.name;
        return this.server_get_request(url).then(response => {
            let map = new Map();
            let array = JSON.parse(response);
            for (let i = 0; i < array.length; i++)
                map.set(array[i].addr, array[i].quantity);
            let ret = [];
            for (let i = 0; i < addresses.length; i++) {
                let val = map.get(addresses[i]);
                ret.push(val == undefined ? new bignumber_js_1.default(0) : new bignumber_js_1.default(val));
            }
            return ret;
        });
    }
    get_address_balance(network, address) {
        return this.get_addresses_balance(network, [address]);
    }
    estimate_gas_limit(network, from, to, value) {
        let url = '/getTransferGas?coin=' +
            network.name +
            '&from=' +
            from +
            '&to=' +
            to +
            '&quantity=' +
            value.toString();
        return this.server_get_request(url).then(x => new bignumber_js_1.default(x));
    }
    resolve_name_from_addr(network, name) {
        let url = '/resolveName?name=' + name + '&coin=' + network.name;
        return this.server_get_request(url);
    }
    //AmountConstructor
    construct_Amount(value, network, rounding) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let ret = new Amount_1.Amount();
                if (rounding) {
                    let fiat_unit = parseFloat(yield this.currency_conversion('1', network.type.toString(), 'USD'));
                    let fiat_digits = Math.floor(Math.log10(fiat_unit) + 1) + 2;
                    if (fiat_digits > 0) {
                        let power = new bignumber_js_1.default(10).pow(fiat_digits);
                        value = value
                            .multipliedBy(power)
                            .integerValue()
                            .dividedBy(power);
                    }
                }
                ret.fiat_value = yield this.currency_conversion(value.toString(), network.type.toString(), this.display_currency);
                ret.value = value.toString();
                ret.unit = network.symbol;
                ret.fiat_unit = this.display_currency;
                resolve(ret);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    //TransactionRelay
    relay_transaction(network, raw_transaction, txid) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.server_post_request('/sendRawTransaction?coin=' + network.name, JSON.stringify({ tx: raw_transaction.toString('hex') }));
                MyLogger_1.MyLogger.debug('relay_transaction result: ' + response);
                let parsed = JSON.parse(response);
                if (parsed.error) {
                    reject({ error_code: 500, error_message: parsed.message });
                    return;
                }
                resolve(parsed.tx);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    get_wallet_from_address(network, address) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let equals = network.get_comparer(address);
            for (let i = 0; i < this.wallets.length; i++) {
                let wallet = this.wallets[i];
                if (wallet.get_network_object().type != network.type)
                    continue;
                let addresses = yield wallet.get_addresses();
                for (let j = 0; j < addresses.length; j++) {
                    let address2 = addresses[j];
                    if (!equals(address2))
                        continue;
                    resolve(wallet);
                    return;
                }
            }
            resolve(null);
        }));
    }
    get_price_variation() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let ret = new Map();
                let response = yield this.server_get_request('/getPriceVariation');
                let data = JSON.parse(response);
                for (let key in data)
                    ret.set(key, parseFloat(data[key]) / 100);
                resolve(ret);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
}
exports.Application = Application;

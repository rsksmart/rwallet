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
const CryptoNetwork_1 = require("./CryptoNetwork");
const CryptoNetworkType_1 = require("./CryptoNetworkType");
const bignumber_js_1 = require("bignumber.js");
const bip32_1 = require("bip32");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const mnemonic_1 = require("./mnemonic");
const bip39_1 = require("bip39");
const PathKeyPair_1 = require("./PathKeyPair");
const ErrorCodes_1 = require("./ErrorCodes");
const Amount_1 = require("./Amount");
const TxEstimation_1 = require("./TxEstimation");
const SendTxResult_1 = require("./SendTxResult");
const History_1 = require("./History");
function value_to_promise(s) {
    return new Promise((resolve, reject) => {
        resolve(s);
    });
}
class ReorderedUtxo {
    constructor(value, address, utxo) {
        this.value = value;
        this.address = address;
        this.utxo = utxo;
    }
}
class BitcoinTxEstimation extends TxEstimation_1.AbstractTxEstimation {
    constructor(amount, fee, total, net, tx, relay) {
        super(amount, fee, total);
        this.net = net;
        this.tx = tx;
        this.relay = relay;
    }
    confirm() {
        let txid = this.tx.getId();
        let serialized = this.tx.toBuffer();
        return this.relay
            .relay_transaction(this.net, serialized, txid)
            .then(x => new SendTxResult_1.SendTxResult(true, x));
    }
}
class WalletValue {
    constructor(is_true_wallet, wallet, value) {
        this.is_true_wallet = is_true_wallet;
        this.wallet = wallet;
        this.value = value;
    }
}
class WalletValuePair {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}
function find_max(data, comp) {
    if (data.length == 0)
        return -1;
    let max = 0;
    for (let i = 1; i < data.length; i++)
        if (comp(data[i], data[max]) > 0)
            max = i;
    return max;
}
class ExternalBtcWallet {
    constructor(network, address) {
        this.network = network;
        this.address = address;
    }
    get_id() {
        return new Promise((resolve, reject) => resolve(-1));
    }
    get_name() {
        return new Promise((resolve, reject) => resolve(''));
    }
    set_name(value) {
        return new Promise((resolve, reject) => {
        });
    }
    get_network() {
        return new Promise((resolve, reject) => resolve(this.network.name));
    }
    get_phrase() {
        return new Promise((resolve, reject) => resolve(''));
    }
    get_balance() {
        return new Promise((resolve, reject) => resolve(new Amount_1.Amount()));
    }
    get_addresses() {
        return new Promise((resolve, reject) => resolve([this.address]));
    }
    generate_address() {
        return this.get_receive_address();
    }
    get_receive_address() {
        return new Promise((resolve, reject) => resolve(this.address));
    }
    estimate_tx(dst_address, value, fee) {
        return new Promise((resolve, reject) => reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL));
    }
    get_history(page, page_size, criterion) {
        return new Promise((resolve, reject) => reject(ErrorCodes_1.ErrorCode.ERROR_INTERNAL));
    }
}
class BaseBtcCryptoNetwork extends CryptoNetwork_1.CryptoNetwork {
    constructor(name, display_name, symbol, type, is_testnet, image) {
        super(name, display_name, symbol, type, 8, is_testnet, 'mellowallet/assets/coins/btc.png');
        this.max_safe = new bignumber_js_1.BigNumber('4503599627370496');
        this.unit_to_atom = new bignumber_js_1.BigNumber(10).pow(this.decimal_places);
    }
    generate_recovery_phrase() {
        return mnemonic_1.generate_mnemonic();
    }
    generate_master_from_recovery_phrase(phrase) {
        return value_to_promise(bip32_1.fromSeed(bip39_1.mnemonicToSeed(phrase), this.get_network()).toBase58());
    }
    generate_root_node_from_master(master) {
        let path = "m/44'/" + this.get_network_id() + "'/0'";
        let pk = bip32_1.fromBase58(master, this.get_network())
            .derivePath(path)
            .neutered()
            .toBase58();
        return value_to_promise(new PathKeyPair_1.PathKeyPair(path, pk));
    }
    derive_child_from_node(node, index) {
        let t = bip32_1.fromBase58(node, this.get_network()).derive(index);
        return value_to_promise(t.toBase58());
    }
    derive_path_from_node(node, path) {
        return value_to_promise(bip32_1.fromBase58(node, this.get_network())
            .derivePath(path)
            .toBase58());
    }
    get_address(node) {
        let options = {
            pubkey: bip32_1.fromBase58(node, this.get_network()).publicKey,
            network: this.get_network()
        };
        return value_to_promise(bitcoinjs_lib_1.payments.p2pkh(options).address);
    }
    to_number(n) {
        if (n.abs().comparedTo(this.max_safe) >= 0)
            throw new Error(ErrorCodes_1.ErrorCode.ERROR_OVERFLOW);
        return n.toNumber();
    }
    build_transaction(fee, getter, params, addresses, dst_address, value) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let my_network = this.get_network();
            let tb = new bitcoinjs_lib_1.TransactionBuilder(my_network);
            let utxos = params.get_utxo();
            let reordered = [];
            for (let i = 0; i < utxos.length; i++)
                for (let j = 0; j < utxos[i].utxos.length; j++)
                    reordered.push(new ReorderedUtxo(utxos[i].utxos[j].value, utxos[i].address, utxos[i].utxos[j]));
            reordered = reordered.sort((a, b) => -a.value.comparedTo(b.value));
            let value_plus_fee = value.plus(fee);
            let addressesUsed = new Map();
            let private_keys = new Map();
            for (let i = 0; i < reordered.length && value_plus_fee.isPositive(); i++) {
                let addr = reordered[i].address;
                let indexList = addressesUsed.get(addr);
                if (indexList == undefined) {
                    indexList = [i];
                    addressesUsed.set(addr, indexList);
                    let pk_string;
                    try {
                        pk_string = yield getter.get_private_key(this, addr);
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                    private_keys.set(addr, bitcoinjs_lib_1.ECPair.fromPrivateKey(bip32_1.fromBase58(pk_string, my_network).privateKey, {
                        network: my_network
                    }));
                }
                else
                    indexList.push(i);
                tb.addInput(reordered[i].utxo.tx_id, reordered[i].utxo.txo_index);
                value_plus_fee = value_plus_fee.minus(reordered[i].value);
            }
            try {
                if (value_plus_fee.isNegative())
                    tb.addOutput(addresses[0], this.to_number(value_plus_fee.negated()));
                tb.addOutput(dst_address, this.to_number(value));
            }
            catch (e) {
                reject(e);
                return;
            }
            addressesUsed.forEach((v, k) => {
                let pk = private_keys.get(k);
                if (pk == undefined)
                    //Will never happen. This check is just to satisfy the type checker.
                    return;
                for (let i = 0; i < v.length; i++)
                    tb.sign(v[i], pk);
            });
            resolve(tb.build());
        }));
    }
    estimate_tx(getter, addresses, dst_address, value, fee_weight, ac, relay) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                value = new bignumber_js_1.BigNumber(value.multipliedBy(this.unit_to_atom).toFixed(0));
                let params = yield getter.get_transaction_parameters(this, addresses);
                let fee = new bignumber_js_1.BigNumber(0);
                let tx = yield this.build_transaction(fee, getter, params, addresses, dst_address, value);
                fee = params.get_fee(tx.byteLength(), fee_weight);
                tx = yield this.build_transaction(fee, getter, params, addresses, dst_address, value);
                resolve(new BitcoinTxEstimation(yield ac.construct_Amount(value.dividedBy(this.unit_to_atom), this, true), yield ac.construct_Amount(fee.dividedBy(this.unit_to_atom), this, false), yield ac.construct_Amount(value.plus(fee).dividedBy(this.unit_to_atom), this, true), this, tx, relay));
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    get_tx_explorer_url(txid) {
        if (txid.toLowerCase().startsWith('0x'))
            txid = txid.substr(2);
        return ((!this.is_testnet
            ? 'https://www.blockchain.com/btc/tx/'
            : 'https://testnet.blockexplorer.com/tx/') + txid);
    }
    is_address_valid(addr) {
        try {
            bitcoinjs_lib_1.address.fromBase58Check(addr);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    get_wallets_values(app, list) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let ret = [];
            for (let i = 0; i < list.length; i++) {
                let wallet = yield app.get_wallet_from_address(this, list[i].address);
                let n = new bignumber_js_1.BigNumber(list[i].value);
                if (wallet == null) {
                    ret.push(new WalletValue(false, new ExternalBtcWallet(this, list[i].address), n));
                    continue;
                }
                ret.push(new WalletValue(true, wallet, n));
            }
            resolve(ret);
        }));
    }
    get_value(app, tx) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let ins = yield this.get_wallets_values(app, tx.input);
            let outs = yield this.get_wallets_values(app, tx.output);
            let compare = (x, y) => -x.value.comparedTo(y.value);
            let filtered_ins = ins.filter(x => x.is_true_wallet);
            let filtered_outs = outs.filter(x => x.is_true_wallet);
            let max_in = find_max(filtered_ins, compare);
            let max_out = find_max(filtered_outs, compare);
            let value = new bignumber_js_1.BigNumber(0);
            if (max_in >= 0) {
                filtered_ins.forEach(x => {
                    value = value.plus(x.value);
                });
                let negated_outs = outs.filter(x => !x.is_true_wallet);
                filtered_outs.forEach(x => {
                    value = value.minus(x.value);
                });
                max_out = find_max(negated_outs, compare);
                let out_wallet = null;
                if (max_out >= 0)
                    out_wallet = negated_outs[max_out].wallet;
                else
                    out_wallet = new ExternalBtcWallet(this, '???');
                resolve(new WalletValuePair(new WalletValue(true, ins[max_in].wallet, value.negated()), new WalletValue(false, out_wallet, value)));
                return;
            }
            if (max_out >= 0) {
                filtered_outs.forEach(x => {
                    value = value.plus(x.value);
                });
                let negated_ins = ins.filter(x => !x.is_true_wallet);
                max_in = find_max(negated_ins, compare);
                let in_wallet = null;
                if (max_in >= 0)
                    in_wallet = negated_ins[max_in].wallet;
                else
                    in_wallet = new ExternalBtcWallet(this, '???');
                resolve(new WalletValuePair(new WalletValue(false, in_wallet, value.negated()), new WalletValue(true, outs[max_out].wallet, value)));
                return;
            }
            resolve(null);
        }));
    }
    to_TransactionRecord(app, data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let tx = data;
            let wvp = yield this.get_value(app, tx);
            if (wvp == null) {
                resolve(new History_1.TransactionRecord(History_1.TransactionType.Transfer, yield app.construct_Amount(new bignumber_js_1.BigNumber(0), this, false), yield app.construct_Amount(new bignumber_js_1.BigNumber(0), this, false), new ExternalBtcWallet(this, '???'), new ExternalBtcWallet(this, '???'), parseInt(tx.timestamp), tx.txId));
                return;
            }
            if (!wvp.from.is_true_wallet) {
                //Transaction is an IN transfer.
                resolve(new History_1.TransactionRecord(History_1.TransactionType.Transfer, yield app.construct_Amount(wvp.to.value.dividedBy(this.unit_to_atom), this, false), null, wvp.from.wallet, wvp.to.wallet, parseInt(tx.timestamp), tx.txId));
                return;
            }
            //Transaction is an OUT transfer.
            resolve(new History_1.TransactionRecord(History_1.TransactionType.Transfer, null, yield app.construct_Amount(wvp.to.value.dividedBy(this.unit_to_atom), this, false), wvp.from.wallet, wvp.to.wallet, parseInt(tx.timestamp), tx.txId));
        }));
    }
    get_comparer(a) {
        return b => a == b;
    }
}
class BtcCryptoNetwork extends BaseBtcCryptoNetwork {
    constructor() {
        super('BTC', 'Bitcoin', 'BTC', CryptoNetworkType_1.CryptoNetworkType.BTC, false, 'mellowallet/assets/coins/btc.png');
    }
    get_network() {
        return bitcoinjs_lib_1.networks.bitcoin;
    }
    get_network_id() {
        return 0;
    }
}
exports.BtcCryptoNetwork = BtcCryptoNetwork;
class BtcTestnetCryptonetwork extends BaseBtcCryptoNetwork {
    constructor() {
        super('BTC-Testnet', 'Bitcoin Testnet', 'BTCTESTNET', CryptoNetworkType_1.CryptoNetworkType.BTCTestnet, true, 'mellowallet/assets/coins/btc.png');
    }
    get_network() {
        return bitcoinjs_lib_1.networks.testnet;
    }
    get_network_id() {
        return 1;
    }
}
exports.BtcTestnetCryptonetwork = BtcTestnetCryptonetwork;

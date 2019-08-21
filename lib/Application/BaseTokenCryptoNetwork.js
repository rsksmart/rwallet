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
const bignumber_js_1 = require("bignumber.js");
const Amount_1 = require("./Amount");
const TxEstimation_1 = require("./TxEstimation");
const ErrorCodes_1 = require("./ErrorCodes");
const web3_eth_abi_1 = require("web3-eth-abi");
const History_1 = require("./History");
const MyLogger_1 = require("./MyLogger");
let erc20Abi = JSON.parse('[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]');
class TokenTxEstimation extends TxEstimation_1.AbstractTxEstimation {
    constructor(parent, amount) {
        super(amount, parent.fees, parent.total);
        this.parent = parent;
    }
    confirm() {
        return this.parent.confirm();
    }
}
exports.TokenTxEstimation = TokenTxEstimation;
class ExternalTokenWallet {
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
class BaseTokenCryptoNetwork extends CryptoNetwork_1.CryptoNetwork {
    constructor(parent, name, display_name, symbol, type, decimals, is_testnet, image) {
        super(name, display_name, symbol, type, decimals, is_testnet, image);
        this.unit_to_atom = new bignumber_js_1.BigNumber(10).pow(this.decimal_places);
        this.parent = parent;
    }
    generate_recovery_phrase() {
        return this.parent.generate_recovery_phrase();
    }
    generate_master_from_recovery_phrase(phrase) {
        return this.parent.generate_master_from_recovery_phrase(phrase);
    }
    get_network_id() {
        return 1;
    }
    generate_root_node_from_master(s) {
        return this.parent.generate_root_node_from_master(s);
    }
    derive_child_from_node(s, index) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.parent.derive_child_from_node(s, index);
        });
    }
    derive_path_from_node(s, path) {
        return this.parent.derive_path_from_node(s, path);
    }
    get_address(s) {
        return this.parent.get_address(s);
    }
    get_tx_explorer_url(txid) {
        return this.parent.get_tx_explorer_url(txid);
    }
    is_address_valid(addr) {
        return this.parent.is_address_valid(addr);
    }
    number_to_buffer(n) {
        return new Buffer(n.toString(16), 'hex');
    }
    estimate_tx(getter, addresses, dst_address, value, fee_weight, ac, relay) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let input = new Buffer('', 'hex');
            let minimum_balance = value;
            value = new bignumber_js_1.BigNumber(value).multipliedBy(this.unit_to_atom);
            let selected_address = -1;
            let first_address = 0;
            let selected_addresses = [];
            let gas_limits = new Map();
            let contract_address = this.get_contract_address();
            for (let i = 0; i < addresses.length; i++) {
                let address = addresses[i];
                let balance = yield getter.get_address_balance(this, address);
                if (balance.comparedTo(minimum_balance) < 0)
                    continue;
                selected_addresses.push(address);
                try {
                    let gas_limit = yield getter.estimate_gas_limit(this, address, this.normalize_addr(dst_address), value);
                    gas_limits.set(address, gas_limit);
                }
                catch (e) {
                    reject(e);
                    return;
                }
            }
            if (selected_addresses.length == 0) {
                reject(ErrorCodes_1.ErrorCode.ERROR_INSUFFICIENT_FUNDS);
                return;
            }
            let abi = null;
            for (let i = 0; i < erc20Abi.length; i++) {
                if (erc20Abi[i].name == 'transfer') {
                    abi = erc20Abi[i];
                    break;
                }
            }
            if (abi == null) {
                reject('ABI not found');
                return;
            }
            let encoded = new web3_eth_abi_1.AbiCoder().encodeFunctionCall(abi, [
                this.normalize_addr(dst_address),
                '0x' + value.toString(16)
            ]);
            MyLogger_1.MyLogger.debug(encoded);
            input = new Buffer(encoded.substr(2), 'hex');
            this.parent
                .estimate_tx_with_input(getter, selected_addresses, contract_address, new bignumber_js_1.BigNumber(0), fee_weight, ac, relay, input, gas_limits, this)
                .then((netEstimate) => __awaiter(this, void 0, void 0, function* () {
                resolve(new TokenTxEstimation(netEstimate, yield ac.construct_Amount(value.dividedBy(this.unit_to_atom), this, true)));
            }))
                .catch(reject);
        }));
    }
    to_TransactionRecord(app, data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let tx = data;
            let from = yield app.get_wallet_from_address(this, tx.input);
            let to = yield app.get_wallet_from_address(this, tx.output);
            let value = new bignumber_js_1.BigNumber(tx.value).dividedBy(this.unit_to_atom);
            if (from != null) {
                //Transaction is an OUT transfer.
                resolve(new History_1.TransactionRecord(History_1.TransactionType.Transfer, null, yield app.construct_Amount(value, this, false), from, new ExternalTokenWallet(this, tx.output), parseInt(tx.timestamp), tx.txId));
                return;
            }
            if (to == null) {
                //What?
                resolve(new History_1.TransactionRecord(History_1.TransactionType.Transfer, yield app.construct_Amount(new bignumber_js_1.BigNumber(0), this, false), yield app.construct_Amount(new bignumber_js_1.BigNumber(0), this, false), new ExternalTokenWallet(this, '???'), new ExternalTokenWallet(this, '???'), parseInt(tx.timestamp), tx.txId));
                return;
            }
            //Transaction is an OUT transfer.
            resolve(new History_1.TransactionRecord(History_1.TransactionType.Transfer, yield app.construct_Amount(value, this, false), null, new ExternalTokenWallet(this, tx.input), to, parseInt(tx.timestamp), tx.txId));
        }));
    }
    get_comparer(a) {
        let s = a.toLowerCase();
        return b => s == b.toLowerCase();
    }
}
exports.BaseTokenCryptoNetwork = BaseTokenCryptoNetwork;

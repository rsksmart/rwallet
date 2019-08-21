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
const CryptoNetwork_1 = require("./CryptoNetwork");
const CryptoNetworkType_1 = require("./CryptoNetworkType");
const HDNode = require("hdkey");
const crypto_1 = require("crypto");
const mnemonic_1 = require("./mnemonic");
const bignumber_js_1 = require("bignumber.js");
const bip39_1 = require("bip39");
const PathKeyPair_1 = require("./PathKeyPair");
const ethereumjs_util_1 = require("ethereumjs-util");
const ethereumjs_tx_1 = __importDefault(require("ethereumjs-tx"));
const Amount_1 = require("./Amount");
const TxEstimation_1 = require("./TxEstimation");
const ErrorCodes_1 = require("./ErrorCodes");
const SendTxResult_1 = require("./SendTxResult");
const History_1 = require("./History");
const MyLogger_1 = require("./MyLogger");
function value_to_promise(s) {
    return new Promise((resolve, reject) => {
        resolve(s);
    });
}
exports.value_to_promise = value_to_promise;
function deserializePrivate(s) {
    let master = JSON.parse(s);
    let ret = new HDNode();
    ret.chainCode = new Buffer(master.cc, 'hex');
    ret.privateKey = new Buffer(master.prk, 'hex');
    return ret;
}
exports.deserializePrivate = deserializePrivate;
function deserializePublic(s) {
    let master = JSON.parse(s);
    if (master.prk)
        return null;
    let ret = new HDNode();
    ret.chainCode = new Buffer(master.cc, 'hex');
    ret.publicKey = new Buffer(master.puk, 'hex');
    return ret;
}
function serializePrivate(node) {
    let ret = {
        prk: node.privateKey.toString('hex'),
        cc: node.chainCode.toString('hex')
    };
    return JSON.stringify(ret);
}
function serializePublic(node) {
    let ret = {
        puk: node.publicKey.toString('hex'),
        cc: node.chainCode.toString('hex')
    };
    return JSON.stringify(ret);
}
exports.serializePublic = serializePublic;
var MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8');
function fromMasterSeed(seed_buffer) {
    //let t = HmacSHA512(lib.WordArray.create(seed_buffer), 'Bitcoin seed').toString();
    //let I = new Buffer(t, 'hex');
    let I = crypto_1.createHmac('sha512', MASTER_SECRET)
        .update(seed_buffer)
        .digest();
    let IL = I.slice(0, 32);
    let IR = I.slice(32);
    let ret = new HDNode();
    ret.chainCode = IR;
    ret.privateKey = IL;
    return ret;
}
class EthereumTxEstimation extends TxEstimation_1.AbstractTxEstimation {
    constructor(amount, fee, total, tx, net, relay) {
        super(amount, fee, total);
        this.tx = tx;
        this.net = net;
        this.relay = relay;
    }
    confirm() {
        let serialized = this.tx.serialize();
        return this.relay
            .relay_transaction(this.net, serialized, null)
            .then(x => new SendTxResult_1.SendTxResult(true, x));
    }
}
class ExternalEthWallet {
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
class BaseEthCryptoNetwork extends CryptoNetwork_1.CryptoNetwork {
    constructor(name, display_name, symbol, type, is_testnet, image) {
        super(name, display_name, symbol, type, 18, is_testnet, image);
        this.normal_tx_gaslimit = new bignumber_js_1.BigNumber(21000);
        this.unit_to_atom = new bignumber_js_1.BigNumber(10).pow(this.decimal_places);
    }
    generate_recovery_phrase() {
        return mnemonic_1.generate_mnemonic();
    }
    generate_master_from_recovery_phrase(phrase) {
        let master = fromMasterSeed(bip39_1.mnemonicToSeed(phrase));
        return value_to_promise(serializePrivate(master));
    }
    generate_root_node_from_master(s) {
        let node = deserializePrivate(s);
        let path = "m/44'/" + this.get_network_id() + "'/0'";
        node = node.derive(path);
        return value_to_promise(new PathKeyPair_1.PathKeyPair(path, serializePublic(node)));
    }
    derive_child_from_node(s, index) {
        return __awaiter(this, void 0, void 0, function* () {
            let deserialized = deserializePublic(s) || deserializePrivate(s);
            return value_to_promise(serializePublic(deserialized.deriveChild(index)));
        });
    }
    derive_path_from_node(s, path) {
        let deserialized = deserializePublic(s);
        let pub = true;
        if (!deserialized) {
            pub = false;
            deserialized = deserializePrivate(s);
        }
        let derived = deserialized.derive(path);
        let serialized = '';
        if (pub)
            serialized = serializePublic(derived);
        else
            serialized = serializePrivate(derived);
        return value_to_promise(serialized);
    }
    to_checksum_address(s) {
        return ethereumjs_util_1.toChecksumAddress(s);
    }
    get_address(s) {
        let public_key = JSON.parse(s).puk;
        let address_bin = ethereumjs_util_1.pubToAddress(new Buffer(public_key, 'hex'), true);
        let address = Buffer.from(address_bin).toString('hex');
        return value_to_promise(this.to_checksum_address(address));
    }
    get_tx_explorer_url(txid) {
        if (!txid.toLowerCase().startsWith('0x'))
            txid = '0x' + txid;
        return ((!this.is_testnet ? 'https://etherscan.io/tx/' : 'https://ropsten.etherscan.io/tx/') +
            txid);
    }
    is_address_valid(addr) {
        return ethereumjs_util_1.isValidAddress(addr);
    }
    number_to_buffer(n) {
        return new Buffer(n.toString(16), 'hex');
    }
    estimate_tx_with_input(getter, addresses, dst_address, value, fee_weight, ac, relay, input, custom_gas_limits, pk_network) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let gas_price = null;
                let minimum_balance = value;
                let selected_address = -1;
                let first_address = 0;
                let all_balances = yield getter.get_addresses_balances(this, addresses.map(x => pk_network.normalize_addr(x)));
                let params = yield getter.get_transaction_parameters(this, addresses);
                while (true) {
                    selected_address = -1;
                    let balance = null;
                    for (let i = first_address; i < addresses.length; i++) {
                        balance = all_balances[i];
                        if (balance.comparedTo(minimum_balance) >= 0) {
                            selected_address = i;
                            first_address = i + 1;
                            break;
                        }
                    }
                    //Note: the second half of this check is always false at this point.
                    if (selected_address < 0 || balance == null)
                        break;
                    let gas_limit = custom_gas_limits
                        ? custom_gas_limits.get(addresses[selected_address]) ||
                            this.normal_tx_gaslimit
                        : this.normal_tx_gaslimit;
                    if (gas_price == null) {
                        gas_price = params.get_fee(0, fee_weight);
                        minimum_balance = value.plus(gas_price.multipliedBy(gas_limit));
                    }
                    if (balance.comparedTo(minimum_balance) < 0)
                        //This address doesn't have enough funds after all.
                        continue;
                    let pk_string = yield getter.get_private_key(pk_network, addresses[selected_address]);
                    let pk = deserializePrivate(pk_string);
                    const normalized_addr = pk_network.normalize_addr(addresses[selected_address]);
                    const nonce = params.get_nonce(normalized_addr).toString(16);
                    MyLogger_1.MyLogger.debug('XXXXXXXXXXxx->', nonce, selected_address, addresses[selected_address]);
                    let tx = new ethereumjs_tx_1.default({
                        chainId: this.get_chain_id(),
                        nonce: '0x' + nonce,
                        gasPrice: '0x' + gas_price.toString(16),
                        gasLimit: '0x' + gas_limit.times(2).toString(16),
                        to: pk_network.normalize_addr(dst_address),
                        value: '0x' + value.toString(16),
                        data: '0x' + (input == null ? '' : input.toString('hex'))
                    });
                    tx.sign(pk.privateKey);
                    let fee = gas_price.multipliedBy(gas_limit);
                    resolve(new EthereumTxEstimation(yield ac.construct_Amount(value.dividedBy(this.unit_to_atom), this, true), yield ac.construct_Amount(fee.dividedBy(this.unit_to_atom), this, false), yield ac.construct_Amount(value.plus(fee).dividedBy(this.unit_to_atom), this, true), tx, this, relay));
                    return;
                }
                reject(ErrorCodes_1.ErrorCode.ERROR_INSUFFICIENT_FUNDS);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    estimate_tx(getter, addresses, dst_address, value, fee_weight, ac, relay) {
        value = value.multipliedBy(this.unit_to_atom);
        return this.estimate_tx_with_input(getter, addresses, dst_address, value, fee_weight, ac, relay, null, null, this);
    }
    to_TransactionRecord(app, data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let tx = data;
            let from = yield app.get_wallet_from_address(this, tx.input);
            let to = yield app.get_wallet_from_address(this, tx.output);
            let value = new bignumber_js_1.BigNumber(tx.value).dividedBy(this.unit_to_atom);
            if (from != null) {
                //Transaction is an OUT transfer.
                resolve(new History_1.TransactionRecord(History_1.TransactionType.Transfer, null, yield app.construct_Amount(value, this, false), from, new ExternalEthWallet(this, tx.output), parseInt(tx.timestamp), tx.txId));
                return;
            }
            if (to == null) {
                //What?
                resolve(new History_1.TransactionRecord(History_1.TransactionType.Transfer, yield app.construct_Amount(new bignumber_js_1.BigNumber(0), this, false), yield app.construct_Amount(new bignumber_js_1.BigNumber(0), this, false), new ExternalEthWallet(this, '???'), new ExternalEthWallet(this, '???'), parseInt(tx.timestamp), tx.txId));
                return;
            }
            //Transaction is an OUT transfer.
            resolve(new History_1.TransactionRecord(History_1.TransactionType.Transfer, yield app.construct_Amount(value, this, false), null, new ExternalEthWallet(this, tx.input), to, parseInt(tx.timestamp), tx.txId));
        }));
    }
    get_comparer(a) {
        let s = a.toLowerCase();
        return b => s == b.toLowerCase();
    }
}
exports.BaseEthCryptoNetwork = BaseEthCryptoNetwork;
class EthCryptoNetwork extends BaseEthCryptoNetwork {
    constructor() {
        super('ETH', 'Ethereum', 'ETH', CryptoNetworkType_1.CryptoNetworkType.ETH, false, 'mellowallet/assets/coins/eth.png');
    }
    get_network_id() {
        return 60;
    }
    get_chain_id() {
        return 1;
    }
}
exports.EthCryptoNetwork = EthCryptoNetwork;
class EthRopstenCryptoNetwork extends BaseEthCryptoNetwork {
    constructor() {
        super('ETH-Ropsten', 'Ethereum Ropsten', 'ROPSTEN', CryptoNetworkType_1.CryptoNetworkType.ETHRopsten, true, 'mellowallet/assets/coins/eth.png');
    }
    get_network_id() {
        return 1;
    }
    get_chain_id() {
        return 3;
    }
}
exports.EthRopstenCryptoNetwork = EthRopstenCryptoNetwork;

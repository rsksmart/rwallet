"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoNetworkType_1 = require("./CryptoNetworkType");
const EthCryptoNetwork_1 = require("./EthCryptoNetwork");
var rskjs = require('rskjs-util');
class BaseRskCryptoNetwork extends EthCryptoNetwork_1.BaseEthCryptoNetwork {
    constructor(name, display_name, symbol, type, is_testnet, image) {
        super(name, display_name, symbol, type, is_testnet, image);
    }
    is_address_valid(address) {
        const normValue = this.normalize_addr(address);
        return (super.is_address_valid(normValue) ||
            normValue.endsWith('.rsk') ||
            normValue.endsWith('.eth'));
    }
    to_checksum_address(s) {
        return rskjs.toChecksumAddress(s, this.get_chain_id());
    }
    normalize_addr(a) {
        return a.toLowerCase();
    }
}
exports.BaseRskCryptoNetwork = BaseRskCryptoNetwork;
class RskCryptoNetwork extends BaseRskCryptoNetwork {
    constructor() {
        super('RSK', 'RSK SmartBitcoin', 'RBTC', CryptoNetworkType_1.CryptoNetworkType.RSK, false, 'mellowallet/assets/coins/rbtc.png');
    }
    get_tx_explorer_url(txid) {
        if (txid.toLowerCase().startsWith('0x'))
            txid = txid.substr(2);
        return 'https://explorer.rsk.co/tx/0x' + txid;
    }
    get_network_id() {
        return 137;
    }
    get_chain_id() {
        return 30;
    }
}
exports.RskCryptoNetwork = RskCryptoNetwork;
class RskTestnetCryptoNetwork extends BaseRskCryptoNetwork {
    constructor() {
        super('RSK-Testnet', 'RSK SmartBitcoin-Testnet', 'RBTC-Testnet', CryptoNetworkType_1.CryptoNetworkType.RSKTestnet, true, 'mellowallet/assets/coins/rbtc.png');
    }
    get_tx_explorer_url(txid) {
        if (txid.toLowerCase().startsWith('0x'))
            txid = txid.substr(2);
        return 'https://explorer.testnet.rsk.co/tx/0x' + txid;
    }
    get_network_id() {
        return 37310;
    }
    get_chain_id() {
        return 31;
    }
}
exports.RskTestnetCryptoNetwork = RskTestnetCryptoNetwork;

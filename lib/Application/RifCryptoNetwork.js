"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoNetworkType_1 = require("./CryptoNetworkType");
const RskCryptoNetwork_1 = require("./RskCryptoNetwork");
const BaseTokenCryptoNetwork_1 = require("./BaseTokenCryptoNetwork");
let erc20Abi = JSON.parse('[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]');
class BaseRskTokenCryptoNetwork extends BaseTokenCryptoNetwork_1.BaseTokenCryptoNetwork {
    normalize_addr(a) {
        return a.toLowerCase();
    }
}
exports.BaseRskTokenCryptoNetwork = BaseRskTokenCryptoNetwork;
class RifCryptoNetwork extends BaseRskTokenCryptoNetwork {
    constructor() {
        super(new RskCryptoNetwork_1.RskCryptoNetwork(), 'RIF', 'Rif', 'RIF', CryptoNetworkType_1.CryptoNetworkType.RIF, 18, false, 'mellowallet/assets/coins/rif.png');
        this.rif_contract_address = '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5';
    }
    get_contract_address() {
        return this.rif_contract_address;
    }
}
exports.RifCryptoNetwork = RifCryptoNetwork;
class RifTestnetCryptoNetwork extends BaseRskTokenCryptoNetwork {
    constructor() {
        super(new RskCryptoNetwork_1.RskTestnetCryptoNetwork(), 'RIF-Testnet', 'Rif Testnet', 'tRIF', CryptoNetworkType_1.CryptoNetworkType.RIFTestnet, 18, true, 'mellowallet/assets/coins/rif.png');
        this.rif_contract_address = '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE'.toLowerCase();
    }
    // 0xd8c5adcac8d465c5a2d0772b86788e014ddec516
    get_contract_address() {
        return this.rif_contract_address;
    }
}
exports.RifTestnetCryptoNetwork = RifTestnetCryptoNetwork;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoNetworkType_1 = require("./CryptoNetworkType");
const EthCryptoNetwork_1 = require("./EthCryptoNetwork");
const BaseTokenCryptoNetwork_1 = require("./BaseTokenCryptoNetwork");
let erc20Abi = JSON.parse('[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]');
class DaiCryptoNetwork extends BaseTokenCryptoNetwork_1.BaseTokenCryptoNetwork {
    constructor() {
        super(new EthCryptoNetwork_1.EthCryptoNetwork(), 'DAI', 'Dai', 'DAI', CryptoNetworkType_1.CryptoNetworkType.DAI, 18, false, 'mellowallet/assets/coins/dai.png');
        this.dai_contract_address = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
    }
    get_contract_address() {
        return this.dai_contract_address;
    }
}
exports.DaiCryptoNetwork = DaiCryptoNetwork;
class DaiRopstenCryptoNetwork extends BaseTokenCryptoNetwork_1.BaseTokenCryptoNetwork {
    constructor() {
        super(new EthCryptoNetwork_1.EthRopstenCryptoNetwork(), 'DAI-Ropsten', 'Dai Ropsten', 'DAI-ROPSTEN', CryptoNetworkType_1.CryptoNetworkType.DAIRopsten, 18, true, 'mellowallet/assets/coins/dai.png');
        this.dai_contract_address = '0xb6444ec2b1689a36B58f5D9a824fFDC2D1b7F72d';
    }
    get_contract_address() {
        return this.dai_contract_address;
    }
}
exports.DaiRopstenCryptoNetwork = DaiRopstenCryptoNetwork;

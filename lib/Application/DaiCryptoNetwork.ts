import { CryptoNetwork } from './CryptoNetwork';
import { CryptoNetworkType } from './CryptoNetworkType';
import { EthCryptoNetwork, EthRopstenCryptoNetwork } from './EthCryptoNetwork';
import { BaseTokenCryptoNetwork } from './BaseTokenCryptoNetwork';

let erc20Abi = JSON.parse(
    '[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]'
);

export class DaiCryptoNetwork extends BaseTokenCryptoNetwork {
    constructor() {
        super(
            new EthCryptoNetwork(),
            'DAI',
            'Dai',
            'DAI',
            CryptoNetworkType.DAI,
            18,
            false,
            'mellowallet/assets/coins/dai.png'
        );
    }

    private dai_contract_address: string = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';

    get_contract_address(): string {
        return this.dai_contract_address;
    }
}

export class DaiRopstenCryptoNetwork extends BaseTokenCryptoNetwork {
    constructor() {
        super(
            new EthRopstenCryptoNetwork(),
            'DAI-Ropsten',
            'Dai Ropsten',
            'DAI-ROPSTEN',
            CryptoNetworkType.DAIRopsten,
            18,
            true,
            'mellowallet/assets/coins/dai.png'
        );
    }

    private dai_contract_address: string = '0xb6444ec2b1689a36B58f5D9a824fFDC2D1b7F72d';

    get_contract_address(): string {
        return this.dai_contract_address;
    }
}

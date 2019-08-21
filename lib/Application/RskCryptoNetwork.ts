import { CryptoNetworkType } from './CryptoNetworkType';
import {
    BaseEthCryptoNetwork,
    deserializePrivate,
    value_to_promise,
    serializePublic
} from './EthCryptoNetwork';

var rskjs = require('rskjs-util');

export abstract class BaseRskCryptoNetwork extends BaseEthCryptoNetwork {
    constructor(
        name: string,
        display_name: string,
        symbol: string,
        type: CryptoNetworkType,
        is_testnet: boolean,
        image: string
    ) {
        super(name, display_name, symbol, type, is_testnet, image);
    }

    protected abstract get_network_id(): number;

    protected abstract get_chain_id(): number;

    is_address_valid(address: string): boolean {
        const normValue = this.normalize_addr(address);
        return (
            super.is_address_valid(normValue) ||
            normValue.endsWith('.rsk') ||
            normValue.endsWith('.eth')
        );
    }

    protected to_checksum_address(s: string): string {
        return rskjs.toChecksumAddress(s, this.get_chain_id());
    }

    normalize_addr(a: string): string {
        return a.toLowerCase();
    }
}

export class RskCryptoNetwork extends BaseRskCryptoNetwork {
    constructor() {
        super(
            'RSK',
            'RSK SmartBitcoin',
            'RBTC',
            CryptoNetworkType.RSK,
            false,
            'mellowallet/assets/coins/rbtc.png'
        );
    }

    get_tx_explorer_url(txid: string): string {
        if (txid.toLowerCase().startsWith('0x')) txid = txid.substr(2);
        return 'https://explorer.rsk.co/tx/0x' + txid;
    }

    get_network_id(): number {
        return 137;
    }

    get_chain_id(): number {
        return 30;
    }
}

export class RskTestnetCryptoNetwork extends BaseRskCryptoNetwork {
    constructor() {
        super(
            'RSK-Testnet',
            'RSK SmartBitcoin-Testnet',
            'RBTC-Testnet',
            CryptoNetworkType.RSKTestnet,
            true,
            'mellowallet/assets/coins/rbtc.png'
        );
    }

    get_tx_explorer_url(txid: string): string {
        if (txid.toLowerCase().startsWith('0x')) txid = txid.substr(2);
        return 'https://explorer.testnet.rsk.co/tx/0x' + txid;
    }

    get_network_id(): number {
        return 37310;
    }

    get_chain_id(): number {
        return 31;
    }
}

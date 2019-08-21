import { FeeWeight } from './Wallet';
import { BigNumber } from 'bignumber.js';
import { CryptoNetwork } from './CryptoNetwork';
import { CryptoNetworkType } from './CryptoNetworkType';
import { ErrorCode } from './ErrorCodes';
import { stringify } from 'querystring';

export class Utxo {
    tx_id: string;
    txo_index: number;
    value: BigNumber;
    constructor(tx_id: string, txo_index: number, value: BigNumber) {
        this.tx_id = tx_id;
        this.txo_index = txo_index;
        this.value = value;
    }
}

export class AddressUtxo {
    address: string;
    utxos: Utxo[];
    constructor(address: string, utxos: Utxo[]) {
        this.address = address;
        this.utxos = utxos;
    }
}

interface EthNonce {
    addr: string;
    nonce: number;
}

interface EthParams {
    gasPrice: string;
    nonces: EthNonce[];
}

interface RskNonce {
    addr: string;
    nonce: number;
}

interface RskParams {
    gasPrice: string;
    nonces: RskNonce[];
}

interface BtcUtxo {
    address: string;
    txid: string;
    vout: number;
    scriptPubKey: string;
    amount: number;
    satoshis: number;
    confirmations: number;
    ts: number;
}

interface BtcParams {
    utxos: BtcUtxo[];
    lowFee: string;
    mediumFee: string;
    highFee: string;
}

export class TransactionParameters {
    private fee: BigNumber = new BigNumber(0);
    private utxos: AddressUtxo[] = [];
    private nonces: Map<string, BigNumber> = new Map<string, BigNumber>();

    constructor() {}
    static construct_empty(): TransactionParameters {
        return new TransactionParameters();
    }
    private static from_json_btc(params: BtcParams): TransactionParameters {
        let ret = new TransactionParameters();
        ret.fee = new BigNumber(params.mediumFee);
        let map = new Map<string, Utxo[]>();
        for (let i = 0; i < params.utxos.length; i++) {
            let utxo = params.utxos[i];
            let array = map.get(utxo.address);
            if (array == undefined) map.set(utxo.address, (array = []));
            array.push(new Utxo(utxo.txid, utxo.vout, new BigNumber(utxo.satoshis)));
        }

        map.forEach((v, k) => ret.utxos.push(new AddressUtxo(k, v)));
        return ret;
    }
    private static from_json_eth(params: EthParams): TransactionParameters {
        let ret = new TransactionParameters();
        ret.fee = new BigNumber(params.gasPrice);
        for (let i = 0; i < params.nonces.length; i++) {
            let kv = params.nonces[i];
            ret.nonces.set(kv.addr, new BigNumber(kv.nonce));
        }
        return ret;
    }
    private static from_json_rsk(params: RskParams): TransactionParameters {
        let ret = new TransactionParameters();
        ret.fee = new BigNumber(params.gasPrice);
        for (let i = 0; i < params.nonces.length; i++) {
            let kv = params.nonces[i];
            ret.nonces.set(kv.addr.toLowerCase(), new BigNumber(kv.nonce));
        }
        return ret;
    }
    static from_json(network: CryptoNetwork, json: string): TransactionParameters {
        switch (network.type) {
            case CryptoNetworkType.BTC:
            case CryptoNetworkType.BTCTestnet:
                return this.from_json_btc(<BtcParams>JSON.parse(json));
            case CryptoNetworkType.ETH:
            case CryptoNetworkType.ETHRopsten:
                return this.from_json_eth(<EthParams>JSON.parse(json));
            case CryptoNetworkType.RSK:
            case CryptoNetworkType.RSKTestnet:
                return this.from_json_rsk(<RskParams>JSON.parse(json));
            default:
                throw new Error(ErrorCode.ERROR_UNKNOWN_NETWORK);
        }
    }
    get_fee(size: number, weight: FeeWeight): BigNumber {
        let fee = this.fee;
        if (size) fee = fee.times(size).dividedToIntegerBy(1000);
        switch (weight) {
            case FeeWeight.Low:
                return fee.times(8).dividedToIntegerBy(10);
            case FeeWeight.Normal:
                return fee;
            case FeeWeight.High:
                return fee.times(12).dividedToIntegerBy(10);
        }
        return this.fee;
    }
    get_gas_price(weight: FeeWeight): BigNumber {
        switch (weight) {
            case FeeWeight.Low:
                return this.fee.times(8).dividedToIntegerBy(10);
            case FeeWeight.Normal:
                return this.fee;
            case FeeWeight.High:
                return this.fee.times(12).dividedToIntegerBy(10);
        }
        return this.fee;
    }
    get_utxo(): AddressUtxo[] {
        return this.utxos;
    }
    get_nonce(address: string): BigNumber {
        let ret = this.nonces.get(address);
        return ret != undefined ? ret : new BigNumber(0);
    }
}

export interface TxParamGetter {
    get_transaction_parameters(
        network: CryptoNetwork,
        addresses: string[]
    ): Promise<TransactionParameters>;
    get_private_key(network: CryptoNetwork, address: string): Promise<string>;
    get_address_balance(network: CryptoNetwork, address: string): Promise<BigNumber>;
    get_addresses_balances(network: CryptoNetwork, address: string[]): Promise<BigNumber[]>;
    estimate_gas_limit(
        network: CryptoNetwork,
        from: string,
        to: string,
        value: BigNumber
    ): Promise<BigNumber>;
}

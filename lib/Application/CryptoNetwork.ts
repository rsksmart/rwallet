import { CryptoNetworkType } from './CryptoNetworkType';
//import { result_from_promise } from './Utility';
import { keystore } from 'eth-lightwallet';
//import {HmacSHA512, lib} from 'crypto-js';
import { BigNumber } from 'bignumber.js';
import { FeeWeight } from './Wallet';
import { TxParamGetter, Utxo } from './TxParamGetter';
import { AbstractTxEstimation, TransactionRelay } from './TxEstimation';
import { Amount, AmountConstructor } from './Amount';
import { PathKeyPair } from './PathKeyPair';
import { TransactionRecord } from './History';
import { Application } from './Application';

export abstract class CryptoNetwork {
    public name: string;
    public display_name: string;
    public symbol: string;
    public type: CryptoNetworkType;
    public decimal_places: number;
    public unit_to_atom: BigNumber;
    public is_testnet: boolean;
    public image: string;
    public base: number = 10; //Reserved

    constructor(
        name: string,
        display_name: string,
        symbol: string,
        type: CryptoNetworkType,
        decimals: number,
        is_testnet: boolean,
        image: string
    ) {
        this.name = name;
        this.display_name = display_name;
        this.symbol = symbol;
        this.type = type;
        this.decimal_places = decimals;
        this.is_testnet = is_testnet;
        this.image = image;
        this.unit_to_atom = new BigNumber(1);
    }

    abstract generate_recovery_phrase(): Promise<string>;

    abstract generate_master_from_recovery_phrase(phrase: string): Promise<string>;

    abstract generate_root_node_from_master(master: string): Promise<PathKeyPair>;

    abstract derive_child_from_node(node: string, index: number): Promise<string>;

    abstract derive_path_from_node(node: string, path: string): Promise<string>;

    abstract get_address(node: string): Promise<string>;

    abstract get_tx_explorer_url(node: string): string;

    abstract estimate_tx(
        getter: TxParamGetter,
        addresses: string[],
        dst_address: string,
        value: BigNumber,
        fee: FeeWeight,
        ac: AmountConstructor,
        relay: TransactionRelay
    ): Promise<AbstractTxEstimation>;

    abstract is_address_valid(address: string): boolean;

    abstract to_TransactionRecord(app: Application, data: any): Promise<TransactionRecord>;

    normalize_addr(a: string): string {
        return a;
    }

    abstract get_comparer(a: string): (b: string) => boolean;
}

function value_to_promise<T>(s: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        resolve(s);
    });
}

function empty_string(): Promise<string> {
    return value_to_promise('');
}

/*export class NullCryptoNetwork extends CryptoNetwork{
    constructor(){
        super('', '', '', CryptoNetworkType.BTC, 0, false, '');
    }

    generate_recovery_phrase(): Promise<string>{
        return empty_string();
    }
    generate_master_from_recovery_phrase(phrase: string): Promise<string>{
        return empty_string();
    }
    generate_root_node_from_master(master: string): Promise<PathKeyPair>{
        return value_to_promise(new PathKeyPair());
    }
    derive_child_from_node(node: string, index: number): Promise<string>{
        return empty_string();
    }
    derive_path_from_node(node: string, path: string): Promise<string>{
        return empty_string();
    }
    get_address(node: string): Promise<string>{
        return empty_string();
    }
    get_tx_explorer_url(txid: string): string{
        return '';
    }
    estimate_tx(getter: TxParamGetter, addresses: string[], dst_address: string, value: BigNumber, fee: FeeWeight): Promise<AbstractTxEstimation>{
        return new Promise<AbstractTxEstimation>((resolve, reject) => reject(ErrorCode.ERROR_NOT_IMPLEMENTED));
    }
    is_address_valid(address: string): boolean{
        return false;
    }
}*/

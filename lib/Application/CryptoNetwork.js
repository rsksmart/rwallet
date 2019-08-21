"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import {HmacSHA512, lib} from 'crypto-js';
const bignumber_js_1 = require("bignumber.js");
class CryptoNetwork {
    constructor(name, display_name, symbol, type, decimals, is_testnet, image) {
        this.base = 10; //Reserved
        this.name = name;
        this.display_name = display_name;
        this.symbol = symbol;
        this.type = type;
        this.decimal_places = decimals;
        this.is_testnet = is_testnet;
        this.image = image;
        this.unit_to_atom = new bignumber_js_1.BigNumber(1);
    }
    normalize_addr(a) {
        return a;
    }
}
exports.CryptoNetwork = CryptoNetwork;
function value_to_promise(s) {
    return new Promise((resolve, reject) => {
        resolve(s);
    });
}
function empty_string() {
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

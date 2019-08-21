import { Amount } from './Amount';
import { AbstractWallet } from './Wallet';

export enum TransactionType {
    Transfer = 'transfer',
    Exchange = 'exchange'
}

export class TransactionRecord {
    type: TransactionType;
    input: Amount | null;
    output: Amount | null;
    src: AbstractWallet;
    dst: AbstractWallet;
    timestamp: number;
    tx_hash: string;

    constructor(
        type: TransactionType,
        input: Amount | null,
        output: Amount | null,
        src: AbstractWallet,
        dst: AbstractWallet,
        timestamp: number,
        tx_hash: string
    ) {
        this.type = type;
        this.input = input;
        this.output = output;
        this.src = src;
        this.dst = dst;
        this.timestamp = timestamp;
        this.tx_hash = tx_hash;
    }
}

import { Amount } from './Amount';
import { CryptoNetwork } from './CryptoNetwork';
import { SendTxResult } from './SendTxResult';

export abstract class AbstractTxEstimation {
    amount: Amount;
    fees: Amount;
    total: Amount;
    abstract confirm(): Promise<SendTxResult>;

    constructor(amount: Amount, fee: Amount, total: Amount) {
        this.amount = amount;
        this.fees = fee;
        this.total = total;
    }
}

export interface TransactionRelay {
    relay_transaction(
        network: CryptoNetwork,
        raw_transaction: Buffer,
        txid: string | null
    ): Promise<string>;
}

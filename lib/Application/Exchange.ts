import { Wallet } from './Wallet';
import { BigNumber } from 'bignumber.js';
import { Amount } from './Amount';
import { SendTxResult } from './SendTxResult';

export abstract class Exchange {
    abstract get_model(): number;
}

export abstract class ExchangeModel1 extends Exchange {
    get_model(): number {
        return 1;
    }
    abstract estimate_exchange(
        src: Wallet,
        dst: Wallet,
        src_amount: string
    ): Promise<ExchangeEstimation1>;
}

export abstract class ExchangeEstimation1 {
    src_amount: Amount;
    fees: Amount;
    dst_amount: Amount;
    abstract confirm(): Promise<SendTxResult>;

    constructor(src: Amount, fees: Amount, dst: Amount) {
        this.src_amount = src;
        this.fees = fees;
        this.dst_amount = dst;
    }
}

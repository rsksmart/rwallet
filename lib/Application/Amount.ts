import { BigNumber } from 'bignumber.js';
import { CryptoNetwork } from './CryptoNetwork';

export class Amount {
    value: string = '0';
    unit: string = '';
    fiat_value: string = '0';
    fiat_unit: string = '';
}

export interface AmountConstructor {
    construct_Amount(value: BigNumber, network: CryptoNetwork, rounding: boolean): Promise<Amount>;
}

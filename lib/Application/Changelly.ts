import { ExchangeModel1, ExchangeEstimation1 } from './Exchange';
import { Wallet, FeeWeight } from './Wallet';
import BigNumber from 'bignumber.js';
import { ErrorCode } from './ErrorCodes';
import { Application } from './Application';
import { Amount } from './Amount';
import { SendTxResult } from './SendTxResult';
import { CryptoNetwork } from './CryptoNetwork';

class ChangellyEstimation extends ExchangeEstimation1 {
    protected app: Application;
    protected src_wallet: Wallet;
    protected dst_wallet: Wallet;

    constructor(
        app: Application,
        src: Amount,
        fees: Amount,
        dst: Amount,
        src_wallet: Wallet,
        dst_wallet: Wallet
    ) {
        super(src, fees, dst);
        this.app = app;
        this.src_wallet = src_wallet;
        this.dst_wallet = dst_wallet;
    }
    confirm(): Promise<SendTxResult> {
        return new Promise<SendTxResult>(async (resolve, reject) => {
            try {
                let src_network = this.src_wallet.get_network_object();
                let dst_network = this.dst_wallet.get_network_object();
                let response: string = await this.app.server_get_request(
                    '/doExchange?quantity=' +
                        this.src_amount.value +
                        '&destinationAddr=' +
                        (await this.dst_wallet.get_receive_address()) +
                        '&fromCoin=' +
                        src_network.name +
                        '&toCoin=' +
                        dst_network.name
                );
                let estimation = await this.src_wallet.estimate_tx(
                    response,
                    this.src_amount.value,
                    FeeWeight.Normal
                );
                estimation
                    .confirm()
                    .then(resolve)
                    .catch(reject);
            } catch (e) {
                reject(e);
            }
        });
    }
}

export class Changelly extends ExchangeModel1 {
    protected app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    estimate_exchange(src: Wallet, dst: Wallet, src_amount: string): Promise<ExchangeEstimation1> {
        return new Promise<ExchangeEstimation1>(async (resolve, reject) => {
            let amount = new BigNumber(src_amount);
            let src_network = src.get_network_object();
            let dst_network = dst.get_network_object();

            let atoms = amount.multipliedBy(src_network.unit_to_atom);

            //TODO: /exchangeEstimation should be accepting atoms, not units.
            let dst_amount_p = this.app.server_get_request(
                '/exchangeEstimation?quantity=' +
                    amount.toString() +
                    '&fromCoin=' +
                    src_network.name +
                    '&toCoin=' +
                    dst_network.name
            );
            let converted_p = this.app.currency_conversion(
                src_amount,
                src_network.name,
                dst_network.name
            );

            try {
                let dst_amount = new BigNumber(await dst_amount_p);
                let converted = new BigNumber(await converted_p).multipliedBy(
                    dst_network.unit_to_atom
                );
                let fees = converted.minus(dst_amount);
                let estimation = new ChangellyEstimation(
                    this.app,
                    await this.app.construct_Amount(amount, src_network, true),
                    await this.app.construct_Amount(
                        fees.dividedBy(dst_network.unit_to_atom),
                        dst_network,
                        true
                    ),
                    await this.app.construct_Amount(
                        dst_amount.dividedBy(dst_network.unit_to_atom),
                        dst_network,
                        true
                    ),
                    src,
                    dst
                );
                resolve(estimation);
            } catch (e) {
                reject(e);
            }
        });
    }
}

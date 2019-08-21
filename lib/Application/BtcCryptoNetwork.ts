import {CryptoNetwork} from './CryptoNetwork';
import {CryptoNetworkType} from './CryptoNetworkType';
import {BigNumber} from 'bignumber.js';
import {TxParamGetter, TransactionParameters, Utxo} from './TxParamGetter';
import {BIP32, fromPrivateKey, fromPublicKey, fromSeed, fromBase58} from 'bip32';
import {
    address,
    ECPair,
    networks,
    payments,
    TransactionBuilder,
    Transaction,
    Network
} from 'bitcoinjs-lib';
import {generate_mnemonic} from './mnemonic';
import {mnemonicToSeed, generateMnemonic, wordlists} from 'bip39';
import {PathKeyPair} from './PathKeyPair';
import {ErrorCode} from './ErrorCodes';
import {FeeWeight} from './Wallet';
import {Amount, AmountConstructor} from './Amount';
import {AbstractTxEstimation, TransactionRelay} from './TxEstimation';
import {SendTxResult} from './SendTxResult';
import {TransactionRecord, TransactionType} from './History';
import {
    Application,
    BtcHistoryRecordResponse,
    BtcHistoryRecordResponseInputOutput
} from './Application';
import {AbstractWallet, Wallet} from './Wallet';
import {SortCriterion} from './SortCriterion';

function value_to_promise<T>(s: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        resolve(s);
    });
}

class ReorderedUtxo {
    value: BigNumber;
    address: string;
    utxo: Utxo;

    constructor(value: BigNumber, address: string, utxo: Utxo) {
        this.value = value;
        this.address = address;
        this.utxo = utxo;
    }
}

class BitcoinTxEstimation extends AbstractTxEstimation {
    private net: CryptoNetwork;
    private relay: TransactionRelay;
    private tx: Transaction;

    constructor(
        amount: Amount,
        fee: Amount,
        total: Amount,
        net: CryptoNetwork,
        tx: Transaction,
        relay: TransactionRelay
    ) {
        super(amount, fee, total);
        this.net = net;
        this.tx = tx;
        this.relay = relay;
    }

    confirm(): Promise<SendTxResult> {
        let txid = this.tx.getId();
        let serialized = this.tx.toBuffer();
        return this.relay
            .relay_transaction(this.net, serialized, txid)
            .then(x => new SendTxResult(true, x));
    }
}

class WalletValue {
    is_true_wallet: boolean;
    wallet: AbstractWallet;
    value: BigNumber;

    constructor(is_true_wallet: boolean, wallet: AbstractWallet, value: BigNumber) {
        this.is_true_wallet = is_true_wallet;
        this.wallet = wallet;
        this.value = value;
    }
}

class WalletValuePair {
    from: WalletValue;
    to: WalletValue;

    constructor(from: WalletValue, to: WalletValue) {
        this.from = from;
        this.to = to;
    }
}

function find_max<T>(data: T[], comp: (a: T, b: T) => number): number {
    if (data.length == 0) return -1;
    let max = 0;
    for (let i = 1; i < data.length; i++) if (comp(data[i], data[max]) > 0) max = i;
    return max;
}

class ExternalBtcWallet implements AbstractWallet {
    private network: BaseBtcCryptoNetwork;
    private address: string;

    constructor(network: BaseBtcCryptoNetwork, address: string) {
        this.network = network;
        this.address = address;
    }

    get_id(): Promise<number> {
        return new Promise<number>((resolve, reject) => resolve(-1));
    }

    get_name(): Promise<string> {
        return new Promise<string>((resolve, reject) => resolve(''));
    }

    set_name(value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
        });
    }

    get_network(): Promise<string> {
        return new Promise<string>((resolve, reject) => resolve(this.network.name));
    }

    get_phrase(): Promise<string> {
        return new Promise<string>((resolve, reject) => resolve(''));
    }

    get_balance(): Promise<Amount> {
        return new Promise<Amount>((resolve, reject) => resolve(new Amount()));
    }

    get_addresses(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => resolve([this.address]));
    }

    generate_address(): Promise<string> {
        return this.get_receive_address();
    }

    get_receive_address(): Promise<string> {
        return new Promise<string>((resolve, reject) => resolve(this.address));
    }

    estimate_tx(dst_address: string, value: string, fee: FeeWeight): Promise<AbstractTxEstimation> {
        return new Promise<AbstractTxEstimation>((resolve, reject) =>
            reject(ErrorCode.ERROR_INTERNAL)
        );
    }

    get_history(
        page: number,
        page_size: number,
        criterion: SortCriterion
    ): Promise<TransactionRecord[]> {
        return new Promise<TransactionRecord[]>((resolve, reject) =>
            reject(ErrorCode.ERROR_INTERNAL)
        );
    }
}

abstract class BaseBtcCryptoNetwork extends CryptoNetwork {
    constructor(
        name: string,
        display_name: string,
        symbol: string,
        type: CryptoNetworkType,
        is_testnet: boolean,
        image: string
    ) {
        super(name, display_name, symbol, type, 8, is_testnet, 'mellowallet/assets/coins/btc.png');
        this.unit_to_atom = new BigNumber(10).pow(this.decimal_places);
    }

    protected abstract get_network(): Network;

    generate_recovery_phrase(): Promise<string> {
        return generate_mnemonic();
    }

    generate_master_from_recovery_phrase(phrase: string): Promise<string> {
        return value_to_promise(fromSeed(mnemonicToSeed(phrase), this.get_network()).toBase58());
    }

    protected abstract get_network_id(): number;

    generate_root_node_from_master(master: string): Promise<PathKeyPair> {
        let path = "m/44'/" + this.get_network_id() + "'/0'";
        let pk = fromBase58(master, this.get_network())
            .derivePath(path)
            .neutered()
            .toBase58();
        return value_to_promise(new PathKeyPair(path, pk));
    }

    derive_child_from_node(node: string, index: number): Promise<string> {
        let t = fromBase58(node, this.get_network()).derive(index);
        return value_to_promise(t.toBase58());
    }

    derive_path_from_node(node: string, path: string): Promise<string> {
        return value_to_promise(
            fromBase58(node, this.get_network())
                .derivePath(path)
                .toBase58()
        );
    }

    get_address(node: string): Promise<string> {
        let options = {
            pubkey: fromBase58(node, this.get_network()).publicKey,
            network: this.get_network()
        };
        return value_to_promise(payments.p2pkh(options).address);
    }

    private max_safe = new BigNumber('4503599627370496');

    private to_number(n: BigNumber): number {
        if (n.abs().comparedTo(this.max_safe) >= 0) throw new Error(ErrorCode.ERROR_OVERFLOW);
        return n.toNumber();
    }

    private build_transaction(
        fee: BigNumber,
        getter: TxParamGetter,
        params: TransactionParameters,
        addresses: string[],
        dst_address: string,
        value: BigNumber
    ): Promise<Transaction> {
        return new Promise<Transaction>(async (resolve, reject) => {
            let my_network = this.get_network();
            let tb = new TransactionBuilder(my_network);
            let utxos = params.get_utxo();

            let reordered: ReorderedUtxo[] = [];
            for (let i = 0; i < utxos.length; i++)
                for (let j = 0; j < utxos[i].utxos.length; j++)
                    reordered.push(
                        new ReorderedUtxo(
                            utxos[i].utxos[j].value,
                            utxos[i].address,
                            utxos[i].utxos[j]
                        )
                    );
            reordered = reordered.sort((a, b) => -a.value.comparedTo(b.value));

            let value_plus_fee = value.plus(fee);
            let addressesUsed: Map<string, number[]> = new Map();
            let private_keys: Map<string, ECPair> = new Map();

            for (let i = 0; i < reordered.length && value_plus_fee.isPositive(); i++) {
                let addr = reordered[i].address;
                let indexList = addressesUsed.get(addr);
                if (indexList == undefined) {
                    indexList = [i];
                    addressesUsed.set(addr, indexList);

                    let pk_string: string;
                    try {
                        pk_string = await getter.get_private_key(this, addr);
                    } catch (e) {
                        reject(e);
                        return;
                    }
                    private_keys.set(
                        addr,
                        ECPair.fromPrivateKey(fromBase58(pk_string, my_network).privateKey, {
                            network: my_network
                        })
                    );
                } else indexList.push(i);
                tb.addInput(reordered[i].utxo.tx_id, reordered[i].utxo.txo_index);
                value_plus_fee = value_plus_fee.minus(reordered[i].value);
            }

            try {
                if (value_plus_fee.isNegative())
                    tb.addOutput(addresses[0], this.to_number(value_plus_fee.negated()));
                tb.addOutput(dst_address, this.to_number(value));
            } catch (e) {
                reject(e);
                return;
            }

            addressesUsed.forEach((v, k) => {
                let pk = private_keys.get(k);
                if (pk == undefined)
                //Will never happen. This check is just to satisfy the type checker.
                    return;

                for (let i = 0; i < v.length; i++) tb.sign(v[i], pk);
            });

            resolve(tb.build());
        });
    }

    estimate_tx(
        getter: TxParamGetter,
        addresses: string[],
        dst_address: string,
        value: BigNumber,
        fee_weight: FeeWeight,
        ac: AmountConstructor,
        relay: TransactionRelay
    ): Promise<AbstractTxEstimation> {
        return new Promise<AbstractTxEstimation>(async (resolve, reject) => {
            try {
                value = new BigNumber(value.multipliedBy(this.unit_to_atom).toFixed(0));
                let params = await getter.get_transaction_parameters(this, addresses);
                let fee = new BigNumber(0);

                let tx = await this.build_transaction(
                    fee,
                    getter,
                    params,
                    addresses,
                    dst_address,
                    value
                );
                fee = params.get_fee(tx.byteLength(), fee_weight);
                tx = await this.build_transaction(
                    fee,
                    getter,
                    params,
                    addresses,
                    dst_address,
                    value
                );

                resolve(
                    new BitcoinTxEstimation(
                        await ac.construct_Amount(value.dividedBy(this.unit_to_atom), this, true),
                        await ac.construct_Amount(fee.dividedBy(this.unit_to_atom), this, false),
                        await ac.construct_Amount(
                            value.plus(fee).dividedBy(this.unit_to_atom),
                            this,
                            true
                        ),
                        this,
                        tx,
                        relay
                    )
                );
            } catch (e) {
                reject(e);
            }
        });
    }

    get_tx_explorer_url(txid: string): string {
        if (txid.toLowerCase().startsWith('0x')) txid = txid.substr(2);
        return (
            (!this.is_testnet
                ? 'https://www.blockchain.com/btc/tx/'
                : 'https://testnet.blockexplorer.com/tx/') + txid
        );
    }

    is_address_valid(addr: string): boolean {
        try {
            address.fromBase58Check(addr);
        } catch (e) {
            return false;
        }
        return true;
    }

    private get_wallets_values(
        app: Application,
        list: BtcHistoryRecordResponseInputOutput[]
    ): Promise<WalletValue[]> {
        return new Promise<WalletValue[]>(async (resolve, reject) => {
            let ret: WalletValue[] = [];
            for (let i = 0; i < list.length; i++) {
                let wallet = await app.get_wallet_from_address(this, list[i].address);
                let n = new BigNumber(list[i].value);
                if (wallet == null) {
                    ret.push(
                        new WalletValue(false, new ExternalBtcWallet(this, list[i].address), n)
                    );
                    continue;
                }
                ret.push(new WalletValue(true, wallet, n));
            }
            resolve(ret);
        });
    }

    private get_value(
        app: Application,
        tx: BtcHistoryRecordResponse
    ): Promise<WalletValuePair | null> {
        return new Promise<WalletValuePair | null>(async (resolve, reject) => {
            let ins = await this.get_wallets_values(app, tx.input);
            let outs = await this.get_wallets_values(app, tx.output);

            let compare = (x: WalletValue, y: WalletValue) => -x.value.comparedTo(y.value);
            let filtered_ins = ins.filter(x => x.is_true_wallet);
            let filtered_outs = outs.filter(x => x.is_true_wallet);
            let max_in = find_max(filtered_ins, compare);
            let max_out = find_max(filtered_outs, compare);

            let value = new BigNumber(0);
            if (max_in >= 0) {
                filtered_ins.forEach(x => {
                    value = value.plus(x.value);
                });
                let negated_outs = outs.filter(x => !x.is_true_wallet);
                filtered_outs.forEach(x => {
                    value = value.minus(x.value);
                });
                max_out = find_max(negated_outs, compare);
                let out_wallet: AbstractWallet | null = null;
                if (max_out >= 0) out_wallet = negated_outs[max_out].wallet;
                else out_wallet = new ExternalBtcWallet(this, '???');

                resolve(
                    new WalletValuePair(
                        new WalletValue(true, ins[max_in].wallet, value.negated()),
                        new WalletValue(false, out_wallet, value)
                    )
                );
                return;
            }
            if (max_out >= 0) {
                filtered_outs.forEach(x => {
                    value = value.plus(x.value);
                });
                let negated_ins = ins.filter(x => !x.is_true_wallet);
                max_in = find_max(negated_ins, compare);
                let in_wallet: AbstractWallet | null = null;
                if (max_in >= 0) in_wallet = negated_ins[max_in].wallet;
                else in_wallet = new ExternalBtcWallet(this, '???');

                resolve(
                    new WalletValuePair(
                        new WalletValue(false, in_wallet, value.negated()),
                        new WalletValue(true, outs[max_out].wallet, value)
                    )
                );
                return;
            }
            resolve(null);
        });
    }

    to_TransactionRecord(app: Application, data: any): Promise<TransactionRecord> {
        return new Promise<TransactionRecord>(async (resolve, reject) => {
            let tx = <BtcHistoryRecordResponse>data;
            let wvp = await this.get_value(app, tx);
            if (wvp == null) {
                resolve(
                    new TransactionRecord(
                        TransactionType.Transfer,
                        await app.construct_Amount(new BigNumber(0), this, false),
                        await app.construct_Amount(new BigNumber(0), this, false),
                        new ExternalBtcWallet(this, '???'),
                        new ExternalBtcWallet(this, '???'),
                        parseInt(tx.timestamp),
                        tx.txId
                    )
                );
                return;
            }

            if (!wvp.from.is_true_wallet) {
                //Transaction is an IN transfer.
                resolve(
                    new TransactionRecord(
                        TransactionType.Transfer,
                        await app.construct_Amount(
                            wvp.to.value.dividedBy(this.unit_to_atom),
                            this,
                            false
                        ),
                        null,
                        wvp.from.wallet,
                        wvp.to.wallet,
                        parseInt(tx.timestamp),
                        tx.txId
                    )
                );
                return;
            }

            //Transaction is an OUT transfer.
            resolve(
                new TransactionRecord(
                    TransactionType.Transfer,
                    null,
                    await app.construct_Amount(
                        wvp.to.value.dividedBy(this.unit_to_atom),
                        this,
                        false
                    ),
                    wvp.from.wallet,
                    wvp.to.wallet,
                    parseInt(tx.timestamp),
                    tx.txId
                )
            );
        });
    }

    get_comparer(a: string): (b: string) => boolean {
        return b => a == b;
    }
}

export class BtcCryptoNetwork extends BaseBtcCryptoNetwork {
    constructor() {
        super(
            'BTC',
            'Bitcoin',
            'BTC',
            CryptoNetworkType.BTC,
            false,
            'mellowallet/assets/coins/btc.png'
        );
    }

    protected get_network(): Network {
        return networks.bitcoin;
    }

    protected get_network_id(): number {
        return 0;
    }
}

export class BtcTestnetCryptonetwork extends BaseBtcCryptoNetwork {
    constructor() {
        super(
            'BTC-Testnet',
            'Bitcoin Testnet',
            'BTCTESTNET',
            CryptoNetworkType.BTCTestnet,
            true,
            'mellowallet/assets/coins/btc.png'
        );
    }

    protected get_network(): Network {
        return networks.testnet;
    }

    protected get_network_id(): number {
        return 1;
    }
}

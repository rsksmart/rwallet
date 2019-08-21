import {CryptoNetwork} from './CryptoNetwork';
import {CryptoNetworkType} from './CryptoNetworkType';
import HDNode = require('hdkey');
import {createHmac, createHash} from 'crypto';
import {generate_mnemonic} from './mnemonic';
import {BigNumber} from 'bignumber.js';
import {mnemonicToSeed, generateMnemonic, wordlists, validateMnemonic} from 'bip39';
import {PathKeyPair} from './PathKeyPair';
import {pubToAddress, toChecksumAddress, isValidAddress} from 'ethereumjs-util';
import EthereumTx from 'ethereumjs-tx';
import {TxParamGetter, Utxo} from './TxParamGetter';
import {AbstractWallet, Wallet, FeeWeight} from './Wallet';
import {Amount, AmountConstructor} from './Amount';
import {AbstractTxEstimation, TransactionRelay} from './TxEstimation';
import {ErrorCode} from './ErrorCodes';
import {SendTxResult} from './SendTxResult';
import {Application, EthHistoryRecordResponse} from './Application';
import {TransactionRecord, TransactionType} from './History';
import {SortCriterion} from './SortCriterion';
import {MyLogger} from "./MyLogger";

export function value_to_promise<T>(s: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        resolve(s);
    });
}

export function deserializePrivate(s: string): HDNode {
    let master = JSON.parse(s);
    let ret = new HDNode();
    ret.chainCode = new Buffer(master.cc, 'hex');
    ret.privateKey = new Buffer(master.prk, 'hex');
    return ret;
}

function deserializePublic(s: string): HDNode | null {
    let master = JSON.parse(s);
    if (master.prk) return null;
    let ret = new HDNode();
    ret.chainCode = new Buffer(master.cc, 'hex');
    ret.publicKey = new Buffer(master.puk, 'hex');
    return ret;
}

function serializePrivate(node: HDNode): string {
    let ret: any = {
        prk: node.privateKey.toString('hex'),
        cc: node.chainCode.toString('hex')
    };
    return JSON.stringify(ret);
}

export function serializePublic(node: HDNode): string {
    let ret: any = {
        puk: node.publicKey.toString('hex'),
        cc: node.chainCode.toString('hex')
    };
    return JSON.stringify(ret);
}

var MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8');

function fromMasterSeed(seed_buffer: Buffer) {
    //let t = HmacSHA512(lib.WordArray.create(seed_buffer), 'Bitcoin seed').toString();
    //let I = new Buffer(t, 'hex');
    let I = createHmac('sha512', MASTER_SECRET)
        .update(seed_buffer)
        .digest();
    let IL = I.slice(0, 32);
    let IR = I.slice(32);

    let ret = new HDNode();
    ret.chainCode = IR;
    ret.privateKey = IL;

    return ret;
}

class EthereumTxEstimation extends AbstractTxEstimation {
    private tx: EthereumTx;
    private net: CryptoNetwork;
    private relay: TransactionRelay;

    constructor(
        amount: Amount,
        fee: Amount,
        total: Amount,
        tx: EthereumTx,
        net: CryptoNetwork,
        relay: TransactionRelay
    ) {
        super(amount, fee, total);
        this.tx = tx;
        this.net = net;
        this.relay = relay;
    }

    confirm(): Promise<SendTxResult> {
        let serialized = this.tx.serialize();
        return this.relay
            .relay_transaction(this.net, serialized, null)
            .then(x => new SendTxResult(true, x));
    }
}

class ExternalEthWallet implements AbstractWallet {
    private network: BaseEthCryptoNetwork;
    private address: string;

    constructor(network: BaseEthCryptoNetwork, address: string) {
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

export abstract class BaseEthCryptoNetwork extends CryptoNetwork {
    constructor(
        name: string,
        display_name: string,
        symbol: string,
        type: CryptoNetworkType,
        is_testnet: boolean,
        image: string
    ) {
        super(name, display_name, symbol, type, 18, is_testnet, image);
        this.unit_to_atom = new BigNumber(10).pow(this.decimal_places);
    }

    generate_recovery_phrase(): Promise<string> {
        return generate_mnemonic();
    }

    generate_master_from_recovery_phrase(phrase: string): Promise<string> {
        let master = fromMasterSeed(mnemonicToSeed(phrase));
        return value_to_promise(serializePrivate(master));
    }

    protected abstract get_network_id(): number;

    generate_root_node_from_master(s: string): Promise<PathKeyPair> {
        let node = deserializePrivate(s);
        let path = "m/44'/" + this.get_network_id() + "'/0'";
        node = node.derive(path);
        return value_to_promise(new PathKeyPair(path, serializePublic(node)));
    }

    async derive_child_from_node(s: string, index: number): Promise<string> {
        let deserialized = deserializePublic(s) || deserializePrivate(s);
        return value_to_promise(serializePublic(deserialized.deriveChild(index)));
    }

    derive_path_from_node(s: string, path: string): Promise<string> {
        let deserialized = deserializePublic(s);
        let pub = true;
        if (!deserialized) {
            pub = false;
            deserialized = deserializePrivate(s);
        }
        let derived = deserialized.derive(path);
        let serialized = '';
        if (pub) serialized = serializePublic(derived);
        else serialized = serializePrivate(derived);
        return value_to_promise(serialized);
    }

    protected to_checksum_address(s: string): string {
        return toChecksumAddress(s);
    }

    get_address(s: string): Promise<string> {
        let public_key: string = JSON.parse(s).puk;
        let address_bin = pubToAddress(new Buffer(public_key, 'hex'), true);
        let address = Buffer.from(address_bin).toString('hex');
        return value_to_promise(this.to_checksum_address(address));
    }

    get_tx_explorer_url(txid: string): string {
        if (!txid.toLowerCase().startsWith('0x')) txid = '0x' + txid;
        return (
            (!this.is_testnet ? 'https://etherscan.io/tx/' : 'https://ropsten.etherscan.io/tx/') +
            txid
        );
    }

    is_address_valid(addr: string): boolean {
        return isValidAddress(addr);
    }

    protected abstract get_chain_id(): number;

    private number_to_buffer(n: BigNumber): Buffer {
        return new Buffer(n.toString(16), 'hex');
    }

    private normal_tx_gaslimit = new BigNumber(21000);

    estimate_tx_with_input(
        getter: TxParamGetter,
        addresses: string[],
        dst_address: string,
        value: BigNumber,
        fee_weight: FeeWeight,
        ac: AmountConstructor,
        relay: TransactionRelay,
        input: Buffer | null,
        custom_gas_limits: Map<string, BigNumber> | null,
        pk_network: CryptoNetwork
    ): Promise<AbstractTxEstimation> {
        return new Promise<AbstractTxEstimation>(async (resolve, reject) => {
            try {
                let gas_price: BigNumber | null = null;
                let minimum_balance = value;
                let selected_address = -1;
                let first_address = 0;
                let all_balances = await getter.get_addresses_balances(
                    this,
                    addresses.map(x => pk_network.normalize_addr(x))
                );
                let params = await getter.get_transaction_parameters(this, addresses);
                while (true) {
                    selected_address = -1;
                    let balance: BigNumber | null = null;
                    for (let i = first_address; i < addresses.length; i++) {
                        balance = all_balances[i];
                        if (balance.comparedTo(minimum_balance) >= 0) {
                            selected_address = i;
                            first_address = i + 1;
                            break;
                        }
                    }

                    //Note: the second half of this check is always false at this point.
                    if (selected_address < 0 || balance == null) break;

                    let gas_limit = custom_gas_limits
                        ? custom_gas_limits.get(addresses[selected_address]) ||
                        this.normal_tx_gaslimit
                        : this.normal_tx_gaslimit;

                    if (gas_price == null) {
                        gas_price = params.get_fee(0, fee_weight);
                        minimum_balance = value.plus(gas_price.multipliedBy(gas_limit));
                    }
                    if (balance.comparedTo(minimum_balance) < 0)
                    //This address doesn't have enough funds after all.
                        continue;

                    let pk_string = await getter.get_private_key(
                        pk_network,
                        addresses[selected_address]
                    );
                    let pk = deserializePrivate(pk_string);

                    const normalized_addr = pk_network.normalize_addr(addresses[selected_address]);
                    const nonce = params.get_nonce(normalized_addr).toString(16);
                    MyLogger.debug(
                        'XXXXXXXXXXxx->',
                        nonce,
                        selected_address,
                        addresses[selected_address]
                    );
                    let tx = new EthereumTx({
                        chainId: this.get_chain_id(),
                        nonce: '0x' + nonce,
                        gasPrice: '0x' + gas_price.toString(16),
                        gasLimit: '0x' + gas_limit.times(2).toString(16),
                        to: pk_network.normalize_addr(dst_address),
                        value: '0x' + value.toString(16),
                        data: '0x' + (input == null ? '' : input.toString('hex'))
                    });
                    tx.sign(pk.privateKey);

                    let fee = gas_price.multipliedBy(gas_limit);

                    resolve(
                        new EthereumTxEstimation(
                            await ac.construct_Amount(
                                value.dividedBy(this.unit_to_atom),
                                this,
                                true
                            ),
                            await ac.construct_Amount(
                                fee.dividedBy(this.unit_to_atom),
                                this,
                                false
                            ),
                            await ac.construct_Amount(
                                value.plus(fee).dividedBy(this.unit_to_atom),
                                this,
                                true
                            ),
                            tx,
                            this,
                            relay
                        )
                    );
                    return;
                }
                reject(ErrorCode.ERROR_INSUFFICIENT_FUNDS);
            } catch (e) {
                reject(e);
            }
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
        value = value.multipliedBy(this.unit_to_atom);
        return this.estimate_tx_with_input(
            getter,
            addresses,
            dst_address,
            value,
            fee_weight,
            ac,
            relay,
            null,
            null,
            this
        );
    }

    to_TransactionRecord(app: Application, data: any): Promise<TransactionRecord> {
        return new Promise<TransactionRecord>(async (resolve, reject) => {
            let tx = <EthHistoryRecordResponse>data;

            let from = await app.get_wallet_from_address(this, tx.input);
            let to = await app.get_wallet_from_address(this, tx.output);
            let value = new BigNumber(tx.value).dividedBy(this.unit_to_atom);

            if (from != null) {
                //Transaction is an OUT transfer.
                resolve(
                    new TransactionRecord(
                        TransactionType.Transfer,
                        null,
                        await app.construct_Amount(value, this, false),
                        from,
                        new ExternalEthWallet(this, tx.output),
                        parseInt(tx.timestamp),
                        tx.txId
                    )
                );
                return;
            }
            if (to == null) {
                //What?
                resolve(
                    new TransactionRecord(
                        TransactionType.Transfer,
                        await app.construct_Amount(new BigNumber(0), this, false),
                        await app.construct_Amount(new BigNumber(0), this, false),
                        new ExternalEthWallet(this, '???'),
                        new ExternalEthWallet(this, '???'),
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
                    await app.construct_Amount(value, this, false),
                    null,
                    new ExternalEthWallet(this, tx.input),
                    to,
                    parseInt(tx.timestamp),
                    tx.txId
                )
            );
        });
    }

    get_comparer(a: string): (b: string) => boolean {
        let s = a.toLowerCase();
        return b => s == b.toLowerCase();
    }
}

export class EthCryptoNetwork extends BaseEthCryptoNetwork {
    constructor() {
        super(
            'ETH',
            'Ethereum',
            'ETH',
            CryptoNetworkType.ETH,
            false,
            'mellowallet/assets/coins/eth.png'
        );
    }

    protected get_network_id(): number {
        return 60;
    }

    protected get_chain_id(): number {
        return 1;
    }
}

export class EthRopstenCryptoNetwork extends BaseEthCryptoNetwork {
    constructor() {
        super(
            'ETH-Ropsten',
            'Ethereum Ropsten',
            'ROPSTEN',
            CryptoNetworkType.ETHRopsten,
            true,
            'mellowallet/assets/coins/eth.png'
        );
    }

    protected get_network_id(): number {
        return 1;
    }

    protected get_chain_id(): number {
        return 3;
    }
}

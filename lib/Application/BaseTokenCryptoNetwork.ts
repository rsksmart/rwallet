import {CryptoNetwork} from './CryptoNetwork';
import {CryptoNetworkType} from './CryptoNetworkType';
import {BaseEthCryptoNetwork} from './EthCryptoNetwork';
import {BigNumber} from 'bignumber.js';
import {PathKeyPair} from './PathKeyPair';
import {TxParamGetter, Utxo} from './TxParamGetter';
import {AbstractWallet, FeeWeight} from './Wallet';
import {Amount, AmountConstructor} from './Amount';
import {AbstractTxEstimation, TransactionRelay} from './TxEstimation';
import {ErrorCode} from './ErrorCodes';
import {SendTxResult} from './SendTxResult';
import {AbiCoder} from 'web3-eth-abi';
import {Application, EthHistoryRecordResponse} from './Application';
import {TransactionRecord, TransactionType} from './History';
import {SortCriterion} from './SortCriterion';
import {MyLogger} from './MyLogger';

let erc20Abi = JSON.parse(
    '[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]'
);

export class TokenTxEstimation extends AbstractTxEstimation {
    constructor(
        readonly parent: AbstractTxEstimation,
        amount: Amount
    ) {
        super(amount, parent.fees, parent.total);
    }

    confirm(): Promise<SendTxResult> {
        return this.parent.confirm();
    }
}

class ExternalTokenWallet implements AbstractWallet {
    private network: CryptoNetwork;
    private address: string;

    constructor(network: CryptoNetwork, address: string) {
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

export abstract class BaseTokenCryptoNetwork extends CryptoNetwork {
    private parent: BaseEthCryptoNetwork;

    constructor(
        parent: BaseEthCryptoNetwork,
        name: string,
        display_name: string,
        symbol: string,
        type: CryptoNetworkType,
        decimals: number,
        is_testnet: boolean,
        image: string
    ) {
        super(name, display_name, symbol, type, decimals, is_testnet, image);
        this.unit_to_atom = new BigNumber(10).pow(this.decimal_places);
        this.parent = parent;
    }

    generate_recovery_phrase(): Promise<string> {
        return this.parent.generate_recovery_phrase();
    }

    generate_master_from_recovery_phrase(phrase: string): Promise<string> {
        return this.parent.generate_master_from_recovery_phrase(phrase);
    }

    protected get_network_id(): number {
        return 1;
    }

    generate_root_node_from_master(s: string): Promise<PathKeyPair> {
        return this.parent.generate_root_node_from_master(s);
    }

    async derive_child_from_node(s: string, index: number): Promise<string> {
        return this.parent.derive_child_from_node(s, index);
    }

    derive_path_from_node(s: string, path: string): Promise<string> {
        return this.parent.derive_path_from_node(s, path);
    }

    get_address(s: string): Promise<string> {
        return this.parent.get_address(s);
    }

    get_tx_explorer_url(txid: string): string {
        return this.parent.get_tx_explorer_url(txid);
    }

    is_address_valid(addr: string): boolean {
        return this.parent.is_address_valid(addr);
    }

    private number_to_buffer(n: BigNumber): Buffer {
        return new Buffer(n.toString(16), 'hex');
    }

    abstract get_contract_address(): string;

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
            let input = new Buffer('', 'hex');
            let minimum_balance = value;
            value = new BigNumber(value).multipliedBy(this.unit_to_atom);
            let selected_address = -1;
            let first_address = 0;
            let selected_addresses: string[] = [];
            let gas_limits = new Map<string, BigNumber>();
            let contract_address = this.get_contract_address();
            for (let i = 0; i < addresses.length; i++) {
                let address = addresses[i];
                let balance = await getter.get_address_balance(this, address);
                if (balance.comparedTo(minimum_balance) < 0) continue;
                selected_addresses.push(address);
                try {
                    let gas_limit = await getter.estimate_gas_limit(
                        this,
                        address,
                        this.normalize_addr(dst_address),
                        value
                    );
                    gas_limits.set(address, gas_limit);
                } catch (e) {
                    reject(e);
                    return;
                }
            }
            if (selected_addresses.length == 0) {
                reject(ErrorCode.ERROR_INSUFFICIENT_FUNDS);
                return;
            }

            let abi: any = null;
            for (let i = 0; i < erc20Abi.length; i++) {
                if (erc20Abi[i].name == 'transfer') {
                    abi = erc20Abi[i];
                    break;
                }
            }
            if (abi == null) {
                reject('ABI not found');
                return;
            }

            let encoded = new AbiCoder().encodeFunctionCall(abi, [
                this.normalize_addr(dst_address),
                '0x' + value.toString(16)
            ]);
            MyLogger.debug(encoded);

            input = new Buffer(encoded.substr(2), 'hex');

            this.parent
                .estimate_tx_with_input(
                    getter,
                    selected_addresses,
                    contract_address,
                    new BigNumber(0),
                    fee_weight,
                    ac,
                    relay,
                    input,
                    gas_limits,
                    this
                )
                .then(async (netEstimate) => {
                    resolve(new TokenTxEstimation(
                        netEstimate,
                        await ac.construct_Amount(
                            value.dividedBy(this.unit_to_atom),
                            this,
                            true
                        )
                    ))
                })
                .catch(reject);
        });
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
                        new ExternalTokenWallet(this, tx.output),
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
                        new ExternalTokenWallet(this, '???'),
                        new ExternalTokenWallet(this, '???'),
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
                    new ExternalTokenWallet(this, tx.input),
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

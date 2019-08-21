import { CryptoNetwork } from './CryptoNetwork';
import { ErrorCode } from './ErrorCodes';
import { Amount } from './Amount';
import { BigNumber } from 'bignumber.js';
import { CryptoNetworkType } from './CryptoNetworkType';
import { PathKeyPair } from './PathKeyPair';
import { SHA3_NULL_S } from 'ethereumjs-util';
import { IStorage, DummyStorage } from './IStorage';
import { IStateSaver } from './Application';
import { SortCriterion } from './SortCriterion';
import { TransactionRecord } from './History';
import { AbstractTxEstimation } from './TxEstimation';
import { Application } from './Application';
import { MyLogger } from './MyLogger';

export enum WalletConstructorMode {
    Create,
    Derive,
    Restore
}

function empty_promise(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        resolve();
    });
}

interface ISerializedWallet {
    id: number;
    name: string;
    network: string | null;
    parent: number | null;
    private_key_name: string;
    recovery_phrase_name: string;
    global_root_node: PathKeyPair;
    local_root_node: PathKeyPair;
    subwallets: number;
    public_keys: PathKeyPair[];
    deleted: boolean;
}

export enum FeeWeight {
    Low = 'low',
    Normal = 'normal',
    High = 'high'
}

export interface AbstractWallet {
    get_id(): Promise<number>;

    get_name(): Promise<string>;

    set_name(value: string): Promise<void>;

    get_network(): Promise<string>;

    get_phrase(): Promise<string>;

    get_balance(): Promise<Amount>;

    get_addresses(): Promise<string[]>;

    generate_address(): Promise<string>;

    get_receive_address(): Promise<string>;

    estimate_tx(dst_address: string, value: string, fee: FeeWeight): Promise<AbstractTxEstimation>;

    get_history(
        page: number,
        page_size: number,
        criterion: SortCriterion
    ): Promise<TransactionRecord[]>;
}

export class Wallet implements AbstractWallet {
    private application: Application;
    private id: number = 0;
    private name: string = '';
    private network: CryptoNetwork | null = null;
    private parent: Wallet | null = null;
    private private_key_name: string = '';
    private recovery_phrase_name: string = '';
    private global_root_node: PathKeyPair = new PathKeyPair();
    private local_root_node: PathKeyPair = new PathKeyPair();
    private subwallets: number = 0;
    private public_keys: PathKeyPair[] = [];
    private storage: IStorage;
    private state_saver: IStateSaver;
    private recovery_phrase: string | null = null;
    public deleted = false;

    private constructor(application: Application, storage: IStorage, ss: IStateSaver) {
        this.application = application;
        this.storage = storage;
        this.state_saver = ss;
    }

    static create_wallet(
        application: Application,
        id: number,
        name: string,
        main_phrase_name: string | null,
        network: CryptoNetwork,
        storage: IStorage,
        ss: IStateSaver
    ): Promise<Wallet> {
        return new Promise<Wallet>((resolve, reject) => {
            let ret = new Wallet(application, storage, ss);
            ret.id = id;
            ret.name = name;
            ret.network = network;
            ret.set_key_names();
            ret.finish_initializing(null, main_phrase_name)
                .then(() => {
                    resolve(ret);
                })
                .catch(reject);
        });
    }

    static derive_wallet(parent: Wallet, id: number, name: string): Promise<Wallet> {
        return new Promise<Wallet>((resolve, reject) => {
            let ret = new Wallet(parent.application, parent.storage, parent.state_saver);
            ret.id = id;
            ret.name = name;
            ret.parent = parent;
            ret.network = ret.parent.network;
            ret.storage = ret.parent.storage;
            let root = ret.get_root_wallet();
            ret.private_key_name = root.private_key_name;
            ret.recovery_phrase_name = root.recovery_phrase_name;
            ret.finish_initializing(null, null)
                .then(() => {
                    resolve(ret);
                })
                .catch(reject);
        });
    }

    private generate_required_addresses(required_addresses: number[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                for (let i = 0; i < required_addresses.length; i++)
                    while (this.public_keys.length < required_addresses[i])
                        await this.generate_address();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    static restore_root_wallet(
        application: Application,
        id: number,
        phrase: string,
        recovery_phrase_name: string | null,
        name: string,
        network: CryptoNetwork,
        storage: IStorage,
        ss: IStateSaver,
        required_addresses: number[]
    ): Promise<Wallet> {
        return new Promise<Wallet>(async (resolve, reject) => {
            let ret = new Wallet(application, storage, ss);
            ret.id = id;
            ret.name = name;
            ret.network = network;
            ret.set_key_names();
            try {
                await ret.finish_initializing(phrase, recovery_phrase_name);
                await ret.generate_required_addresses(required_addresses);
                resolve(ret);
            } catch (e) {
                reject(e);
            }
        });
    }

    static restore_derived_wallet(
        application: Application,
        id: number,
        parent: Wallet,
        subwallet_index: number,
        name: string,
        required_addresses: number[]
    ): Promise<Wallet> {
        return new Promise<Wallet>(async (resolve, reject) => {
            let ret = new Wallet(parent.application, parent.storage, parent.state_saver);
            ret.id = id;
            ret.name = name;
            ret.parent = parent;
            ret.network = ret.parent.network;
            ret.storage = ret.parent.storage;
            let root = ret.get_root_wallet();
            ret.private_key_name = root.private_key_name;
            ret.recovery_phrase_name = root.recovery_phrase_name;
            ret.global_root_node = root.global_root_node;

            if (ret.network == null) {
                //Should never happen.
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }
            let index = subwallet_index;
            try {
                ret.local_root_node = new PathKeyPair(
                    ret.global_root_node.path + '/' + index,
                    await ret.network.derive_child_from_node(ret.global_root_node.public_key, index)
                );
                await ret.generate_required_addresses(required_addresses);
            } catch (e) {
                reject(e);
                return;
            }
            root.subwallets = Math.max(root.subwallets, subwallet_index);
            resolve(ret);
        });
    }

    static load_wallet(
        application: Application,
        serialized: string,
        loader: any,
        get_network: any,
        storage: IStorage,
        ss: IStateSaver
    ): Promise<Wallet> {
        return new Promise<Wallet>((resolve, reject) => {
            MyLogger.debug('Loading wallet: ' + serialized);
            let ret = new Wallet(application, storage, ss);
            let deserialized: ISerializedWallet = JSON.parse(serialized);
            ret.id = deserialized.id;
            ret.name = deserialized.name;
            ret.network = get_network(deserialized.network);
            if (!ret.network) {
                reject(ErrorCode.ERROR_UNKNOWN_NETWORK);
                return;
            }
            ret.parent = deserialized.parent == null ? null : loader(deserialized.parent);
            ret.private_key_name = deserialized.private_key_name;
            ret.recovery_phrase_name = deserialized.recovery_phrase_name;
            ret.global_root_node = deserialized.global_root_node;
            ret.local_root_node = deserialized.local_root_node;
            ret.subwallets = deserialized.subwallets;
            ret.public_keys = deserialized.public_keys;
            ret.deleted = deserialized.deleted;
            resolve(ret);
        });
    }

    private set_key_names() {
        this.private_key_name = 'wallet_' + this.id + '_private_key';
        this.recovery_phrase_name = 'wallet_' + this.id + '_recovery_phrase';
    }

    private finish_initializing(
        phrase: string | null,
        recovery_phrase_name: string | null
    ): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }

            try {
                let root = this.get_root_wallet();
                if (this.parent == null) {
                    if (!recovery_phrase_name) {
                        if (phrase == null) phrase = await this.network.generate_recovery_phrase();
                        this.recovery_phrase = phrase;
                        await this.storage.secure_set(this.recovery_phrase_name, phrase);
                    } else {
                        this.recovery_phrase_name = recovery_phrase_name;
                        phrase = await this.storage.secure_get(this.recovery_phrase_name);
                        if (phrase == null)
                            //Shouldn't happen.
                            phrase = await this.network.generate_recovery_phrase();
                    }
                    let master = await this.network.generate_master_from_recovery_phrase(phrase);
                    await this.storage.secure_set(this.private_key_name, master);
                    this.global_root_node = await this.network.generate_root_node_from_master(
                        master
                    );
                } else {
                    this.global_root_node = root.global_root_node;
                }
                MyLogger.debug(
                    'global_root_node ' +
                        this.global_root_node.path +
                        ' ' +
                        this.global_root_node.public_key
                );
                let index = root.subwallets++;
                this.local_root_node = new PathKeyPair(
                    this.global_root_node.path + '/' + index,
                    await this.network.derive_child_from_node(
                        this.global_root_node.public_key,
                        index
                    )
                );
                MyLogger.debug(
                    'local_root_node ' +
                        this.local_root_node.path +
                        ' ' +
                        this.local_root_node.public_key
                );
                //this.internal_generate_public_key();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    get_id(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            resolve(this.id);
        });
    }

    get_root_wallet(): Wallet {
        let current: Wallet = this;
        while (true) {
            if (current.parent == null) return current;
            current = current.parent;
        }
    }

    public get_recovery_phrase_name(): string {
        return this.recovery_phrase_name;
    }

    generate_child_public_key(index: number): Promise<PathKeyPair> {
        let pk = this.local_root_node;
        let path = pk.path + '/' + index;
        return new Promise<PathKeyPair>((resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }

            this.network
                .derive_child_from_node(pk.public_key, index)
                .then(async result => {
                    if (this.network)
                        MyLogger.debug(
                            'Generated key ' +
                                path +
                                ' ' +
                                result +
                                ' ' +
                                (await this.network.get_address(result))
                        );
                    resolve(new PathKeyPair(path, result));
                })
                .catch(reject);
        });
    }

    get_private_key(index: number): Promise<string> {
        let path = this.local_root_node.path + '/' + index;
        return new Promise<string>(async (resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }

            let prk = await this.storage.secure_get(this.private_key_name);
            if (prk == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }

            this.network
                .derive_path_from_node(prk, path)
                .then(resolve)
                .catch(reject);
        });
    }

    get_name(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            resolve(this.name);
        });
    }

    set_name(value: string): Promise<void> {
        this.name = value;
        return this.state_saver.save_state();
    }

    get_phrase(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.recovery_phrase != null) {
                let ret = this.recovery_phrase;
                this.recovery_phrase = null;
                resolve(ret);
                return;
            }
            this.storage
                .secure_get(this.recovery_phrase_name)
                .then(result => {
                    if (result == null) {
                        reject(ErrorCode.ERROR_VALUE_NOT_FOUND);
                        return;
                    }
                    resolve(result);
                })
                .catch(reject);
        });
    }

    get_network_object(): CryptoNetwork {
        if (this.network == null) throw new Error(ErrorCode.ERROR_INTERNAL);

        return this.network;
    }

    get_network(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }

            resolve(this.network.type.toString());
        });
    }

    get_balance_internal(): Promise<BigNumber> {
        return new Promise<BigNumber>(async (resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }
            this.application
                .get_addresses_balance(this.network, await this.get_addresses())
                .then(resolve)
                .catch(reject);
        });
    }

    get_balance(): Promise<Amount> {
        return new Promise<Amount>(async (resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }
            try {
                let balance = await this.application.get_addresses_balance(
                    this.network,
                    await this.get_addresses()
                );
                resolve(await this.application.construct_Amount(balance, this.network, false));
            } catch (e) {
                reject(e);
            }
        });
    }

    get_addresses(): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }

            let network: CryptoNetwork = this.network;
            let ret: string[] = [];
            for (let i = 0; i < this.public_keys.length; i++)
                ret.push(await network.get_address(this.public_keys[i].public_key));
            resolve(ret);
        });
    }

    get_receive_address(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }

            if (this.public_keys.length == 0) await this.internal_generate_public_key();

            let pks = this.public_keys;
            let pk = pks[pks.length - 1];
            let addr = await this.network.get_address(pk.public_key);
            resolve(addr);
        });
    }

    private async internal_generate_public_key(): Promise<void> {
        let index = this.public_keys.length;
        let pk: Promise<PathKeyPair>;
        pk = this.generate_child_public_key(index);
        this.public_keys.push(await pk);
        return this.state_saver.save_state();
    }

    async generate_address(): Promise<string> {
        await this.internal_generate_public_key();
        return this.get_receive_address();
    }

    serialize(): [number, string] {
        let o: any = {};
        return this.serialize_internal(o);
    }

    private serialize_internal(o: ISerializedWallet): [number, string] {
        o.id = this.id;
        o.name = this.name;
        if (this.network == null)
            //Should normally never happen.
            o.network = null;
        else o.network = this.network.name;
        if (this.parent == null) o.parent = null;
        else o.parent = this.parent.id;
        o.private_key_name = this.private_key_name;
        o.recovery_phrase_name = this.recovery_phrase_name;
        o.global_root_node = this.global_root_node;
        o.local_root_node = this.local_root_node;
        o.subwallets = this.subwallets;
        o.public_keys = this.public_keys;
        o.deleted = this.deleted;
        return [this.id, JSON.stringify(o)];
    }

    get_history(
        page: number,
        page_size: number,
        criterion: SortCriterion
    ): Promise<TransactionRecord[]> {
        return this.application.get_wallet_history(this, page, page_size, criterion);
    }

    estimate_tx(dst_address: string, value: string, fee: FeeWeight): Promise<AbstractTxEstimation> {
        return new Promise<AbstractTxEstimation>(async (resolve, reject) => {
            if (this.network == null) {
                reject(ErrorCode.ERROR_INTERNAL);
                return;
            }

            let p = this.network.estimate_tx(
                this.application,
                await this.get_addresses(),
                dst_address,
                new BigNumber(value),
                fee,
                this.application,
                this.application
            );

            p.then(resolve).catch(reject);
        });
    }

    delete(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.name = '';
            this.public_keys = [];
            this.deleted = true;
            this.application.save_state();
            resolve();
        });
    }
}

export class TxEstimation {}

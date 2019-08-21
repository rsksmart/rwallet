import { Wallet, WalletConstructorMode, FeeWeight } from './Wallet';
import { IStorage } from './IStorage';
import { CryptoNetworkList } from './CryptoNetworkList';
import { CryptoNetwork } from './CryptoNetwork';
import { BtcCryptoNetwork, BtcTestnetCryptonetwork } from './BtcCryptoNetwork';
import { EthCryptoNetwork, EthRopstenCryptoNetwork } from './EthCryptoNetwork';
import { DaiCryptoNetwork, DaiRopstenCryptoNetwork } from './DaiCryptoNetwork';
import { RskCryptoNetwork, RskTestnetCryptoNetwork } from './RskCryptoNetwork';
import { CryptoNetworkType } from './CryptoNetworkType';
import { ErrorCode } from './ErrorCodes';
import { PathKeyPair } from './PathKeyPair';
import { Exchange } from './Exchange';
import { Changelly } from './Changelly';
import { TransactionRecord, TransactionType } from './History';
import { SortCriterion } from './SortCriterion';
import { Amount, AmountConstructor } from './Amount';
import BigNumber from 'bignumber.js';
import { TxParamGetter, AddressUtxo, TransactionParameters } from './TxParamGetter';
import { TransactionRelay } from './TxEstimation';
import { set_generate_secure_random } from './mnemonic';
import { createHash } from 'crypto';
import { RifCryptoNetwork, RifTestnetCryptoNetwork } from './RifCryptoNetwork';
import { Logger, MyLogger } from './MyLogger';

export interface IStateSaver {
    save_state(): Promise<void>;
}

type HttpSimpleGetRequest = (url: string) => Promise<any>;
type HttpSimplePutPostRequest = (url: string, body: string) => Promise<any>;
export type GenerateSecureRandom = (length: number) => Promise<string>;

interface AddressBalance {
    addr: string;
    quantity: string;
}

interface ExternalJsInterface {
    get: HttpSimpleGetRequest;
    put: HttpSimplePutPostRequest;
    post: HttpSimplePutPostRequest;
    rand: GenerateSecureRandom;
    getServerUrl: () => string;
    getLogger: () => Logger;
}

function clone_array<T>(arr: T[]): T[] {
    let ret: T[] = [];
    arr.forEach(x => ret.push(x));
    return ret;
}

function clone_array_if<T>(arr: T[], condition: (x: T) => boolean): T[] {
    let ret: T[] = [];
    arr.forEach(x => {
        if (condition(x)) ret.push(x);
    });
    return ret;
}

class CachedRatio {
    ratio: number;
    fetch_time: number;

    constructor(ratio: number, fetch_time: number) {
        this.ratio = ratio;
        this.fetch_time = fetch_time;
    }
}

export class PortfolioElement {
    currency: string = '';
    balance: number;
    change: number;

    constructor(balance: number, change: number) {
        this.balance = balance;
        this.change = change;
    }
}

export class Portfolio {
    total: PortfolioElement = new PortfolioElement(0, 0);
    currencies: PortfolioElement[] = [];
}

interface GenericHistoryRecordResponse {
    coin: string;
    txId: string;
    blockHash: string;
    blockNumber: string;
    timestamp: string;
}

export interface EthHistoryRecordResponse {
    coin: string;
    txId: string;
    blockHash: string;
    blockNumber: string;
    timestamp: string;
    input: string;
    output: string;
    value: string;
}

export interface BtcHistoryRecordResponseInputOutput {
    address: string;
    value: string;
}

export interface BtcHistoryRecordResponse {
    coin: string;
    txId: string;
    blockHash: string;
    blockNumber: string;
    timestamp: string;
    input: BtcHistoryRecordResponseInputOutput[];
    output: BtcHistoryRecordResponseInputOutput[];
}

class NetworkPathKey {
    network: string;
    node: PathKeyPair;

    constructor(network: string, node: PathKeyPair) {
        this.network = network;
        this.node = node;
    }
}

class RecoveredWallet {
    subwallet_index: number;
    used_addresses: number[];

    constructor(subwallet_index: number, used_addresses: number[]) {
        this.subwallet_index = subwallet_index;
        this.used_addresses = used_addresses;
    }
}

class RecoveredNetwork {
    network: string;
    wallets: RecoveredWallet[];

    constructor(network: string, wallets: RecoveredWallet[]) {
        this.network = network;
        this.wallets = wallets;
    }
}

class RecoverWalletsParameter {
    data: NetworkPathKey[];

    constructor(data: NetworkPathKey[]) {
        this.data = data;
    }
}

export class Application
    implements IStateSaver, TxParamGetter, AmountConstructor, TransactionRelay {
    private networks: CryptoNetworkList = new CryptoNetworkList();
    private wallets: Wallet[] = [];
    private storage: IStorage;
    private next_wallet_id: number = 0;
    private exchanges: Exchange[] = [];
    private display_currency: string = 'USD';
    private external_js_interface: ExternalJsInterface;
    private main_phrase_name: string | null = null;
    private server_url: string;

    constructor(storage: IStorage, external_js_interface: ExternalJsInterface) {
        this.storage = storage;
        this.external_js_interface = external_js_interface;
        set_generate_secure_random(this.external_js_interface.rand);
        this.networks.add(new BtcCryptoNetwork());
        this.networks.add(new EthCryptoNetwork());
        this.networks.add(new DaiCryptoNetwork());
        this.networks.add(new RskCryptoNetwork());
        this.networks.add(new RifCryptoNetwork());

        this.networks.add(new BtcTestnetCryptonetwork());
        this.networks.add(new EthRopstenCryptoNetwork());
        this.networks.add(new DaiRopstenCryptoNetwork());
        this.networks.add(new RskTestnetCryptoNetwork());
        this.networks.add(new RifTestnetCryptoNetwork());

        this.exchanges.push(new Changelly(this));
        this.server_url = external_js_interface.getServerUrl();
        MyLogger.setLogger(external_js_interface.getLogger());
        MyLogger.debug('LIBRARY INITIALIZED!!!');
    }

    async initialize(): Promise<void> {
        MyLogger.debug('Library initialized');
        if (!(await this.load_wallets())) this.wallets = [];
    }

    get_wallets(): Promise<Wallet[]> {
        return new Promise<Wallet[]>((resolve, reject) =>
            resolve(clone_array_if(this.wallets, x => !x.deleted))
        );
    }

    get_wallet_by_id(id: string): Promise<Wallet> {
        return new Promise<Wallet>(async (resolve, reject) => {
            for (let i = 0; i < this.wallets.length; i++) {
                if (this.wallets[i].deleted) continue;
                if ((await this.wallets[i].get_id()).toString() == id) {
                    resolve(this.wallets[i]);
                    return;
                }
            }
            reject(ErrorCode.ERROR_WALLET_NOT_FOUND);
        });
    }

    create_wallet(name: string, network: string): Promise<Wallet> {
        return new Promise<Wallet>(async (resolve, reject) => {
            let net = this.networks.find(network);
            if (net == null) {
                reject(ErrorCode.ERROR_UNKNOWN_NETWORK);
                return;
            }

            let wallet: Wallet | null = null;

            for (let i: number = 0; i < this.wallets.length; i++) {
                if (this.wallets[i].get_network_object().type != net.type) continue;
                let root = this.wallets[i].get_root_wallet();
                wallet = await Wallet.derive_wallet(root, this.next_wallet_id++, name);
                break;
            }

            if (wallet == null) {
                wallet = await Wallet.create_wallet(
                    this,
                    this.next_wallet_id++,
                    name,
                    this.main_phrase_name,
                    net,
                    this.storage,
                    this
                );
                if (!this.main_phrase_name)
                    this.main_phrase_name = wallet.get_recovery_phrase_name();
            }

            this.wallets.push(wallet);
            await this.save_state();
            resolve(wallet);
        });
    }

    wallet_from_phrase(phrase: string, network: string, set_global_phrase: boolean): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                let networks = await this.networks.get_list();
                let nodes: NetworkPathKey[] = [];
                for (let i = 0; i < networks.length; i++) {
                    let network = networks[i];
                    let master = await network.generate_master_from_recovery_phrase(phrase);
                    let global_root_node = await network.generate_root_node_from_master(master);
                    nodes.push(new NetworkPathKey(network.name, global_root_node));
                }

                let response = await this.server_post_request(
                    '/recoverWallet',
                    JSON.stringify(new RecoverWalletsParameter(nodes))
                );
                let recovered_networks = <RecoveredNetwork[]>JSON.parse(response);
                for (let i = 0; i < recovered_networks.length; i++) {
                    let rn = recovered_networks[i];
                    let network = this.networks.find(rn.network);
                    if (network == null || rn.wallets.length == 0) continue;
                    let subwallets = rn.wallets.sort(
                        (x, y) => x.subwallet_index - y.subwallet_index
                    );
                    let create_main = subwallets[0].subwallet_index != 0;
                    let root_wallet: Wallet | null = null;
                    if (create_main) {
                        let mfn: string | null = set_global_phrase ? this.main_phrase_name : null;
                        root_wallet = await Wallet.restore_root_wallet(
                            this,
                            this.next_wallet_id++,
                            phrase,
                            mfn,
                            '',
                            network,
                            this.storage,
                            this,
                            []
                        );
                        this.wallets.push(root_wallet);
                        if (set_global_phrase && !this.main_phrase_name)
                            this.main_phrase_name = root_wallet.get_recovery_phrase_name();
                    }

                    for (let j = 0; j < rn.wallets.length; j++) {
                        let new_wallet: Wallet | null = null;
                        if (root_wallet == null) {
                            let mfn: string | null = set_global_phrase
                                ? this.main_phrase_name
                                : null;
                            new_wallet = root_wallet = await Wallet.restore_root_wallet(
                                this,
                                this.next_wallet_id++,
                                phrase,
                                mfn,
                                '',
                                network,
                                this.storage,
                                this,
                                subwallets[j].used_addresses
                            );
                            if (set_global_phrase && !this.main_phrase_name)
                                this.main_phrase_name = root_wallet.get_recovery_phrase_name();
                        } else
                            new_wallet = await Wallet.restore_derived_wallet(
                                this,
                                this.next_wallet_id++,
                                root_wallet,
                                subwallets[j].subwallet_index,
                                '',
                                subwallets[j].used_addresses
                            );
                        this.wallets.push(new_wallet);
                    }
                }

                if (set_global_phrase && !this.main_phrase_name) {
                    MyLogger.warn('Could not recover any wallets. Saving recovery phrase.');
                    this.main_phrase_name = 'main_phrase_name';
                    await this.storage.secure_set(this.main_phrase_name, phrase);
                }

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    state_string_name: string = 'mellowallet_state';

    save_state(): Promise<void> {
        let state: any = {};
        state.next_wallet_id = this.next_wallet_id;
        let wallets: { [id: number]: string } = {};
        for (let i = 0; i < this.wallets.length; i++) {
            let kv = this.wallets[i].serialize();
            wallets[kv[0]] = kv[1];
        }
        state.wallets = wallets;
        state.main_phrase_name = this.main_phrase_name;
        let stringified = JSON.stringify(state);
        return this.storage.set(this.state_string_name, stringified);
    }

    private async load_wallets(): Promise<boolean> {
        try {
            let value = await this.storage.get(this.state_string_name);
            if (value == null) return false;
            MyLogger.debug('Loaded state: ' + value);
            let state = JSON.parse(value);
            this.next_wallet_id = state.next_wallet_id;
            this.main_phrase_name = state.main_phrase_name;
            let wallets: { [id: number]: string } = state.wallets;
            let loaded_wallets: { [id: number]: Wallet } = {};

            let get_network: any = (name: string) => {
                return this.networks.find(name);
            };

            let loader: any = async (id: number): Promise<Wallet> => {
                if (loaded_wallets[id]) return loaded_wallets[id];
                let pushee = await Wallet.load_wallet(
                    this,
                    wallets[id],
                    loader,
                    get_network,
                    this.storage,
                    this
                );
                loaded_wallets[id] = pushee;
                this.wallets.push(pushee);
                return pushee;
            };

            for (const key in wallets) await loader(key);

            return true;
        } catch (e) {
            return false;
        }
    }

    get_networks(): Promise<CryptoNetwork[]> {
        return this.networks.get_list();
    }

    get_network(id: string): Promise<CryptoNetwork> {
        return new Promise<CryptoNetwork>((resolve, reject) => {
            let ret = this.networks.find(id);
            if (ret == null) {
                reject(ErrorCode.ERROR_UNKNOWN_NETWORK);
                return;
            }
            resolve(ret);
        });
    }

    get_exchanges(): Promise<Exchange[]> {
        return new Promise<Exchange[]>((resolve, reject) => {
            let ret: Exchange[] = [];
            this.exchanges.forEach(w => ret.push(w));
            resolve(ret);
        });
    }

    private history_page_size = 10;

    get_history(
        page: number,
        page_size: number,
        criterion: SortCriterion
    ): Promise<TransactionRecord[]> {
        return new Promise<TransactionRecord[]>(async (resolve, reject) => {
            try {
                let skip = page * this.history_page_size;
                let take = this.history_page_size;
                let coins = new Map<string, string[]>();
                for (let i = 0; i < this.wallets.length; i++) {
                    let wallet = this.wallets[i];
                    let addrs = await wallet.get_addresses();
                    let net = wallet.get_network_object().name;
                    let found = coins.get(net);
                    let list: string[] = [];
                    if (found == undefined) coins.set(net, list);
                    else list = found;
                    addrs.forEach(x => list.push(x));
                }
                let request_object: any = {};
                request_object.skip = skip;
                request_object.take = take;
                request_object.data = [];
                coins.forEach((v, k) => {
                    request_object.data.push({
                        coin: k,
                        addrs: v
                    });
                });

                let response = await this.server_post_request(
                    '/getGlobalTransactionHistory',
                    JSON.stringify(request_object)
                );
                let parsed = <any[]>JSON.parse(response);
                let promises: Promise<TransactionRecord>[] = [];
                for (let i = 0; i < parsed.length; i++) {
                    let generic = <GenericHistoryRecordResponse>parsed[i];
                    let net = this.networks.find(generic.coin);
                    if (!net) continue;
                    promises.push(net.to_TransactionRecord(this, parsed[i]));
                }
                let ret = await Promise.all(promises);
                resolve(ret);
            } catch (e) {
                reject(e);
            }
        });
    }

    get_wallet_history(
        wallet: Wallet,
        page: number,
        page_size: number,
        criterion: SortCriterion
    ): Promise<TransactionRecord[]> {
        return new Promise<TransactionRecord[]>(async (resolve, reject) => {
            try {
                var addresses = (await wallet.get_addresses()).join(',');
                let skip = page * this.history_page_size;
                let take = this.history_page_size;
                let net = wallet.get_network_object();
                let url =
                    '/getTransactionHistory?' +
                    'sort=desc' +
                    '&addresses=' +
                    addresses +
                    '&' +
                    'coin=' +
                    net.name +
                    '&' +
                    'skip=' +
                    skip +
                    '&' +
                    'take=' +
                    take;
                let response = await this.server_get_request(url);
                let parsed = <any[]>JSON.parse(response);
                let promises: Promise<TransactionRecord>[] = [];
                for (let i = 0; i < parsed.length; i++) {
                    promises.push(net.to_TransactionRecord(this, parsed[i]));
                }
                let ret = await Promise.all(promises);
                resolve(ret);
            } catch (e) {
                reject(e);
            }
        });
    }

    private ratio_cache = new Map<string, CachedRatio>();
    private cache_timeout = 5 * 60; //5 minutes

    get_currency_ratio(from: string, to: string): Promise<number> {
        let ratio_name = from + ',' + to;
        let cached = this.ratio_cache.get(ratio_name);
        if (cached != undefined) {
            let now = Date.now() / 1000;
            let ratio = cached.ratio;
            if (now - cached.fetch_time < this.cache_timeout)
                return new Promise<number>((resolve, reject) => resolve(ratio));
        }
        return this.server_get_request('/getCurrencyPrice?fromCoin=' + from + '&toCoin=' + to).then(
            x => {
                let now = Date.now() / 1000;
                let ratio = parseFloat(x);
                this.ratio_cache.set(ratio_name, new CachedRatio(ratio, now));
                return ratio;
            }
        );
    }

    private currency_conversion_internal(
        amount: BigNumber,
        src_network: string,
        dst_network: string
    ): Promise<BigNumber> {
        return new Promise<BigNumber>(async (resolve, reject) => {
            let dst_decimal: number = 0;

            let inverted = false;
            let src = this.networks.find(src_network);
            if (src == null) {
                inverted = true;
                src = this.networks.find(dst_network);
                if (src == null) {
                    reject(ErrorCode.ERROR_UNKNOWN_NETWORK);
                    return;
                }
            }
            let dst = this.networks.find(!inverted ? dst_network : src_network);
            if (dst == null) {
                if (this.fiat_currencies.indexOf(!inverted ? dst_network : src_network) < 0) {
                    reject(ErrorCode.ERROR_UNKNOWN_NETWORK);
                    return;
                }
                dst_decimal = 4;
            }

            if (src && dst) {
                try {
                    amount = await this.currency_conversion_internal(amount, src_network, 'USD');
                } catch (e) {
                    reject(e);
                    return;
                }
                this.currency_conversion_internal(amount, 'USD', dst_network)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            let ratio = 0;

            try {
                let p = !inverted
                    ? this.get_currency_ratio(src_network, dst_network)
                    : this.get_currency_ratio(dst_network, src_network);
                ratio = (await p) * Math.pow(10, -dst_decimal);
            } catch (e) {
                reject(e);
                return;
            }

            if (inverted) ratio = 1.0 / ratio;

            MyLogger.debug(src_network + ' -> ' + dst_network + ' = ' + ratio);

            let result = amount.multipliedBy(ratio);

            let destination_crypto = this.networks.find(dst_network);
            if (destination_crypto)
                result = new BigNumber(
                    result.multipliedBy(destination_crypto.unit_to_atom).toFixed(0)
                ).dividedBy(destination_crypto.unit_to_atom);

            resolve(result);
        });
    }

    currency_conversion(amount: string, src_network: string, dst_network: string): Promise<string> {
        return this.currency_conversion_internal(
            new BigNumber(amount),
            src_network,
            dst_network
        ).then(x => x.toString());
    }

    is_address_valid(address: string, network: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let net = this.networks.find(network);
            if (net == null) {
                reject(ErrorCode.ERROR_UNKNOWN_NETWORK);
                return;
            }

            resolve(net.is_address_valid(address));
        });
    }

    set_display_currency(symbol: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            symbol = symbol.toUpperCase();
            let found = false;
            this.fiat_currencies.forEach(x => (found = found || x === symbol));
            if (found) {
                this.display_currency = symbol;
                resolve();
            } else reject(ErrorCode.ERROR_UNSUPPORTED_CURRENCY);
        });
    }

    get_display_currency(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            resolve(this.display_currency);
        });
    }

    private fiat_currencies = ['USD', 'EUR', 'JPY', 'GBP'];

    get_fiat_currencies(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            resolve(clone_array(this.fiat_currencies));
        });
    }

    private get_http(url: string): Promise<string> {
        MyLogger.debug('sending request to: ' + url);
        return this.external_js_interface.get(url).then(async x => {
            let ret = await x.text();
            MyLogger.debug('Result for ' + url + ': ', ret);
            return ret;
        });
    }

    server_get_request(path: string): Promise<string> {
        return this.get_http(this.server_url + path);
    }

    private put_http(url: string, body: string): Promise<string> {
        MyLogger.debug('sending PUT request to: ' + url);
        return this.external_js_interface.put(url, body).then(x => x.text());
    }

    server_put_request(path: string, body: string): Promise<string> {
        return this.put_http(this.server_url + path, body);
    }

    private post_http(url: string, body: string): Promise<string> {
        MyLogger.debug('sending POST request to: ' + url);
        MyLogger.debug('POST body: ' + body);
        return this.external_js_interface.post(url, body).then(x => x.text());
    }

    server_post_request(path: string, body: string): Promise<string> {
        return this.post_http(this.server_url + path, body);
    }

    get_portfolio(): Promise<Portfolio> {
        return new Promise<Portfolio>(async (resolve, reject) => {
            try {
                let changes_p = this.get_price_variation();
                let balances = new Map<string, number>();
                let total_balance: number = 0;
                for (let i = 0; i < this.wallets.length; i++) {
                    let wallet = this.wallets[i];
                    let network = wallet.get_network_object();
                    let old_balance = balances.get(network.name);
                    let balance = parseFloat((await wallet.get_balance()).fiat_value);
                    total_balance += balance;
                    let new_balance = old_balance == undefined ? balance : old_balance + balance;
                    balances.set(network.name, new_balance);
                }

                let changes = await changes_p;

                let ret = new Portfolio();
                let total_change: number = 0;

                changes.forEach((change, net) => {
                    let balance = balances.get(net);
                    if (!balance) return;
                    let element = new PortfolioElement(balance, balance != 0 ? change * 100 : 0);
                    element.currency = net;
                    ret.currencies.push(element);
                    if (total_balance != 0) total_change += (balance / total_balance) * change;
                });
                ret.total.balance = total_balance;
                ret.total.change = total_change * 100;
                ret.total.currency = 'total';
                MyLogger.debug('get_portfolio() = ' + JSON.stringify(ret));
                resolve(ret);
            } catch (e) {
                reject(e);
            }
        });
    }

    //TxParamGetter
    get_transaction_parameters(
        network: CryptoNetwork,
        addresses: string[]
    ): Promise<TransactionParameters> {
        if (addresses.length == 0)
            return new Promise<TransactionParameters>((resolve, reject) =>
                resolve(TransactionParameters.construct_empty())
            );

        return this.server_get_request(
            '/getTransactionParams?addresses=' + addresses.join(',') + '&coin=' + network.name
        ).then(x => TransactionParameters.from_json(network, x));
    }

    get_private_key(network: CryptoNetwork, address: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            for (let i = 0; i < this.wallets.length; i++) {
                let wallet = this.wallets[i];
                if (wallet.get_network_object().type != network.type) continue;
                let addresses = await wallet.get_addresses();
                for (let j = 0; j < addresses.length; j++) {
                    let address2 = addresses[j];
                    if (address2 != address) continue;
                    wallet
                        .get_private_key(j)
                        .then(resolve)
                        .catch(reject);
                    return;
                }
            }
            reject(ErrorCode.ERROR_PRIVATE_KEY_NOT_FOUND);
        });
    }

    get_addresses_balance(network: CryptoNetwork, addresses: string[]): Promise<BigNumber> {
        if (addresses.length == 0)
            return new Promise<BigNumber>((resolve, reject) => resolve(new BigNumber(0)));
        let divisor = new BigNumber(network.base).pow(network.decimal_places);
        return this.server_get_request(
            '/getBalance?addresses=' + addresses.join(',') + '&coin=' + network.name
        )
            .then(x => new BigNumber(x).dividedBy(divisor))
            .catch(x => new BigNumber(NaN));
    }

    get_addresses_balances(network: CryptoNetwork, addresses: string[]): Promise<BigNumber[]> {
        if (addresses.length == 0)
            return new Promise<BigNumber[]>((resolve, reject) => resolve([]));
        let url = '/getBalances?addresses=' + addresses.join(',') + '&coin=' + network.name;
        return this.server_get_request(url).then(response => {
            let map = new Map<string, string>();
            let array = <AddressBalance[]>JSON.parse(response);
            for (let i = 0; i < array.length; i++) map.set(array[i].addr, array[i].quantity);
            let ret: BigNumber[] = [];
            for (let i = 0; i < addresses.length; i++) {
                let val = map.get(addresses[i]);
                ret.push(val == undefined ? new BigNumber(0) : new BigNumber(val));
            }
            return ret;
        });
    }

    get_address_balance(network: CryptoNetwork, address: string): Promise<BigNumber> {
        return this.get_addresses_balance(network, [address]);
    }

    estimate_gas_limit(
        network: CryptoNetwork,
        from: string,
        to: string,
        value: BigNumber
    ): Promise<BigNumber> {
        let url =
            '/getTransferGas?coin=' +
            network.name +
            '&from=' +
            from +
            '&to=' +
            to +
            '&quantity=' +
            value.toString();
        return this.server_get_request(url).then(x => new BigNumber(x));
    }

    resolve_name_from_addr(network: CryptoNetwork, name: string): Promise<string> {
        let url = '/resolveName?name=' + name + '&coin=' + network.name;
        return this.server_get_request(url);
    }

    //AmountConstructor
    construct_Amount(value: BigNumber, network: CryptoNetwork, rounding: boolean): Promise<Amount> {
        return new Promise<Amount>(async (resolve, reject) => {
            try {
                let ret = new Amount();

                if (rounding) {
                    let fiat_unit = parseFloat(
                        await this.currency_conversion('1', network.type.toString(), 'USD')
                    );
                    let fiat_digits = Math.floor(Math.log10(fiat_unit) + 1) + 2;
                    if (fiat_digits > 0) {
                        let power = new BigNumber(10).pow(fiat_digits);
                        value = value
                            .multipliedBy(power)
                            .integerValue()
                            .dividedBy(power);
                    }
                }

                ret.fiat_value = await this.currency_conversion(
                    value.toString(),
                    network.type.toString(),
                    this.display_currency
                );
                ret.value = value.toString();
                ret.unit = network.symbol;
                ret.fiat_unit = this.display_currency;
                resolve(ret);
            } catch (e) {
                reject(e);
            }
        });
    }

    //TransactionRelay
    relay_transaction(
        network: CryptoNetwork,
        raw_transaction: Buffer,
        txid: string | null
    ): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                let response = await this.server_post_request(
                    '/sendRawTransaction?coin=' + network.name,
                    JSON.stringify({ tx: raw_transaction.toString('hex') })
                );
                MyLogger.debug('relay_transaction result: ' + response);
                let parsed = JSON.parse(response);
                if (parsed.error) {
                    reject({ error_code: 500, error_message: parsed.message });
                    return;
                }
                resolve(parsed.tx);
            } catch (e) {
                reject(e);
            }
        });
    }

    get_wallet_from_address(network: CryptoNetwork, address: string): Promise<Wallet | null> {
        return new Promise<Wallet | null>(async (resolve, reject) => {
            let equals = network.get_comparer(address);
            for (let i = 0; i < this.wallets.length; i++) {
                let wallet = this.wallets[i];
                if (wallet.get_network_object().type != network.type) continue;
                let addresses = await wallet.get_addresses();
                for (let j = 0; j < addresses.length; j++) {
                    let address2 = addresses[j];
                    if (!equals(address2)) continue;
                    resolve(wallet);
                    return;
                }
            }
            resolve(null);
        });
    }

    get_price_variation(): Promise<Map<string, number>> {
        return new Promise<Map<string, number>>(async (resolve, reject) => {
            try {
                let ret = new Map<string, number>();
                let response = await this.server_get_request('/getPriceVariation');
                let data = JSON.parse(response);
                for (let key in data) ret.set(key, parseFloat(data[key]) / 100);
                resolve(ret);
            } catch (e) {
                reject(e);
            }
        });
    }
}

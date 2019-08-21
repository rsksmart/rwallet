"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef,indent,object-curly-spacing,camelcase,no-unused-vars,arrow-body-style */
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const Application_1 = require("./Application");
const SortCriterion_1 = require("./SortCriterion");
const Wallet_1 = require("./Wallet");
class LoggingStorage {
    constructor() {
        this.secure_storage = {};
        this.storage = {};
    }
    secure_set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            // Promise<void>
            console.log('LoggingStorage secure_set', key, value);
            this.secure_storage[key] = value;
        });
    }
    secure_get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // Promise<string | null>,
            console.log('LoggingStoragesecure_get', key);
            return this.secure_storage[key];
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            // Promise<void>
            console.log('LoggingStorage set', key, value);
            this.storage[key] = value;
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // Promise < string | null >
            console.log('LoggingStorage get', key);
            return this.storage[key];
        });
    }
}
exports.LoggingStorage = LoggingStorage;
class LoggingJSInterface {
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('LoggingJSInterface get', url);
            return {
                text: () => JSON.stringify(1)
            };
        });
    }
    put(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Promise < any >
            console.log('LoggingJSInterface put', url, body);
            return null;
        });
    }
    post(url, body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Promise < any >
            console.log('LoggingJSInterface post', url, body);
            return null;
        });
    }
    rand(length) {
        return __awaiter(this, void 0, void 0, function* () {
            // Promise < string >
            console.log('LoggingJSInterface rand', length);
            return 'X'.repeat(length);
        });
    }
    getServerUrl() {
        return 'NOTHING';
    }
    getLogger() {
        return {
            debug: (...args) => {
                console.log(...args);
            },
            info: (...args) => {
                console.warn(...args);
            },
            warn: (...args) => {
                console.warn(...args);
            },
            error: (...args) => {
                console.error(...args);
            }
        };
    }
}
exports.LoggingJSInterface = LoggingJSInterface;
describe('Application', () => {
    test('create wallet', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        yield expect(yield app.get_wallets()).toEqual([]);
        yield expect(yield app.get_wallets()).toEqual([]);
        const w1 = yield app.create_wallet('test1', 'BTC');
        yield expect(yield app.get_wallets()).toEqual([w1]);
        const w2 = yield app.create_wallet('test2', 'BTC');
        yield expect(yield app.get_wallets()).toEqual([w1, w2]);
        const w3 = yield app.create_wallet('test3', 'ETH');
        yield expect(yield app.get_wallets()).toEqual([w1, w2, w3]);
        done();
    }));
    test('get networks', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        const networks = yield app.get_networks();
        // eslint-disable-next-line no-restricted-syntax
        for (const n of networks) {
            // eslint-disable-next-line no-await-in-loop
            yield expect(yield app.get_network(n.name)).toEqual(n);
        }
        done();
    }));
    /*
    test('get exchanges', async (done) => {
        const app = new Application(new LoggingStorage(), new LoggingJSInterface());
        await app.initialize();
        await expect(await app.get_exchanges()).toEqual([]);
        done();
    });
     */
    test('get history', (done) => __awaiter(this, void 0, void 0, function* () {
        let addr;
        const txHash = 'b35768dded0fe57b7ebdf89ccab6b2023a04a5d63312847a0ae899d73ae2a72c';
        const app = new Application_1.Application(new LoggingStorage(), new (class B extends LoggingJSInterface {
            post(url, body) {
                const _super = Object.create(null, {
                    post: { get: () => super.post }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    _super.post.call(this, url, body);
                    // getGlobalTransactionHistory
                    yield expect(JSON.parse(body)).toEqual(expect.objectContaining({
                        skip: 10,
                        take: 10,
                        data: [expect.objectContaining({ coin: 'BTC', addrs: [addr] })]
                    }));
                    return {
                        text: () => JSON.stringify([
                            {
                                coin: 'BTC',
                                txId: txHash,
                                blockHash: '0000000000000000002fcf201c6cee031b7ef9883a757c22f1d1417dee504173',
                                blockNumber: 0,
                                timestamp: 1502930925,
                                input: [],
                                output: [
                                    {
                                        address: addr,
                                        value: '1418168301'
                                    },
                                    {
                                        value: '0'
                                    }
                                ]
                            }
                        ])
                    };
                });
            }
        })());
        yield app.initialize();
        const w1 = yield app.create_wallet('test1', 'BTC');
        addr = yield w1.get_receive_address();
        yield expect(yield app.get_history(1, 10, SortCriterion_1.SortCriterion.NewestFirst)).toEqual(expect.arrayContaining([
            expect.objectContaining({
                tx_hash: txHash
            })
        ]));
        done();
    }));
    test('get_wallet_history', (done) => __awaiter(this, void 0, void 0, function* () {
        let addr;
        const txHash = 'd5b05457f3b39a62b63c07aec3fcb6311a67b1c473ba238de1f755c9d3515352';
        const app = new Application_1.Application(new LoggingStorage(), new (class B extends LoggingJSInterface {
            get(url) {
                const _super = Object.create(null, {
                    get: { get: () => super.get }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    _super.get.call(this, url);
                    if (url.indexOf('getTransactionHistory') > 0) {
                        return {
                            text: () => JSON.stringify([
                                {
                                    txId: txHash,
                                    blockHash: '0000000000000d77f19ae32d2e43c756da82df6aa5536aa16743d263e1e63d72',
                                    blockNumber: 0,
                                    timestamp: 1539253517,
                                    input: [],
                                    output: [
                                        {
                                            address: '2N87LbvMZi6sECrLdNBhKAPY5QB4HVjkenU',
                                            value: '78757945'
                                        },
                                        {
                                            value: '0'
                                        }
                                    ]
                                }
                            ])
                        };
                    }
                    return {
                        text: () => JSON.stringify(1)
                    };
                });
            }
        })());
        const w1 = yield app.create_wallet('test1', 'BTC');
        yield expect(yield app.get_wallet_history(w1, 1, 10, SortCriterion_1.SortCriterion.NewestFirst)).toEqual(expect.arrayContaining([
            expect.objectContaining({
                type: 'transfer',
                input: {
                    value: '0',
                    unit: 'BTC',
                    fiat_value: '0',
                    fiat_unit: 'USD'
                },
                output: {
                    value: '0',
                    unit: 'BTC',
                    fiat_value: '0',
                    fiat_unit: 'USD'
                },
                timestamp: expect.any(Number),
                tx_hash: txHash
            })
        ]));
        done();
    }));
    test('get_currency_ratio', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        yield expect(yield app.get_currency_ratio('BTC', 'USD')).toEqual(1);
        done();
    }));
    test('currency_conversion', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        yield expect(yield app.currency_conversion('123', 'BTC', 'USD')).toEqual('0.0123');
        done();
    }));
    test('currency_conversion', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        yield expect(yield app.currency_conversion('123', 'BTC', 'USD')).toEqual('0.0123');
        done();
    }));
    test('is_address_valid', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        yield expect(yield app.is_address_valid('a', 'BTC')).toBe(false);
        yield expect(yield app.is_address_valid('2N87LbvMZi6sECrLdNBhKAPY5QB4HVjkenU', 'BTC')).toBe(true);
        yield expect(yield app.is_address_valid('2N87LbvMZi6sECrLdNBhKAPY5QB4HVjkenU', 'BTC-Testnet')).toBe(true);
        yield expect(yield app.is_address_valid('0xea674fdde714fd979de3edf0f56aa9716b898ec8 ', 'BTC')).toBe(false);
        yield expect(yield app.is_address_valid('0xea674fdde714fd979de3edf0f56aa9716b898ec8 ', 'ETH')).toBe(false);
        yield expect(yield app.is_address_valid('0xea674fdde714fd979de3edf0f56aa9716b898ec8 ', 'ETH-Ropsten')).toBe(false);
        yield expect(yield app.is_address_valid('0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8', 'ETH-Ropsten')).toBe(true);
        yield expect(yield app.is_address_valid('0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8', 'ETH')).toBe(true);
        // did we validate checksums ?
        yield expect(yield app.is_address_valid('0xEA674fdDe714fd979de3EdF0F56AA9716B898AAA', 'ETH-Ropsten')).toBe(true);
        yield expect(yield app.is_address_valid('0xEA674fdDe714fd979de3EdF0F56AA9716B898AAA', 'ETH')).toBe(true);
        // TODO: add more edge cases.
        done();
    }));
    test('display_currency', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        yield app.set_display_currency('USD');
        yield expect(yield app.get_display_currency()).toEqual('USD');
        yield app.set_display_currency('JPY');
        yield expect(yield app.get_display_currency()).toEqual('JPY');
        yield expect(app.set_display_currency('ZIP')).rejects.toEqual('ERROR_UNSUPPORTED_CURRENCY');
        done();
    }));
    test('get_portfolio', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        const w1 = yield app.create_wallet('test1', 'BTC');
        // this is needed to add an address to the wallet.
        yield w1.get_receive_address();
        yield w1.get_balance();
        const w2 = yield app.create_wallet('test2', 'ETH');
        // this is needed to add an address to the wallet.
        yield w2.get_receive_address();
        yield expect(yield app.get_portfolio()).toEqual({
            currencies: [],
            total: {
                balance: 1.0000000001e-12,
                change: 0,
                currency: 'total'
            }
        });
        done();
    }));
    test('get_transaction_parameters', (done) => __awaiter(this, void 0, void 0, function* () {
        let addr;
        const txHash = '9aec681166a8033cb3178ec92335fcb2d5fdc26c9705388cac1568522b7a60ba';
        const app = new Application_1.Application(new LoggingStorage(), new (class B extends LoggingJSInterface {
            get(url) {
                const _super = Object.create(null, {
                    get: { get: () => super.get }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    _super.get.call(this, url);
                    if (url.indexOf('getTransactionParams') > 0) {
                        return {
                            text: () => JSON.stringify({
                                utxos: [
                                    {
                                        address: addr,
                                        satoshis: '1387561260',
                                        txid: txHash,
                                        vout: 0
                                    }
                                ],
                                lowFee: '230825',
                                mediumFee: '288532',
                                highFee: '346238'
                            })
                        };
                    }
                    return {
                        text: () => JSON.stringify(1)
                    };
                });
            }
        })());
        yield app.initialize();
        const w1 = yield app.create_wallet('test1', 'BTC');
        // this is needed to add an address to the wallet.
        addr = yield w1.get_receive_address();
        const txp = yield app.get_transaction_parameters(yield w1.get_network_object(), yield w1.get_addresses());
        const value = new bignumber_js_1.default(1387561260);
        yield expect(yield app.get_transaction_parameters(yield w1.get_network_object(), yield w1.get_addresses())).toEqual(expect.objectContaining({
            fee: new bignumber_js_1.default(288532),
            // nounces: expect.anything(),
            utxos: [
                {
                    address: addr,
                    utxos: [
                        {
                            tx_id: txHash,
                            txo_index: 0,
                            value
                        }
                    ]
                }
            ]
        }));
        yield expect(txp.get_nonce(addr)).toEqual(new bignumber_js_1.default(0));
        yield expect(txp.get_fee(0, Wallet_1.FeeWeight.Normal)).toEqual(new bignumber_js_1.default(288532));
        yield expect(txp.get_utxo()).toEqual(expect.arrayContaining([
            expect.objectContaining({
                address: addr,
                utxos: expect.arrayContaining([
                    expect.objectContaining({
                        tx_id: txHash,
                        txo_index: 0,
                        value
                    })
                ])
            })
        ]));
        yield expect(txp.get_gas_price(Wallet_1.FeeWeight.Normal)).toEqual(new bignumber_js_1.default(288532));
        done();
    }));
    test('currency_conversion', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        yield expect(yield app.currency_conversion('123', 'BTC', 'USD')).toEqual('0.0123');
        done();
    }));
    test('wallet calls', (done) => __awaiter(this, void 0, void 0, function* () {
        let addr;
        const app = new Application_1.Application(new LoggingStorage(), new (class B extends LoggingJSInterface {
            get(url) {
                const _super = Object.create(null, {
                    get: { get: () => super.get }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    _super.get.call(this, url);
                    if (url.indexOf('getBalances') > 0) {
                        return {
                            text: () => JSON.stringify([
                                {
                                    addr,
                                    quantity: '36498425296'
                                }
                            ])
                        };
                    }
                    return {
                        text: () => JSON.stringify(1)
                    };
                });
            }
        })());
        yield app.initialize();
        const w1 = yield app.create_wallet('test1', 'BTC');
        // this is needed to add an address to the wallet.
        addr = yield w1.get_receive_address();
        yield expect(yield app.get_private_key(yield w1.get_network_object(), addr)).toEqual('xprvA3VeFJ4nc5fr6ETXTcTFF8jffBu1yPMV5LZ3Z9xVVXnzSZLWdiq7DM9bx7omLYW6xfBowY1WsTfz4MG6aMczQdAEWrXCsKvZqimhtEmS623');
        yield expect(yield app.get_addresses_balance(yield w1.get_network_object(), yield w1.get_addresses())).toEqual(new bignumber_js_1.default('1e-8'));
        yield expect(yield app.get_addresses_balances(yield w1.get_network_object(), yield w1.get_addresses())).toEqual([new bignumber_js_1.default('36498425296')]);
        yield expect(yield app.get_address_balance(yield w1.get_network_object(), addr)).toEqual(new bignumber_js_1.default('1e-8'));
        yield expect(yield app.get_wallet_from_address(yield w1.get_network_object(), addr)).toEqual(w1);
        done();
    }));
    test('currency_conversion', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        yield expect(yield app.currency_conversion('123', 'BTC', 'USD')).toEqual('0.0123');
        done();
    }));
    test('estimate_gas_limit', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new LoggingJSInterface());
        yield app.initialize();
        const network = yield app.get_network('BTC');
        yield expect(yield app.estimate_gas_limit(network, '2N87LbvMZi6sECrLdNBhKAPY5QB4HVjkenU', '2N87LbvMZi6sECrLdNBhKAPY5QB4HVjkenU', new bignumber_js_1.default(100))).toEqual(new bignumber_js_1.default(1));
        done();
    }));
    test('resolve_name_from_addr', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new (class B extends LoggingJSInterface {
            get(url) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('LoggingJSInterface get', url);
                    return {
                        text: () => 'BLANAME'
                    };
                });
            }
        })());
        yield app.initialize();
        const network = yield app.get_network('BTC');
        yield expect(yield app.resolve_name_from_addr(network, 'BLA')).toEqual('BLANAME');
        done();
    }));
    test('construct_Amount', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new (class B extends LoggingJSInterface {
            get(url) {
                const _super = Object.create(null, {
                    get: { get: () => super.get }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    _super.get.call(this, url);
                    return {
                        text: () => JSON.stringify(1000000)
                    };
                });
            }
        })());
        yield app.initialize();
        const network = yield app.get_network('BTC');
        yield expect(yield app.construct_Amount(new bignumber_js_1.default(12344), network, false)).toEqual({
            fiat_unit: 'USD',
            fiat_value: '1234400',
            unit: 'BTC',
            value: '12344'
        });
        yield expect(yield app.construct_Amount(new bignumber_js_1.default('0.00012344'), network, false)).toEqual({
            fiat_unit: 'USD',
            fiat_value: '0.012344',
            unit: 'BTC',
            value: '0.00012344'
        });
        yield expect(yield app.construct_Amount(new bignumber_js_1.default('0.00012344'), network, true)).toEqual({
            fiat_unit: 'USD',
            fiat_value: '0.012',
            unit: 'BTC',
            value: '0.00012'
        });
        done();
    }));
    test('get_price_variation', (done) => __awaiter(this, void 0, void 0, function* () {
        const variations = {
            BTC: '-2.37',
            RSK: '-2.37',
            'BTC-Testnet': '-2.37',
            'RSK-Testnet': '-2.37',
            ETH: '9.15',
            'ETH-Ropsten': '9.15',
            DAI: '1.35',
            'DAI-Ropsten': '1.35',
            RIF: '1.78',
            'RIF-Testnet': '1.78'
        };
        const vMap = Object.keys(variations).reduce((acc, key) => {
            // this is what get_price_variations does.
            acc[key] = parseFloat(variations[key]) / 100;
            return acc;
        }, {});
        const app = new Application_1.Application(new LoggingStorage(), new (class B extends LoggingJSInterface {
            get(url) {
                const _super = Object.create(null, {
                    get: { get: () => super.get }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    _super.get.call(this, url);
                    return {
                        text: () => JSON.stringify(variations)
                    };
                });
            }
        })());
        yield app.initialize();
        const pv = yield app.get_price_variation();
        const pvObj = Array.from(pv).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
        yield expect(pvObj).toEqual(vMap);
        done();
    }));
    test('relay_transaction', (done) => __awaiter(this, void 0, void 0, function* () {
        const tx = Buffer.from('BLA');
        const app = new Application_1.Application(new LoggingStorage(), new (class B extends LoggingJSInterface {
            post(url, body) {
                const _super = Object.create(null, {
                    post: { get: () => super.post }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    _super.post.call(this, url, body);
                    expect(JSON.parse(body)).toEqual({ tx: tx.toString('hex') });
                    console.log('LoggingJSInterface post', url, body);
                    return {
                        text: () => JSON.stringify({ tx: 'BLANAME' })
                    };
                });
            }
        })());
        yield app.initialize();
        const network = yield app.get_network('BTC');
        yield expect(yield app.relay_transaction(network, tx, null)).toEqual('BLANAME');
        yield expect(yield app.relay_transaction(network, tx, 'not used, can be ignored')).toEqual('BLANAME');
        done();
    }));
    test('wallet_from_phrase', (done) => __awaiter(this, void 0, void 0, function* () {
        const app = new Application_1.Application(new LoggingStorage(), new (class B extends LoggingJSInterface {
            post(url, body) {
                const _super = Object.create(null, {
                    post: { get: () => super.post }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    _super.post.call(this, url, body);
                    yield expect(JSON.parse(body)).toEqual({
                        data: [
                            {
                                network: 'BTC',
                                node: {
                                    path: "m/44'/0'/0'",
                                    public_key: 'xpub6CemR8gPc97bADYXbeDh1VBy2BZGMp7tncphwTgU384xe4vsVxspqrnSwMCcKtf73xikn2csFLApQDGSm2p9ieBc92PHpCAiucMFPerZaWC'
                                }
                            },
                            {
                                network: 'ETH',
                                node: {
                                    path: "m/44'/60'/0'",
                                    public_key: '{"puk":"03e10b3475c02ae7644a886cca881fdd09c49afbc200c1ffadfedb322a99169c22","cc":"192d5d723dbf6a58b5d84976a5b522485a68e1e2ecd973af3fce8bea4edcdcbc"}'
                                }
                            },
                            {
                                network: 'DAI',
                                node: {
                                    path: "m/44'/60'/0'",
                                    public_key: '{"puk":"03e10b3475c02ae7644a886cca881fdd09c49afbc200c1ffadfedb322a99169c22","cc":"192d5d723dbf6a58b5d84976a5b522485a68e1e2ecd973af3fce8bea4edcdcbc"}'
                                }
                            },
                            {
                                network: 'RSK',
                                node: {
                                    path: "m/44'/137'/0'",
                                    public_key: '{"puk":"038f7aa230756987cb980ed8243d0a28b536389d29bd88281b6ce072ff2f69a6ff","cc":"ddf725c88837aae89b8dae3fb23b874f9c95b82925eb7bd46e415e243ab6088c"}'
                                }
                            },
                            {
                                network: 'RIF',
                                node: {
                                    path: "m/44'/137'/0'",
                                    public_key: '{"puk":"038f7aa230756987cb980ed8243d0a28b536389d29bd88281b6ce072ff2f69a6ff","cc":"ddf725c88837aae89b8dae3fb23b874f9c95b82925eb7bd46e415e243ab6088c"}'
                                }
                            },
                            {
                                network: 'BTC-Testnet',
                                node: {
                                    path: "m/44'/1'/0'",
                                    public_key: 'tpubDC6933UALbwQrU1pvCuDsJaeKuhrizGQXQtZWJSaRfCrfGvfDx2mo3P7bonECLuoP8qhKeXisN9mjZXAG3HowvEEBWuZLKj5PZzWbAdw8bZ'
                                }
                            },
                            {
                                network: 'ETH-Ropsten',
                                node: {
                                    path: "m/44'/1'/0'",
                                    public_key: '{"puk":"03131a40196585e2f63ae3439056f9105d8e5545e22ec5c1e329770d6c38eb24cc","cc":"b792203a369935e3cf4d4911e17061ae8025cfc614f94c689e96975067356fe9"}'
                                }
                            },
                            {
                                network: 'DAI-Ropsten',
                                node: {
                                    path: "m/44'/1'/0'",
                                    public_key: '{"puk":"03131a40196585e2f63ae3439056f9105d8e5545e22ec5c1e329770d6c38eb24cc","cc":"b792203a369935e3cf4d4911e17061ae8025cfc614f94c689e96975067356fe9"}'
                                }
                            },
                            {
                                network: 'RSK-Testnet',
                                node: {
                                    path: "m/44'/37310'/0'",
                                    public_key: '{"puk":"02a88af9da6aa87844ed59b730b8bcaf8d5eb583035470651b54d98881f2748a20","cc":"458cc736b6bcb90d784039355f7e90d5bb68aa291ec98bd34d36c8f552ddfd2c"}'
                                }
                            },
                            {
                                network: 'RIF-Testnet',
                                node: {
                                    path: "m/44'/37310'/0'",
                                    public_key: '{"puk":"02a88af9da6aa87844ed59b730b8bcaf8d5eb583035470651b54d98881f2748a20","cc":"458cc736b6bcb90d784039355f7e90d5bb68aa291ec98bd34d36c8f552ddfd2c"}'
                                }
                            }
                        ]
                    });
                    // Promise < any >
                    console.log('LoggingJSInterface post', url, body);
                    return {
                        text: () => JSON.stringify([
                            {
                                network: 'BTC',
                                wallets: [
                                    {
                                        subwallet_index: 0,
                                        used_addresses: [0]
                                    }
                                ]
                            }
                        ])
                    };
                });
            }
        })());
        yield app.initialize();
        yield app.wallet_from_phrase('gold obtain build afraid rib verify stereo stamp stem resist steel win', 'IGNORED', false);
        const wallets = yield app.get_wallets();
        yield expect(wallets.length).toEqual(1);
        yield expect(wallets).toEqual(expect.arrayContaining([
            expect.objectContaining({
                local_root_node: expect.objectContaining({
                    path: "m/44'/0'/0'/0",
                    public_key: 'xpub6DvNBZf58Z3hgMm8wpsFBXYw7hjdx4jXskurnh7mgY6RCQJaHnSapAdjTaMx5TJvJLhKp2qYKkNvGenbXQyJVs851gPtw1MXrK7c64erszy'
                })
            })
        ]));
        done();
    }));
});

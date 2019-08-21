/* eslint-disable no-undef,indent,object-curly-spacing,camelcase,no-unused-vars,arrow-body-style */
import { Application } from './Application';
import { SortCriterion } from './SortCriterion';
import { FeeWeight, Wallet } from './Wallet';
import { LoggingJSInterface, LoggingStorage } from './Application.test';

let txResponse: { txt?: string; data?: any } = {};

describe('BTC Wallet', () => {
    let app: Application;
    let w1: Wallet;
    const NETWORK = 'BTC';
    beforeEach(async done => {
        app = new Application(
            new LoggingStorage(),
            new (class B extends LoggingJSInterface {
                async get(url: string) {
                    super.get(url);
                    let res = 1;
                    if (txResponse.txt && url.indexOf(txResponse.txt) > 0) {
                        res = txResponse.data;
                    }
                    return {
                        text: () => JSON.stringify(res)
                    };
                }
            })()
        );
        await app.initialize();
        await expect(await app.get_wallets()).toEqual([]);
        w1 = await app.create_wallet('test1', NETWORK);
        done();
    });

    test('get wallet id', async done => {
        await expect(await w1.get_id()).toEqual(0);
        const w2 = await app.create_wallet('test2', NETWORK);
        await expect(await w2.get_id()).toEqual(1);
        const w3 = await app.create_wallet('test3', NETWORK);
        await expect(await w3.get_id()).toEqual(2);
        done();
    });

    test('get wallet balance', async done => {
        // TODO: Check if this is ok, a wallet can be created with no address ?
        const ad = await w1.get_receive_address();
        txResponse = { txt: 'getBalance', data: 112 };
        await expect(await w1.get_balance()).toEqual({
            fiat_unit: 'USD',
            fiat_value: '1.12e-10',
            unit: NETWORK,
            value: '0.00000112'
        });
        done();
    });

    test('get root wallet', async done => {
        await expect(w1.get_root_wallet()).toEqual(w1);
        const w2 = await app.create_wallet('test2', NETWORK);
        await expect(await app.get_wallets()).toEqual([w1, w2]);
        await expect(w2.get_root_wallet()).toEqual(w1);
        const w3 = await app.create_wallet('test3', NETWORK);
        await expect(await app.get_wallets()).toEqual([w1, w2, w3]);
        await expect(w2.get_root_wallet()).toEqual(w1);
        done();
    });

    // TODO: Test the key derivation strategy for different networks and more
    // sistematically (this needs a whole test file).
    test('generate_child_public_key', async done => {
        await expect(await w1.generate_child_public_key(1)).toEqual(
            expect.objectContaining({
                path: "m/44'/0'/0'/0/1",
                public_key:
                    'xpub6GUzeobgSTE9NnocwDNsT6uPJdqR1ogGptRNJyVqZDmokvj8uHsjokxRy21gS1FhS1Bi7zCAPiRZ7qomr5dtNYNkSEMjbHqzigjURqP2DLX'
            })
        );
        await expect(await w1.get_private_key(1)).toEqual(
            'xprvA3VeFJ4nc5frAJj9qBqs5xxekbzvcLxRTfVmWb6DztEpt8PzMkZVFxdx7jmwnwBK5QGtkohiEn9cUqDy1KM4J43c5PL7LbtaKDfzH5eXGFd'
        );
        await expect(await w1.generate_child_public_key(2)).toEqual(
            expect.objectContaining({
                path: "m/44'/0'/0'/0/2",
                public_key:
                    'xpub6GUzeobgSTE9PYaXxLc4uCGG3yW6bMEhNtxaBXfVAG5i7buRvQXUoKWTZEKQbPHgabi3JamUzbcG6D5gt3koWNcnUUQ7DBdX1h6uBk8S6Yu'
            })
        );
        await expect(await w1.get_private_key(2)).toEqual(
            'xprvA3VeFJ4nc5frB4W4rK54Y4KXVwfcBtWr1g2yP9FsbvYjEoaHNsDEFXByhwTLKyGEN8kqWr35paR7S1TaGVunvyMyJJppp4kRXTUYTf6rbQk'
        );
        done();
    });

    test('wallet name', async done => {
        await expect(await w1.get_name()).toEqual('test1');
        await w1.set_name('BLA');
        await expect(await w1.get_name()).toEqual('BLA');
        done();
    });

    test('wallet phrase', async done => {
        await expect(await w1.get_phrase()).toEqual(
            'gold obtain build afraid rib verify stereo stamp stem resist steel win'
        );
        done();
    });

    test('wallet network', async done => {
        await expect(await w1.get_network_object()).toEqual(
            expect.objectContaining({
                name: NETWORK
            })
        );
        await expect(await w1.get_network()).toEqual(NETWORK);
        done();
    });

    test('wallet addr', async done => {
        const addrs = await w1.get_addresses();
        await expect(addrs.length).toEqual(0);
        await expect(addrs).toEqual(expect.arrayContaining([]));

        await expect(await w1.generate_address()).toEqual('1KCNvjPWsnXLPpoTiGQxkCt6pnEZ1sWyuX');
        const addrs2 = await w1.get_addresses();
        await expect(addrs2.length).toEqual(1);
        await expect(addrs2).toEqual(['1KCNvjPWsnXLPpoTiGQxkCt6pnEZ1sWyuX']);
        await expect(await w1.get_receive_address()).toEqual('1KCNvjPWsnXLPpoTiGQxkCt6pnEZ1sWyuX');

        await expect(await w1.generate_address()).toEqual('1NnBmrNnU7eRbrKXhors5bJLronhygpv6w');
        const addrs3 = await w1.get_addresses();
        await expect(addrs3.length).toEqual(2);
        await expect(addrs3).toEqual([
            '1KCNvjPWsnXLPpoTiGQxkCt6pnEZ1sWyuX',
            '1NnBmrNnU7eRbrKXhors5bJLronhygpv6w'
        ]);
        await expect(await w1.get_receive_address()).toEqual('1NnBmrNnU7eRbrKXhors5bJLronhygpv6w');
        done();
    });

    test('serialize wallet', async done => {
        const [netId, data] = w1.serialize();
        await expect(netId).toEqual(0);
        await expect(JSON.parse(data)).toEqual(
            expect.objectContaining({
                id: 0,
                name: 'test1'
            })
        );
        done();
    });

    // TODO: More and better of this one
    test('history', async done => {
        const txHash = 'd5b05457f3b39a62b63c07aec3fcb6311a67b1c473ba238de1f755c9d3515352';
        txResponse = {
            txt: 'getTransactionHistory',
            data: [
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
            ]
        };
        const transactions = await w1.get_history(0, 10, SortCriterion.NewestFirst);
        await expect(transactions.length).toEqual(1);
        await expect(transactions).toEqual(
            expect.arrayContaining([
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
            ])
        );
        done();
    });

    test('estimate tx', async done => {
        // TODO: Check if this is ok, a wallet can be created with no address ?
        const ad = await w1.get_receive_address();
        txResponse = {
            txt: 'getTransactionParams',
            data: {
                utxos: [
                    {
                        address: ad,
                        satoshis: '1387561260',
                        txid: '9aec681166a8033cb3178ec92335fcb2d5fdc26c9705388cac1568522b7a60ba',
                        vout: 0
                    }
                ],
                lowFee: '230825',
                mediumFee: '288532',
                highFee: '346238'
            }
        };
        const estimate = await w1.estimate_tx(
            '1Nh7uHdvY6fNwtQtM1G5EZAFPLC33B59rB',
            '100',
            FeeWeight.Normal
        );
        await expect(estimate).toEqual(
            expect.objectContaining({
                amount: expect.objectContaining({
                    value: '100',
                    unit: NETWORK,
                    fiat_value: '0.01',
                    fiat_unit: 'USD'
                }),
                fees: expect.objectContaining({
                    value: '0.00055398',
                    unit: NETWORK,
                    fiat_value: '5.5398e-8',
                    fiat_unit: 'USD'
                })
            })
        );
        done();
    });

    test('delete wallet', async done => {
        await w1.delete();
        await expect(await app.get_wallets()).toEqual([]);
        done();
    });
});

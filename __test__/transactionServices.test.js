import { buildTransaction } from '../src/services/transactionServices';
const legacyBtcInput={
    amount: "0.001",
    feeParams: {fees: "0x25b7"},
    isRequestSendAll: false,
    memo: null,
    toAddress: "mtSwjbJh1S6tih3L4PhC5JRzQ1mGd2mqx8",
    coin:{
        account: "0",
        address: "myD8QmHBNa4zugWqEvY118XSciNvsdpkrU",
        addressType: "legacy",
        chain: "Bitcoin",
        coinType: 1,
        id: "BTCTestnet",
        networkId: 1,
        objectId: "Q4dJZA9EVX",
        path: "m/44'/1'/0'/0/0",
        privateKey: "707dd7a0645d37725f28a63d764bc91a34ca263a077230ba56209dddd3bc881f",
        symbol: "BTC",
        type: "Testnet"
    }
}

const legacyBtcTransaction ={
    addressType: "legacy",
    coinSwitch: undefined,
    contractAddress: "",
    data: "",
    gasFee: {fees: "0x25b7"},
    memo: null,
    netType: "Testnet",
    privateKey: "707dd7a0645d37725f28a63d764bc91a34ca263a077230ba56209dddd3bc881f",
    publicKey: undefined,
    rawTransaction: null,
    receiver: "mtSwjbJh1S6tih3L4PhC5JRzQ1mGd2mqx8",
    sender: "myD8QmHBNa4zugWqEvY118XSciNvsdpkrU",
    signedTransaction: "0200000001aaa6f4351c5e71ed9b5ec3e67bc1df542bcad254683e12b59e3be20284513eb2010000006a473044022044a6048266ee54db238a3e2ead31408000767d0be9eaa27736d17a14cebfe9ed022020dba17ee90f013bbea9b582b125855cf4a35401e686e06f12aa4ab430e4fc2c012103686be862655bc3e3286ecb3b74d61e3eea1caf59a101a14703eaff1ea4f25c3bffffffff02a0860100000000001976a9148dd7810f56f02bde737298f67c741b021a36d0c788ace47c1000000000001976a914c2133890475a49c5279ab4f483b09aba3f534c4a88ac00000000",
    symbol: "BTC",
    txHash: "6e6cbe62dda629372f60fcf352693f0a7615fd6d7af5e31058394145695eb7fb",
    value: "0x186a0",
}

describe('Transaction Services', () => {
    it('should build a transaction with a legacy BTC address', async () => {
        const builtTransaction = await buildTransaction(legacyBtcInput);
        expect(builtTransaction).toHaveProperty('receiver');
        expect(builtTransaction.receiver).toBe(legacyBtcInput.toAddress);
        expect(builtTransaction).toHaveProperty('sender');
        expect(builtTransaction.sender).toBe(legacyBtcInput.coin.address);
        expect(builtTransaction.symbol).toBe(legacyBtcInput.coin.symbol);
    });


    it('should build a transaction with a RBTC address', async () => {

    });

});


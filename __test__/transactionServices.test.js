import { buildTransaction } from '../src/services/transactionServices';
import BigNumber from "bignumber.js";
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
const balance = new BigNumber(100);
const gas = new BigNumber(23);
const segwitRbtcSendAllInput={
    amount: "0.046984",
    feeParams: { gasPrice: "118480000", gas},
    isRequestSendAll: true,
    memo: null,
    toAddress: "0xe4CAE969f26E093874728272dcFED1074f4778F5",
    coin:{
        account: "0",
        address: "0x2FA4a8A4cFF02Efa4368a1e8c3301C5342D3b879",
        balance:balance,
        chain: "Rootstock",
        coinType: 37310,
        contractAddress: undefined,
        id: "RBTCTestnet",
        metadata: {networkId: 31, coinType: 37310, icon: 10, defaultName: "Smart Bitcoin", chain: "Rootstock"},
        name: "Smart Bitcoin",
        networkId: 31,
        objectId: "gOrOxEcFeQ",
        path: "m/44'/37310'/0'/0/0",
        precision: 18,
        privateKey: "b265c01217804948d490d17b7383d61daf1991f87f1f5ae87b3ad0f84bf967e0",
        symbol: "RBTC",
        type: "Testnet"
    }
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


    it('should build a transaction with a RBTC address when sending all', async () => {
        const builtTransaction = await buildTransaction(segwitRbtcSendAllInput);
        expect(builtTransaction).toHaveProperty('receiver');
        expect(builtTransaction.receiver).toBe(segwitRbtcSendAllInput.toAddress.toLowerCase());
        expect(builtTransaction).toHaveProperty('sender');
        expect(builtTransaction.sender).toBe(segwitRbtcSendAllInput.coin.address);
        expect(builtTransaction.symbol).toBe(segwitRbtcSendAllInput.coin.symbol);
    });

});



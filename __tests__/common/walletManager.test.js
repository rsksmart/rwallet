import walletManager from '../../src/common/wallet/walletManager';
import appContext from '../../src/common/appContext';
import rsk3 from 'rsk3';

jest.mock('../../src/common/appContext', () => ({
  addWallet: jest.fn(async () => { }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  walletManager.wallets.length = 0;
});

describe('walletManager toJson', () => {
  test('legal input', async () => {
    const walletCounts = 2;
    const wallets = [];
    for (let i = 0; i < walletCounts; i += 1) {
      wallets.push(walletManager.createWallet(
        `t${i}`,
        undefined,
        ['BTC', 'RBTC', 'RIF'],
      ));
    }

    await Promise.all(wallets.map(e => walletManager.addWallet(e)));

    // walletManager toJson example:
    //[{
    //     id: 0,
    //     name: 't0',
    //     createdAt: new Date('2019 - 11 - 27T02: 29: 21.302Z'),
    //     coins:
    //         [{
    //             network: {
    //                 messagePrefix: '\u0018Bitcoin Signed Message:\n',
    //                 bech32: 'bc',
    //                 bip32: { public: 76067358, private: 76066276 },
    //                 pubKeyHash: 0,
    //                 scriptHash: 5,
    //                 wif: 128
    //             },
    //             type: 'BTC',
    //             address: '1uvkG397i8XMRsEBknWcKQcB9sFbZxpwZ'
    //         },
    //         {
    //             network: undefined,
    //             type: 'RBTC',
    //             address: '0xfacbc438Caf070F66f0D80e2A7EbBe8e9145Fa82'
    //         },
    //         {
    //             network: undefined,
    //             type: 'RIF',
    //             address: '0xfacbc438Caf070F66f0D80e2A7EbBe8e9145Fa82'
    //         }]
    // }]
    const resWalletJson = walletManager.toJson();
    resWalletJson.forEach(({ id, name, createdAt, coins }) => {
      expect(typeof id).toBe('number');
      expect(typeof name).toBe('string');
      expect(createdAt instanceof Date).toBe(true);
      coins.forEach(({ type, address }) => {
        expect(['BTC', 'RBTC', 'RIF'].includes(type)).toBe(true);
        if (type === 'RBTC' || type ==='RIF') {
          expect(rsk3.utils.isHex(address)).toBe(true);
        }
        if (type === 'BTC') {
          expect(/^[A-Za-z0-9]+$/.test(address)).toBe(true);
        }
      });
    });
  });

  test('should have walletId', async () => {
    appContext.addWallet = jest.fn().mockResolvedValue(1);
    const wallet = walletManager.createWallet(
      't0',
      undefined,
      ['BTC', 'RBTC', 'RIF'],
    );

    await walletManager.addWallet(wallet);

    expect(walletManager.wallets[0].walletId).toBeDefined();
  });
});

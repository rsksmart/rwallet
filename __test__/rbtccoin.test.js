import { expect } from 'chai';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import RBTCCoin from '../src/common/wallet/rbtccoin';

const bip39 = require('bip39');

describe('RBTCcoin Suite', () => {
  it('Derive', () => {
    // Test seed. DO NOT use in dev code or production
    const mnemonic = 'chronic vote exotic upgrade security area add blossom soul youth plate dish';
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const rbtccoin = new RBTCCoin('RBTC', 'Mainnet', 'm/44\'/137\'/1\'/0/0');
    rbtccoin.derive(seed);
    expect(rbtccoin.address).to.equal('0x1Bf155ffd327d645358B6279cEf147BB74146431');
    expect(rbtccoin.privateKey).to.equal('27ff76b26dca7740a86f84a181e5bdea725229d7871c5936cceb5e86141d2602');
  });
});

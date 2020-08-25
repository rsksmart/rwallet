import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Coin from './btccoin';
import RBTCCoin from './rbtccoin';
import definitions from '../definitions';
import BasicWallet from './basic.wallet';

export default class ReadOnlyWallet extends BasicWallet {
  constructor(id, name, chain, type, address) {
    super(id, name, definitions.WalletType.Readonly);
    this.chain = chain;
    this.type = type;
    this.address = address;
  }

  static create({
    id, name, chain, type, address, coins,
  }) {
    const wallet = new ReadOnlyWallet(id, name, chain, type, address);
    wallet.createCoins(coins);
    return wallet;
  }

  addToken = (token) => {
    const {
      symbol, contractAddress, objectId, name, precision, balance, subdomain,
    } = token;

    let coin = null;

    // If the token already exists, an exception is thrown.
    const foundCoin = _.find(this.coins, { symbol });
    if (foundCoin) {
      throw new Error('err.exsistedtoken');
    }

    if (this.chain === 'Bitcoin') {
      coin = new Coin(symbol, this.type);
    } else {
      coin = new RBTCCoin(symbol, this.type);
      coin.setCustomTokenData({ contractAddress, name, precision });
    }
    coin.address = this.address;

    // restore other data
    if (objectId) {
      coin.objectId = objectId;
    }
    if (balance) {
      coin.balance = new BigNumber(balance);
    }
    if (subdomain) {
      coin.subdomain = subdomain;
    }

    this.coins.push(coin);
    return coin;
  }

  static restore(json) {
    const wallet = ReadOnlyWallet.create(json);
    return wallet;
  }

  /**
   * Returns a JSON to save required data to backend server; empty array if there's no coins
   */
  toJSON = () => {
    const result = {
      id: this.id,
      name: this.name,
      chain: this.chain,
      type: this.type,
      address: this.address,
      walletType: this.walletType,
      coins: this.coins.map((coin) => coin.toJSON()),
    };

    return result;
  }

  /**
   * Return a Wallet object based on raw wallet JSON
   * Returns null if Wallet restoration fails
   * @param {*} json
   */
  static async fromJSON(json) {
    const wallet = ReadOnlyWallet.restore(json);
    return { isNeedSave: false, wallet };
  }
}

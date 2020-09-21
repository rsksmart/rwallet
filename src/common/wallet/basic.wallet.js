import _ from 'lodash';

const ordinal = require('ordinal');

export default class BasicWallet {
  constructor(id, name, walletType) {
    this.coins = [];
    this.id = id;
    this.name = name || `My ${ordinal(id + 1)} Wallet`;
    this.walletType = walletType;
  }

  // create coins and add to list
  createCoins = (coins) => {
    console.log('createCoins, coins: ', coins);
    _.each(coins, (coin) => {
      this.addToken(coin);
    });
  }

  /**
   * Add token to wallet
   */
  addToken = (/* token */) => {
    throw new Error('Method not implemented.');
  }

  /**
   * Returns a JSON to save required data to backend server; empty array if there's no coins
   */
  toJSON = () => {
    throw new Error('Method not implemented.');
  }

  /**
   * Set Coin's objectId to values in parseWallets, and return true if there's any change
   * @param {array} addresses Array of JSON objects
   * @returns True if any Coin is updated
   */
  updateCoinObjectIds = (addresses) => {
    const { coins } = this;

    let isDirty = false;
    _.each(coins, (coin) => {
      if (coin.updateCoinObjectIds(addresses)) {
        isDirty = true;
      }
    });

    return isDirty;
  }
}

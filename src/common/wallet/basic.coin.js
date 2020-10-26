import _ from 'lodash';

class BasicCoin {
  constructor(chain, symbol, type) {
    this.chain = chain;
    this.symbol = symbol;
    this.type = type;
  }

  /**
   * Return ture if all class members have the same value as the input json
   * @param {object} json Another Coin object
   */
  isEqual(json) {
    const {
      address, chain, type, symbol,
    } = this;
    return address === json.address
      && chain === json.chain
      && type === json.type
      && symbol === json.symbol;
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

export default BasicCoin;

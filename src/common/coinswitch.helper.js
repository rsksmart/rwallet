import ParseHelper from './parse';

class CoinswitchHelper {
  static getCoins() {
    return ParseHelper.requestCoinswitchAPI('coins');
  }

  static getPairs(deposit, destination) {
    return ParseHelper.requestCoinswitchAPI('pairs', { deposit, destination });
  }

  static getRate(deposit, destination) {
    return ParseHelper.requestCoinswitchAPI('rate', { deposit, destination });
  }

  static placeOrder(deposit, destination, amount, destinationAddress, refundAddress) {
    return ParseHelper.requestCoinswitchAPI('order', {
      deposit, destination, amount, destinationAddress, refundAddress,
    });
  }
}

export default CoinswitchHelper;

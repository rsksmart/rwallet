import btcTransactions from './btcTransactions';

const wallet = {
  async getTransactionsByAddress(payload) {
    console.log('mock.wallet::getTransactionsByAddress, payload:', payload);
    // simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(btcTransactions), 1000);
    });
  },
};

export default wallet;

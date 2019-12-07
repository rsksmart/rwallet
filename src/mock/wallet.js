import btcTransactions from './btcTransactions';
import rbtcTransactions from './rbtcTransactions';
import rifTransactions from './rifTransactions';

const wallet = {
  async getTransactionsByAddress(payload) {
    console.log('mock.wallet::getTransactionsByAddress, payload:', payload);
    // simulate network delay
    return new Promise((resolve) => {
      const getTransactions = () => {
        let transactions = null;
        switch (payload.symbol) {
          case 'BTC':
            transactions = btcTransactions;
            break;
          case 'RBTC':
            transactions = rbtcTransactions;
            break;
          case 'RIF':
            transactions = rifTransactions;
            break;
          default:
        }
        const pageSize = 10;
        const start = (payload.page - 1) * pageSize;
        let end = start + payload.page * pageSize - 1;
        end = end <= transactions.length - 1 ? end : transactions.length - 1;
        const pageTransactions = [];
        for (let i = start; i < end; i += 1) {
          pageTransactions.push(transactions[i]);
        }
        return pageTransactions;
      };
      setTimeout(() => {
        const transcations = getTransactions();
        resolve(transcations);
      }, 1000);
    });
  },
};

export default wallet;

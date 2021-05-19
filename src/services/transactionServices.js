import BigNumber from 'bignumber.js';
import common from '../common/common';
import Transaction from '../common/transaction';

const buildTransaction = async ({
  memo, amount, coin, feeParams, toAddress, isRequestSendAll,
}) => {
  const {
    symbol, balance, precision,
  } = coin;
  const extraParams = { data: '', memo, gasFee: feeParams };
  let finalToAddress = toAddress;
  // In order to send all all balances, we cannot use the amount in the text box to calculate the amount sent, but use the coin balance.
  // The amount of the text box is fixed decimal places
  let value = new BigNumber(amount);
  if (isRequestSendAll) {
    if (symbol === 'BTC') {
      value = balance.minus(common.convertUnitToCoinAmount(symbol, feeParams.fees, precision));
    } else if (symbol === 'RBTC') {
      finalToAddress = finalToAddress.toLowerCase();
      value = balance.minus(common.convertUnitToCoinAmount(symbol, feeParams.gas.times(feeParams.gasPrice), precision));
    } else {
      finalToAddress = finalToAddress.toLowerCase();
      value = balance;
    }
  }

  return new Transaction(coin, finalToAddress, value, extraParams);
};

const broadcastTransaction = async ({
  memo, amount, coin, feeParams, toAddress, isRequestSendAll,
}) => {
  const transaction = buildTransaction({
    memo, amount, coin, feeParams, toAddress, isRequestSendAll,
  });
  await transaction.broadcast();
  return transaction;
};

export { buildTransaction, broadcastTransaction };

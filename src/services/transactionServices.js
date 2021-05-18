import common from "../common/common";
import Transaction from "../common/transaction";


const broadcastTransaction = async ({memo, amount, coin, feeParams, toAddress, isRequestSendAll}) => {
    const {
         balance, precision,
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

    let transaction = new Transaction(coin, finalToAddress, value, extraParams);
    await transaction.broadcast();


};

export { broadcastTransaction }


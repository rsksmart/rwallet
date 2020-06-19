## Dapp Browser Developer Guideline

#### This guideline is to help developers develop Dapps that can be used in rWallet's Dapp Browser.

#### 1. Basic

##### Unit

"wei" are the smallest chain unit, and you should always make calculations in wei and convert only for display reasons.

```
web3.utils.toWei('1');
> "1000000000000000000"
```

##### Transaction
Every transaction requires a certain gas fee. The total gas fee = gas * gasPrice.

If you want to transfer 1 RBTC to your friend, and the gas is 500000 wei, gasPrice is 20 gwei (1 gwei = 1000000000 wei), so the total gas fee is 1e16 wei (is equal to 0.01 RBTC) , you need to cost 1.01 RBTC, then your friend will get 1 RBTC.

The send transaction steps:

1. call getTransactionFees method to calculate the transaction fee
2. generate transaction object: { symbol, type, sender, receiver, value, memo, gas, gasPrice }
3. call createRawTransaction method to generate the raw transaction
4. send the raw transaction to the chain and wait the miner package your transaction

    
#### 2. Install Web3, Axois to your WebApp

using yarn: 

```
yarn add web3 axios
```
using npm:

```
npm install web3 axios --save
```

#### 3. Usage

##### Import Web3, Axios
```
import Web3 from 'web3'
import axios from 'axios'
```

##### Check Metamask or other chrome ethereum plugins exist

```
if (typeof window.ethereum === 'undefined') {
  console.log('Please connect to RSK Testnet')
} else {
  ....
}
```

##### Get address balance

```
getBalance = async () => {
  const address = '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
  // Testnet api
  const api = 'http://130.211.12.3/parse/functions';
  
  const res = await axios.post(`${api}/getBalance`,
    {
      // token symbol eg: RBTC, RIF
      symbol: 'RBTC',
      // chain type eg: Testnet, Mainnet
      type: 'Testnet',
      address,
    },
    {
      headers: {
        'X-Parse-Application-Id': 'rwallet',
        'Content-Type': 'application/json',
        'Rwallet-API-Key': '3c5d8426-2903-4f37-b5c2-81110e653a86',
      }
    })
  const balance = res.data.result
  return balance
}
```

##### Send transaction

```
send = async () => {
  // Testnet api
  const api = 'http://130.211.12.3/parse/functions';
  // Testnet rwallet api key
  const rwalletApiKey = 'Your-Own-Api-Key'
  const toAddress = '0x243E0c3707a9E1e029b0f0E436eb4fa730b113E7';
  const headers = {
    'X-Parse-Application-Id': 'rwallet',
    'Content-Type': 'application/json',
    'Rwallet-API-Key': rwalletApiKey,
  };

  const web3 = new Web3();
  web3.setProvider(window.ethereum);
  let fromAddress;
  window.ethereum.enable()
    // Get default account from chrome ethereum plugins
    .then((accounts) => {
      fromAddress = accounts[0];
      web3.eth.defaultAccount = fromAddress;
    })
    .then(async () => {
      // Get transaction fees from testnet chain
      const res = await axios.post(
        `${api}/getTransactionFees`,
        {
          // token symbol eg: RBTC, RIF
          symbol: 'RBTC',
          // chain type eg: Testnet, Mainnet
          type: 'Testnet',
          sender: fromAddress,
          receiver: fromAddress,
          // Transfer 0.0001 RBTC
          value: web3.utils.toHex( web3.utils.toWei('0.0001') ),
          memo: '',
        },
        { headers },
      );
      return res.data.result
    })
    /**
     * gasFee format: { gas, gasPrice: { low, medium, high } }
     * gasPrice determine the package speed.
     * The bigger the gasPrice number, the faster the speed.
     * /
    .then(async (gasFee) => {
      const res = await axios.post(
        `${api}/createRawTransaction`,
        { 
          symbol: 'RBTC',
          type: 'Testnet',
          sender: fromAddress,
          receiver: toAddress,
          value: web3.utils.toHex( web3.utils.toWei('0.0001') ),
          gas: gasFee.gas,
          gasPrice: gasFee.gasPrice.medium,
        },
        { headers },
      );
      return res.data.result
    })
    // Sign the rawTransaction with chrome ethereum plugins and then send it to the testnet chain
    .then(async (rawTransaction) => {
      web3.eth.sendTransaction(rawTransaction)
      .on('transactionHash', (hash) => {
        console.log('transaction has been sent: ', hash);
      })
      .on('receipt', (receipt) => {
        console.log('transaction has been packaged: ', receipt);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('transaction is confirmed.');
      })
      .on('error', console.error);
    })
    .catch(err => {
      console.log('err: ', err)
    })
}
```

##### More Infomation

[Metamask Doc](https://docs.metamask.io/guide/)

[Web3 Doc](https://web3js.readthedocs.io/en/v1.2.6/getting-started.html)

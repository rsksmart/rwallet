## Dapp Browser Developer Guideline

#### 1. Install Web3

using yarn: 

```
yarn add web3
```
using npm:

```
npm install web3 --save
```

#### 2. Usage

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
  
  // Set rpc endpoint to web3
  const rpcEndpoint = 'https://public-node.testnet.rsk.co'
  const web3 = new Web3(rpcEndpoint)
  
  const balance = await web3.eth.getBalance(address)
  return web3.utils.fromWei(balance)
}
```

##### Send transaction

```
send = async () => {
  const api = 'http://130.211.12.3/parse/functions';
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
    // gasFee format: { gas, gasPrice: { low, medium, high } }
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

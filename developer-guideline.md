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
  const toAddress = '0x243E0c3707a9E1e029b0f0E436eb4fa730b113E7'
  const web3 = new Web3()
  web3.setProvider(window.ethereum)
  let fromAddress
  window.ethereum.enable()
    // Get default account from chrome ethereum plugins
    .then(accounts => {
      fromAddress = accounts[0]
      web3.eth.defaultAccount = fromAddress
    })
    // Get gasPrice from block chain
    .then(() => web3.eth.getGasPrice())
    .then(async gasPrice => {
      // Get the fromAddress's transaction acount. Next transaction's nonce is equal to transactionCount + 1.
      const transactionCount = await web3.eth.getTransactionCount(fromAddress)

      // Generate transaction object
      const transaction = {
        from: fromAddress,
        to: toAddress,
        
        // Send 0.001 RBTC to toAddress
        value: web3.utils.toWei('0.001'),

        // Get gasPrice from block chain, or a constant value. Default gasPrice is 1
        gasPrice: gasPrice || 1,
        nonce: transactionCount + 1,
      }

      // Send transaction to rps endpoint. (Chrome ethereum plugins can set the rpc endpoint.)
      web3.eth.sendTransaction(transaction)
      .on('transactionHash', function(hash){
        console.log('transaction has been sent.')
      })
      .on('receipt', function(receipt){
        console.log('transaction has been packaged.')
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log('transaction is confirmed.')
      })
      .on('error', console.error);
    })
}
```

##### More Infomation

[Metamask Doc](https://docs.metamask.io/guide/)

[Web3 Doc](https://web3js.readthedocs.io/en/v1.2.6/getting-started.html)

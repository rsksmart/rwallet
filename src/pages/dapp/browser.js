import React, { Component } from 'react';
import {
  Platform, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import Rsk3 from '@rsksmart/rsk3';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import OperationHeader from '../../components/headers/header.operation';
import appActions from '../../redux/app/actions';

class DAppBrowser extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  getJsCode = (address) => `
      (function() {
        let resolver, rejecter, hash
        setTimeout(() => {
          ${Platform.OS === 'ios' ? 'window' : 'document'}.addEventListener("message", function(data) {
            const result = data.data
            if (result && resolver) {
              resolver(result)
            } else if (rejecter) {
              rejecter(1)
            }
          })
        }, 0)

        getHash = (payload) => {
          return new Promise((resolve, reject) => {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload))
            resolver = resolve
            rejecter = reject
          })
        }

        getTransactionReceipt = (payload) => {
          return new Promise((resolve, reject) => {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload))
            resolver = resolve
            rejecter = reject
          })
        }

        function initWeb3() {
          const rskEndpoint = 'https://public-node.testnet.rsk.co';
          const web3 = new Web3(rskEndpoint);
          window.ethereum = web3;
          window.ethereum.selectedAddress = '${address}'
          window.ethereum.networkVersion = '31'
          window.web3 = web3
          const provider = new ethers.providers.JsonRpcProvider(rskEndpoint);
          const config = {
            isEnabled: true,
            isUnlocked: true,
            networkVersion: '31',
            onboardingcomplete: true,
            selectedAddress: '${address}',
          }
          window.ethereum.publicConfigStore = {
            _state: {
              ...config,
            },
            getState: () => {
              return {
                ...config,
              }
            }
          }

          window.ethereum.enable = () => {
            return new Promise((resolve, reject) => {
              resolve(['${address}'])
            })
          }

          window.ethereum.on = (method, callback) => { if (method) {console.log(method)} }

          const sendAsync = async (payload, callback) => {
            window.ethereum.sendAsync = window.ethereum.send
            let err, res, result = ''
            const {method, params, jsonrpc, id} = payload
            try {
              console.log('payload: ', payload)
              if (method === 'net_version') {
                result = '31'
              }
              if (method === 'eth_getBlockByNumber') {
                const blockNumber = await provider.getBlockNumber()
                result = await provider.getBlock(blockNumber)
              }
              if (method === 'eth_call') {
                result = await provider.call(params[0], params[1])
              }
              if (method === 'eth_requestAccounts') {
                result = ['${address}']
              }
              if (method === 'eth_estimateGas') {
                result = await provider.estimateGas(params[0])
                result = result.toNumber()
              }
              if (method === 'eth_sendTransaction') {
                result = await getHash(payload)
                hash = result
              }
              if (method === 'eth_getTransactionReceipt') {
                result = await getTransactionReceipt(payload)
                result = JSON.parse(result)
              }
              if (method === 'eth_getTransactionByHash') {
                result = await provider.getTransaction(params[0])
              }
              if (method === 'eth_gasPrice') {
                result = await provider.getGasPrice()
              }

              res = {id, jsonrpc, result}
              console.log('sendAsync res: ', res)
            } catch(err) {
              err = err
              console.log('err: ', err)
            }
            callback(err, res)
          }

          window.web3.setProvider(window.ethereum)
          window.ethereum.send = sendAsync
          window.ethereum.sendAsync = sendAsync
        }

        let scriptCount = 0

        function loadJsFile(content) {
          const container = (document.head || document.documentElement)
          const script = document.createElement('script')
          script.setAttribute('type', 'text/javascript')
          script.setAttribute('src', content)
          script.onload = () => {
            scriptCount += 1
            script.remove()
          }
          container.insertBefore(script, container.children[0])
        }

        loadJsFile('https://cdn.jsdelivr.net/npm/web3@0.20.1/dist/web3.min.js')
        loadJsFile('https://storage.googleapis.com/storage-rwallet/ethers.min.js')

        let timer = setInterval(() => {
          if (scriptCount === 2) {
            initWeb3()
            clearInterval(timer)
          }
        }, 100);
      }) ();
      true
    `

  render() {
    const { navigation, callAuthVerify } = this.props;

    const url = navigation.state.params.url || '';
    const title = navigation.state.params.title || url;

    const rskEndpoint = 'https://public-node.testnet.rsk.co';
    // input your own 12-words mnemonic
    const mnemonic = 'fabric arrest space cost embark tell pear balance title girl photo valley';
    const provider = new ethers.providers.JsonRpcProvider(rskEndpoint);
    const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/37310'/0'/0/0");
    const wallet = new ethers.Wallet(mnemonicWallet.privateKey, provider);
    const addr = ethers.utils.getAddress(wallet.address.toLowerCase());
    const jsCode = this.getJsCode(addr);
    const rsk3 = new Rsk3(rskEndpoint);

    return (
      <View style={{ flex: 1 }}>
        <OperationHeader title={title} onBackButtonPress={() => navigation.goBack()} />
        <WebView
          // source={{ uri: 'https://faucet.rifos.org/' }}
          // source={{ uri: 'https://testnet.manager.rns.rifos.org/' }}
          // source={{ uri: 'http://localhost:3000' }}
          source={{ uri: url }}
          ref={(webview) => { this.webview = webview; }}
          javaScriptEnabled
          domStorageEnabled
          injectedJavaScriptBeforeContentLoaded={jsCode}
          onMessage={(event) => {
            const { data } = event.nativeEvent;
            const payload = JSON.parse(data);
            const { method, params } = payload;
            if (method === 'eth_sendTransaction') {
              try {
                callAuthVerify(async () => {
                  console.log('payload: ', payload);
                  const nonce = await provider.getTransactionCount(wallet.address);
                  const txData = {
                    nonce,
                    data: params[0].data,
                    gasLimit: params[0].gas || 600000,
                    gasPrice: params[0].gasPrice || ethers.utils.bigNumberify(('1200000000')),
                    to: params[0].to,
                  };
                  console.log('txData: ', txData);
                  const signedTransaction = await wallet.sign(txData);
                  console.log('signedTransaction: ', signedTransaction);
                  const result = await provider.sendTransaction(signedTransaction);
                  console.log('result: ', result);
                  this.webview.postMessage(result.hash);
                }, () => null);
              } catch (error) {
                console.log(error);
              }
            } else if (method === 'eth_getTransactionReceipt') {
              rsk3.getTransactionReceipt(params[0]).then((res) => {
                console.log('res: ', res);
                res.status = res.status ? 1 : 0;
                this.webview.postMessage(JSON.stringify(res));
              }).catch((err) => {
                console.log('err: ', err);
                this.webview.postMessage('');
              });
            }
          }}
        />
      </View>
    );
  }
}

DAppBrowser.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  callAuthVerify: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  passcode: state.App.get('passcode'),
});

const mapDispatchToProps = (dispatch) => ({
  callAuthVerify: (callback, fallback) => dispatch(
    appActions.callAuthVerify(callback, fallback),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(DAppBrowser);

import React, { Component } from 'react';
import {
  Platform, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
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
        let resolver, rejecter, hash, status = false
        setTimeout(() => {
          ${Platform.OS === 'ios' ? 'window' : 'document'}.addEventListener("message", function(data) {
            const result = data.data
            if (result) {
              resolver(result)
            } else {
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

        function initWeb3() {
          const rskEndpoint = 'https://public-node.testnet.rsk.co';
          const web3 = new Web3(rskEndpoint);
          window.ethereum = web3;
          window.ethereum.selectedAddress = '${address}'
          window.ethereum.networkVersion = '31'
          window.web3 = web3
          window.web3.toDecimal = web3.utils.toDecimal
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

          window.ethereum.sendAsync = async (payload, callback) => {
            let err, res
            try {
              const {method, params, jsonrpc, id} = payload
              console.log('payload: ', payload)
              let result = ''
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
                result = await provider.getTransactionReceipt(hash)
              }

              console.log('result: ', {id, jsonrpc, result})
              res = {id, jsonrpc, result}
            } catch(err) {
              err = err
            }
            callback(err, res)
          }

          window.ethereum.send = window.ethereum.sendAsync
          window.web3.setProvider(window.ethereum)
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

        loadJsFile('https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js')
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
    const mnemonic = '';
    const provider = new ethers.providers.JsonRpcProvider(rskEndpoint);
    const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/37310'/0'/0/0");
    const wallet = new ethers.Wallet(mnemonicWallet.privateKey, provider);
    const addr = ethers.utils.getAddress(wallet.address.toLowerCase());
    const jsCode = this.getJsCode(addr);

    return (
      <View style={{ flex: 1 }}>
        <OperationHeader title={title} onBackButtonPress={() => navigation.goBack()} />
        <WebView
          // source={{ uri: 'https://faucet.rifos.org/' }}
          source={{ uri: 'https://testnet.manager.rns.rifos.org/' }}
          // source={{ uri: 'http://localhost:3000' }}
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
                  const nonce = await provider.getTransactionCount(wallet.address);
                  const txData = {
                    nonce: nonce + 1,
                    data: params[0].data,
                    gasLimit: params[0].gas,
                    gasPrice: params[0].gasPrice,
                    to: params[0].to,
                  };
                  const signedTransaction = await wallet.sign(txData);
                  console.log('signedTransaction: ', signedTransaction);
                  const result = await provider.sendTransaction(signedTransaction);
                  console.log('result: ', result);
                  this.webview.postMessage(result.hash);
                }, () => null);
              } catch (error) {
                console.log(error);
              }
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

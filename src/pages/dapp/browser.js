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

const contractAddress = ethers.utils.getAddress(('0x248B320687eBf655f9eE7F62F0388c79fBB7b2F4').toLowerCase());
const rskEndpoint = 'https://public-node.testnet.rsk.co';
const abi = [
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
    ],
    name: 'dispense',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x5f746233',
  },
];


class DAppBrowser extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  getJsCode = (address) => `
      (function() {
        let resolver, rejecter, hash, id = 1, status = false
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
          const web3 = new Web3('https://public-node.testnet.rsk.co');
          window.ethereum = web3;
          window.ethereum.selectedAddress = '${address}'
          window.ethereum.networkVersion = '31'
          window.web3 = web3
          window.web3.toDecimal = web3.utils.toDecimal
          const config = {
            isEnabled: true,
            isUnlocked: true,
            networkVersion: '31',
            onboardingcomplete: true,
            selectedAddress: '0x175E749519254AF19BF729Ff2275d9F1D0214dE5',
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
            const { method } = payload
            alert(method)
            let err, res, result
            try {
              if (method === 'eth_getBlockByNumber') {
                result = await web3.eth.getBlock('latest')
              } else if (method === 'eth_sendTransaction') {
                result = await getHash(payload)
                hash = result
              } else if (method === 'eth_getTransactionReceipt') {
                result = await web3.eth.getTransactionReceipt(hash)

                // Need set result to null, otherwise the web will show error alert
                if (result && result.status && status) {
                  alert('Get tRif success')
                  status = result.status
                  result = null
                }
              }

              res = {
                id,
                jsonrpc: '2.0',
                result,
              }
              id += 1
            } catch(err) {
              err = err
            }

            callback(err, res)
          }

          window.ethereum.send = window.ethereum.sendAsync
        }

        const container = (document.head || document.documentElement)
        const content = 'https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js'
        const script = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', content)
        script.onload = () => {
          initWeb3()
          script.remove()
        }
        container.insertBefore(script, container.children[0])
      }) ();
      true
    `

  render() {
    const { navigation, callAuthVerify } = this.props;

    const url = navigation.state.params.url || '';
    const title = navigation.state.params.title || url;

    const mnemonic = 'eye divorce point script garage clutch cream useless pill cheese produce brush';
    const provider = new ethers.providers.JsonRpcProvider(rskEndpoint);
    const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/37310'/0'/0/0");
    const wallet = new ethers.Wallet(mnemonicWallet.privateKey, provider);
    console.log('wallet: ', wallet);
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    console.log('contract: ', contract);
    const addr = ethers.utils.getAddress(wallet.address.toLowerCase());
    console.log('addr: ', addr);
    const jsCode = this.getJsCode(addr);

    return (
      <View style={{ flex: 1 }}>
        <OperationHeader title={title} onBackButtonPress={() => navigation.goBack()} />
        <WebView
          // source={{ uri: 'https://faucet.rifos.org/' }}
          source={{ uri: url }}
          // source={{ uri: 'http://localhost:3000' }}
          ref={(webview) => { this.webview = webview; }}
          javaScriptEnabled
          domStorageEnabled
          injectedJavaScriptBeforeContentLoaded={jsCode}
          onMessage={(event) => {
            const { data } = event.nativeEvent;
            const payload = JSON.parse(data);
            const { method } = payload;
            if (method === 'eth_sendTransaction') {
              try {
                callAuthVerify(() => {
                  contract.dispense(addr).then((tx) => {
                    console.log('tx: ', tx);
                    this.webview.postMessage(tx.hash);
                  }).catch((err) => {
                    console.log('err: ', err);
                    this.webview.postMessage('');
                  });
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

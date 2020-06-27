import React, { Component, createRef } from 'react';
import {
  Platform, View,
} from 'react-native';
import RNFS from 'react-native-fs';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import Rsk3 from '@rsksmart/rsk3';
import { connect } from 'react-redux';
import appActions from '../../redux/app/actions';
import BrowerHeader from '../../components/headers/header.browser';
import ProgressWebView from '../../components/common/progress.webview';
import WalletSelection from '../../components/common/modal/wallet.selection.modal';

const rskEndpoint = 'https://public-node.testnet.rsk.co';
const rsk3 = new Rsk3(rskEndpoint);
const provider = new ethers.providers.JsonRpcProvider(rskEndpoint);

class DAppBrowser extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);

    const { navigation } = this.props;

    const currentWallet = navigation.state.params.wallet || null;

    this.state = {
      canGoBack: false,
      walletSelectionVisible: false,
      wallet: this.generateWallet(currentWallet),
      web3JsContent: '',
    };

    this.webview = createRef();
  }

  componentDidMount() {
    const { web3JsContent } = this.state;
    if (web3JsContent === '') {
      if (Platform.OS === 'ios') {
        RNFS.readFile(`${RNFS.MainBundlePath}/web3.1.2.7.js`, 'utf8')
          .then((content) => {
            this.setState({ web3JsContent: content });
          });
      } else {
        RNFS.readFileAssets('web3.1.2.7.js', 'utf8')
          .then((content) => {
            this.setState({ web3JsContent: content });
          });
      }
    }
  }

  generateWallet = (wallet) => ({ ...wallet, address: ethers.utils.getAddress(wallet.coins[0].address.toLowerCase()) })

  getJsCode = (address) => {
    const { web3JsContent } = this.state;
    return `
      ${web3JsContent}

      (function() {
        let resolver, rejecter, hash
        setTimeout(() => {
          ${Platform.OS === 'ios' ? 'window' : 'document'}.addEventListener("message", function(data) {
            const result = JSON.parse(data.data)
            if (result && result.error && rejecter) {
              rejecter(new Error(result.message))
            } else if (resolver) {
              resolver(result)
            }
          })
        }, 0)

        communicateWithRN = (payload) => {
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
          window.web3.toDecimal = window.web3.utils.toDecimal
          window.web3.toBigNumber = window.web3.utils.toBN
          
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

          window.web3.version = {
            api: '1.2.7',
            getNetwork: () => {return 31},
          }

          window.ethereum.on = (method, callback) => { if (method) {console.log(method)} }

          window.web3.eth.contract = (abi) => {
            const contract = new web3.eth.Contract(abi);
            contract.at = (address) => {
              contract.options.address = address
              return contract
            }

            const { _jsonInterface } = contract;
            _jsonInterface.forEach((item) => {
              if (item.name && item.stateMutability) {
                const method = item.name;
                if (item.stateMutability === 'pure' || item.stateMutability === 'view') {
                  contract[method] = (params, cb) => {
                    console.log('contract method: ', method);
                    contract.methods[method](params).call({ from: '${address}' }, cb);
                  };
                } else {
                  contract[method] = (params, cb) => {
                    console.log('contract method: ', method);
                    contract.methods[method](params).send({ from: '${address}' }, cb);
                  };
                }
              }
            });

            return contract
          }

          const sendAsync = async (payload, callback) => {
            let err, res = {}, result = ''
            const {method, params, jsonrpc, id} = payload
            console.log('payload: ', payload)
            try {
              if (method === 'net_version') {
                result = '31'
              } else if (method === 'eth_requestAccounts') {
                result = ['${address}']
              } else {
                result = await communicateWithRN(payload)
              }

              res = {id, jsonrpc, method, result}
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

        initWeb3()
      }) ();
      true
    `;
  }

  injectJavaScript = (address) => {
    const jsCode = this.getJsCode(address);
    this.webview.current.injectJavaScript(jsCode);
  }

  onNavigationStateChange = (navState) => {
    const { canGoBack } = navState;
    this.setState({ canGoBack });
  }

  onMessage = async (event) => {
    try {
      const { data } = event.nativeEvent;
      const { callAuthVerify } = this.props;
      const { wallet: { coins, address } } = this.state;
      const payload = JSON.parse(data);
      const { method, params } = payload;

      switch (method) {
        case 'eth_estimateGas': {
          const res = await provider.estimateGas(params[0]);
          this.webview.current.postMessage(JSON.stringify(res.toNumber()));
          break;
        }
        case 'eth_gasPrice': {
          const res = await provider.getGasPrice();
          this.webview.current.postMessage(JSON.stringify(res));
          break;
        }
        case 'eth_call': {
          const res = await provider.call(params[0], params[1]);
          this.webview.current.postMessage(JSON.stringify(res));
          break;
        }

        case 'eth_getBlockByNumber': {
          const res = await rsk3.getBlock(params[0]);
          this.webview.current.postMessage(JSON.stringify(res));
          break;
        }

        case 'eth_sendTransaction': {
          callAuthVerify(async () => {
            try {
              const nonce = await provider.getTransactionCount(address);
              const txData = {
                nonce,
                data: params[0].data,
                gasLimit: params[0].gas || 600000,
                gasPrice: params[0].gasPrice || ethers.utils.bigNumberify(('1200000000')),
                to: params[0].to,
                value: (params[0].value && ethers.utils.bigNumberify(params[0].value)) || '0x0',
              };
              const { privateKey } = coins[0];
              const signWallet = new ethers.Wallet(privateKey, provider);
              const signedTransaction = await signWallet.sign(txData);
              const result = await provider.sendTransaction(signedTransaction);
              this.webview.current.postMessage(JSON.stringify(result.hash));
            } catch (err) {
              console.log('err: ', err);
              this.webview.current.postMessage(JSON.stringify({ error: 1, message: err.message }));
            }
          }, () => null);
          break;
        }

        case 'eth_getTransactionReceipt': {
          let res = await rsk3.getTransactionReceipt(params[0]);
          if (!res) {
            res = '';
          }
          this.webview.current.postMessage(JSON.stringify(res));
          break;
        }

        case 'eth_getTransactionByHash': {
          const res = await provider.getTransaction(params[0]);
          this.webview.current.postMessage(JSON.stringify(res));
          break;
        }

        default:
          break;
      }

      if (method === 'eth_call') {
        const res = await provider.call(params[0], params[1]);
        this.webview.current.postMessage(JSON.stringify(res));
      } else if (method === 'eth_getBlockByNumber') {
        const res = await rsk3.getBlock(params[0]);
        this.webview.current.postMessage(JSON.stringify(res));
      }
    } catch (err) {
      const error = { error: 1, message: err.message };
      this.webview.current.postMessage(JSON.stringify(error));
    }
  }

  switchWallet = (toWallet) => {
    if (this.webview.current) {
      const currentWallet = this.generateWallet(toWallet);
      this.setState({ walletSelectionVisible: false, wallet: currentWallet }, () => {
        this.webview.current.reload();
      });
    }
  }

  getWebView = (address, url) => {
    const { web3JsContent } = this.state;
    if (address && web3JsContent) {
      return (
        <ProgressWebView
          source={{ uri: url }}
          ref={this.webview}
          javaScriptEnabled
          onLoadStart={() => { this.injectJavaScript(address); }}
          onNavigationStateChange={this.onNavigationStateChange}
          onMessage={this.onMessage}
        />
      );
    }
    return null;
  }

  render() {
    const { navigation, language } = this.props;
    const {
      walletSelectionVisible, wallet: { address },
    } = this.state;
    const dapp = navigation.state.params.dapp || { url: '', title: '' };
    const { url, title } = dapp;

    return (
      <View style={{ flex: 1 }}>
        <BrowerHeader
          title={(title && title[language]) || url}
          onBackButtonPress={() => {
            const { canGoBack } = this.state;
            if (canGoBack) {
              this.webview.current.goBack();
            } else {
              navigation.goBack();
            }
          }}
          onCloseButtonPress={() => navigation.goBack()}
          onSwitchButtonPress={() => this.setState({ walletSelectionVisible: true })}
        />
        {this.getWebView(address, url)}
        <WalletSelection
          navigation={navigation}
          visible={walletSelectionVisible}
          closeFunction={() => this.setState({ walletSelectionVisible: false })}
          confirmButtonPress={this.switchWallet}
          dapp={dapp}
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
  language: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  passcode: state.App.get('passcode'),
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  callAuthVerify: (callback, fallback) => dispatch(
    appActions.callAuthVerify(callback, fallback),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(DAppBrowser);

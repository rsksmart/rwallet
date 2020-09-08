import React, { Component, createRef } from 'react';
import {
  Platform, View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import RNFS from 'react-native-fs';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import Rsk3 from '@rsksmart/rsk3';
import { connect } from 'react-redux';
import appActions from '../../redux/app/actions';
import BrowserHeader from '../../components/headers/header.dappbrowser';
import ProgressWebView from '../../components/common/progress.webview';
import WalletSelection from '../../components/common/modal/wallet.selection.modal';
import { NETWORK } from '../../common/constants';
import common from '../../common/common';

const { MAINNET, TESTNET } = NETWORK;

const styles = StyleSheet.create({
  loading: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

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
      ethersJsContent: '',
    };

    this.webview = createRef();
    this.setNetwork(currentWallet.network);
  }

  componentDidMount() {
    const { web3JsContent, ethersJsContent } = this.state;
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
    if (ethersJsContent === '') {
      if (Platform.OS === 'ios') {
        RNFS.readFile(`${RNFS.MainBundlePath}/ethers.js`, 'utf8')
          .then((content) => {
            this.setState({ ethersJsContent: content });
          });
      } else {
        RNFS.readFileAssets('ethers.js', 'utf8')
          .then((content) => {
            this.setState({ ethersJsContent: content });
          });
      }
    }
  }

  generateWallet = (wallet) => ({ ...wallet, address: ethers.utils.getAddress(wallet.address.toLowerCase()) })

  setNetwork = (network) => {
    this.rskEndpoint = network === 'Mainnet' ? MAINNET.RSK_END_POINT : TESTNET.RSK_END_POINT;
    this.networkVersion = network === 'Mainnet' ? MAINNET.NETWORK_VERSION : TESTNET.NETWORK_VERSION;
    this.rsk3 = new Rsk3(this.rskEndpoint);
    this.provider = new ethers.providers.JsonRpcProvider(this.rskEndpoint);
  }

  getJsCode = (address) => {
    const { web3JsContent, ethersJsContent } = this.state;
    return `
      ${web3JsContent}
      ${ethersJsContent}

      // Disable the web site notification
      class Notification {
        constructor(title, options) {
          this.title = title;
          this.options = options;
        }
      }

        (function() {
          let resolver = {}
          let rejecter = {}

          ${Platform.OS === 'ios' ? 'window' : 'document'}.addEventListener("message", function(data) {
            try {
              const passData = data.data ? JSON.parse(data.data) : data.data
              const { id, result } = passData
              if (result && result.error && rejecter[id]) {
                rejecter[id](new Error(result.message))
              } else if (resolver[id]) {
                resolver[id](result)
              }
            } catch(err) {
              console.log('listener message err: ', err)
            }
          })

          communicateWithRN = (payload) => {
            return new Promise((resolve, reject) => {
              console.log('JSON.stringify(payload): ', JSON.stringify(payload))
              window.ReactNativeWebView.postMessage(JSON.stringify(payload))
              const { id } = payload
              resolver[id] = resolve
              rejecter[id] = reject
            })
          }

          function initWeb3() {
            // Inject the web3 instance to web site
            const rskEndpoint = '${this.rskEndpoint}';
            const provider = new ethers.providers.JsonRpcProvider(rskEndpoint);
            const web3Provider = new Web3.providers.HttpProvider(rskEndpoint)
            const web3 = new Web3(web3Provider);
            window.ethereum = web3Provider;
            window.ethereum.selectedAddress = '${address}'
            window.ethereum.networkVersion = '${this.networkVersion}'
            window.web3 = web3

            // Adapt web3 old version (new web3 version move toDecimal and toBigNumber to utils class).
            window.web3.toDecimal = window.web3.utils.toDecimal
            window.web3.toBigNumber = window.web3.utils.toBN
            
            const config = {
              isEnabled: true,
              isUnlocked: true,
              networkVersion: '${this.networkVersion}',
              onboardingcomplete: true,
              selectedAddress: '${address}',
            }

            // Some web site using the config to check the window.ethereum is exist or not
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

            window.web3.setProvider(window.ethereum)

            // Override enable function can return the current address to web site
            window.ethereum.enable = () => {
              return new Promise((resolve, reject) => {
                resolve(['${address}'])
              })
            }

            // Adapt web3 old version (new web3 version remove this function)
            window.web3.version = {
              api: '1.2.7',
              getNetwork: (cb) => { cb(null, '${this.networkVersion}') },
            }

            window.ethereum.on = (method, callback) => { if (method) {console.log(method)} }

            // Adapt web3 old version (need to override the abi's method).
            // web3 < 1.0 using const contract = web3.eth.contract(abi).at(address)
            // web3 >= 1.0 using const contract = new web3.eth.Contract()
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

            // Override the sendAsync function so we can listen the web site's call and do our things
            const sendAsync = async (payload, callback) => {
              let err, res = {}, result = ''
              const {method, params, jsonrpc, id} = payload
              console.log('payload: ', payload)
              try {
                if (method === 'net_version') {
                  result = '${this.networkVersion}'
                } else if (method === 'eth_requestAccounts' || method === 'eth_accounts' || payload === 'eth_accounts') {
                  result = ['${address}']
                } else {
                  result = await communicateWithRN(payload)
                }

                res = {id, jsonrpc, method, result}
              } catch(err) {
                err = err
                console.log('sendAsync err: ', err)
              }
              
              console.log('res: ', res)
              callback(err, res)
            }

            // ensure window.ethereum.send and window.ethereum.sendAsync are not undefined
            setTimeout(() => {
              if (!window.ethereum.send) {
                window.ethereum.send = sendAsync
              }
              if (!window.ethereum.sendAsync) {
                window.ethereum.sendAsync = sendAsync
              }
            }, 1000)
          }

          initWeb3()
        }) ();
      true
    `;
  }

  injectJavaScript = (address) => {
    const jsCode = this.getJsCode(address);
    return jsCode;
  }

  onNavigationStateChange = (navState) => {
    const { canGoBack } = navState;
    this.setState({ canGoBack });
  }

  onMessage = async (event) => {
    const { data } = event.nativeEvent;
    const payload = JSON.parse(data);
    const { method, params, id } = payload;

    try {
      const { callAuthVerify } = this.props;
      const { wallet: { coins, address } } = this.state;

      switch (method) {
        case 'eth_estimateGas': {
          const res = await this.provider.estimateGas(params[0]);
          const result = { id, result: res.toNumber() };
          this.webview.current.postMessage(JSON.stringify(result));
          break;
        }
        case 'eth_gasPrice': {
          const res = await this.provider.getGasPrice();
          const result = { id, result: res };
          this.webview.current.postMessage(JSON.stringify(result));
          break;
        }
        case 'eth_call': {
          const res = await this.provider.call(params[0], params[1]);
          const result = { id, result: res };
          this.webview.current.postMessage(JSON.stringify(result));
          break;
        }

        case 'eth_getBlockByNumber': {
          let res = 0;
          // Get latest block info when passed block number is 0.
          const blockNumber = (params[0] && params[0] === '0x0') ? 'latest' : params[0];
          res = await this.rsk3.getBlock(blockNumber);
          const result = { id, result: res };
          this.webview.current.postMessage(JSON.stringify(result));
          break;
        }

        case 'personal_sign': {
          callAuthVerify(async () => {
            try {
              const { privateKey } = coins[0];
              const signWallet = new ethers.Wallet(privateKey, this.provider);
              const message = this.rsk3.utils.hexToAscii(params[0]);
              const signature = await signWallet.signMessage(message);
              const result = { id, result: signature };
              this.webview.current.postMessage(JSON.stringify(result));
            } catch (err) {
              console.log('personal_sign err: ', err);
              this.webview.current.postMessage(JSON.stringify({ id, error: 1, message: err.message }));
            }
          }, () => { this.webview.current.postMessage(JSON.stringify({ id, error: 1, message: 'Verify error' })); });
          break;
        }

        case 'eth_sendTransaction': {
          callAuthVerify(async () => {
            try {
              const nonce = await this.provider.getTransactionCount(address, 'pending');
              const txData = {
                nonce,
                data: params[0].data,
                gasLimit: params[0].gas || 600000,
                gasPrice: params[0].gasPrice || ethers.utils.bigNumberify(('1200000000')),
                to: params[0].to,
                value: (params[0].value && ethers.utils.bigNumberify(params[0].value)) || '0x0',
              };
              const { privateKey } = coins[0];
              const signWallet = new ethers.Wallet(privateKey, this.provider);
              const signedTransaction = await signWallet.sign(txData);
              const res = await this.provider.sendTransaction(signedTransaction);
              const result = { id, result: res.hash };
              this.webview.current.postMessage(JSON.stringify(result));
            } catch (err) {
              console.log('eth_sendTransaction err: ', err);
              this.webview.current.postMessage(JSON.stringify({ id, error: 1, message: err.message }));
            }
          }, () => { this.webview.current.postMessage(JSON.stringify({ id, error: 1, message: 'Verify error' })); });
          break;
        }

        case 'eth_getTransactionReceipt': {
          let res = await this.rsk3.getTransactionReceipt(params[0]);
          if (!res) {
            res = '';
          } else {
            // RNS and tRif faucet's transaction status judge condition: parseInt(status, 16) === 1, so need set true to 1 and false to 0
            res.status = res.status ? 1 : 0;
          }
          const result = { id, result: res };
          this.webview.current.postMessage(JSON.stringify(result));
          break;
        }

        case 'eth_getTransactionByHash': {
          const res = await this.provider.getTransaction(params[0]);
          const result = { id, result: res };
          this.webview.current.postMessage(JSON.stringify(result));
          break;
        }

        default:
          break;
      }
    } catch (err) {
      const error = { id, error: 1, message: err.message };
      this.webview.current.postMessage(JSON.stringify(error));
    }
  }

  switchWallet = (toWallet) => {
    const { navigation } = this.props;
    navigation.replace('DAppBrowser', { wallet: toWallet, dapp: navigation.state.params.dapp });
  }

  getWebView = (address, url) => {
    const { web3JsContent, ethersJsContent } = this.state;
    const dappUrl = common.completionUrl(url);
    if (address && web3JsContent && ethersJsContent) {
      return (
        <ProgressWebView
          source={{ uri: dappUrl }}
          ref={this.webview}
          javaScriptEnabled
          injectedJavaScriptBeforeContentLoaded={this.injectJavaScript(address)}
          onNavigationStateChange={this.onNavigationStateChange}
          onMessage={this.onMessage}
          incognito
        />
      );
    }
    return <ActivityIndicator style={styles.loading} size="large" />;
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
        <BrowserHeader
          title={(title && (title[language] || title.en)) || url}
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
    replace: PropTypes.func.isRequired,
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

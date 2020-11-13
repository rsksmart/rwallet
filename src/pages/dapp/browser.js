import React, { Component, createRef } from 'react';
import {
  Platform, View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import RNFS from 'react-native-fs';
import PropTypes from 'prop-types';
import Rsk3 from '@rsksmart/rsk3';
import { connect } from 'react-redux';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import appActions from '../../redux/app/actions';
import BrowserHeader from '../../components/headers/header.dappbrowser';
import ProgressWebView from '../../components/common/progress.webview';
import WalletSelection from '../../components/common/modal/wallet.selection.modal';
import { NETWORK, TRANSACTION } from '../../common/constants';
import { createErrorNotification, getErrorNotification } from '../../common/notification.controller';
import common from '../../common/common';
import { InvalidAmountError } from '../../common/error';
import { strings } from '../../common/i18n';
import MessageModal from '../wallet/wallet.connect/modal/message';
import TransactionModal from '../wallet/wallet.connect/modal/transaction';
import AllowanceModal from '../wallet/wallet.connect/modal/allowance';
import color from '../../assets/styles/color';
import apiHelper from '../../common/apiHelper';

const { MAINNET, TESTNET } = NETWORK;

// Get modal view width
const MODAL_WIDTH = Dimensions.get('window').width * 0.87;

const styles = StyleSheet.create({
  loading: {
    marginTop: 20,
    alignSelf: 'center',
  },
  backgroundView: {
    flex: 1,
    backgroundColor: color.ebonyA60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: color.white,
    borderRadius: 12,
    width: MODAL_WIDTH,
    paddingTop: 39,
    paddingBottom: 24,
    paddingLeft: 28,
    paddingRight: 28,
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
      modalView: null,
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
        RNFS.readFile(`${RNFS.MainBundlePath}/ethers5.0.js`, 'utf8')
          .then((content) => {
            this.setState({ ethersJsContent: content });
          });
      } else {
        RNFS.readFileAssets('ethers5.0.js', 'utf8')
          .then((content) => {
            this.setState({ ethersJsContent: content });
          });
      }
    }
  }

  // Rif faucet dapp need using lower case address, otherwise will catch invalid address error.
  generateWallet = (wallet) => ({ ...wallet, address: wallet.address.toLowerCase() })

  setNetwork = (network) => {
    this.rskEndpoint = network === 'Mainnet' ? MAINNET.RSK_END_POINT : TESTNET.RSK_END_POINT;
    this.networkVersion = network === 'Mainnet' ? MAINNET.NETWORK_VERSION : TESTNET.NETWORK_VERSION;
    this.rsk3 = new Rsk3(this.rskEndpoint);
  }

  getJsCode = (address) => {
    const { web3JsContent, ethersJsContent } = this.state;
    return `
      ${web3JsContent}
      ${ethersJsContent}

        (function() {
          let resolver = {};
          let rejecter = {};

          ${Platform.OS === 'ios' ? 'window' : 'document'}.addEventListener("message", function(data) {
            try {
              const passData = data.data ? JSON.parse(data.data) : data.data;
              const { id, result } = passData;
              if (result && result.error && rejecter[id]) {
                rejecter[id](new Error(result.message));
              } else if (resolver[id]) {
                resolver[id](result);
              }
            } catch(err) {
              console.log('listener message err: ', err);
            }
          })

          communicateWithRN = (payload) => {
            return new Promise((resolve, reject) => {
              console.log('JSON.stringify(payload): ', JSON.stringify(payload));
              window.ReactNativeWebView.postMessage(JSON.stringify(payload));
              const { id } = payload;
              resolver[id] = resolve;
              rejecter[id] = reject;
            })
          }

          function initNotification() {
            setInterval(() => {
              if (!window.Notification) {
                // Disable the web site notification
                const Notification = class {
                  constructor(title, options) {
                    this.title = title;
                    this.options = options;
                  }
      
                  // Override close function
                  close() {
                  }
      
                  // Override bind function
                  bind(notification) {
                  }
                }
      
                window.Notification = Notification;
              }
            }, 1000)
          }

          function initWeb3() {
            // Inject the web3 instance to web site
            const rskEndpoint = '${this.rskEndpoint}';
            const provider = new Web3.providers.HttpProvider(rskEndpoint);
            const web3Provider = new ethers.providers.Web3Provider(provider)
            const web3 = new Web3(provider);
            window.ethereum = web3Provider;
            window.ethereum.selectedAddress = '${address}';
            window.address = '${address}';
            window.ethereum.networkVersion = '${this.networkVersion}';
            window.web3 = web3;

            // Adapt web3 old version (new web3 version move toDecimal and toBigNumber to utils class).
            window.web3.toDecimal = window.web3.utils.toDecimal;
            window.web3.toBigNumber = window.web3.utils.toBN;
            
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

            window.web3.setProvider(window.ethereum);

            // Override enable function can return the current address to web site
            window.ethereum.enable = () => {
              return new Promise((resolve, reject) => {
                resolve(['${address}']);
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
                contract.options.address = address;
                return contract;
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

              return contract;
            }

            // Override the sendAsync function so we can listen the web site's call and do our things
            const sendAsync = async (payload, callback) => {
              let err, res = '', result = '';
              const {method, params, jsonrpc, id} = payload;
              console.log('payload: ', payload);
              try {
                if (method === 'net_version' || method === 'eth_chainId') {
                  result = '${this.networkVersion}';
                } else if (method === 'eth_requestAccounts' || method === 'eth_accounts' || payload === 'eth_accounts') {
                  result = ['${address}'];
                } else {
                  result = await communicateWithRN(payload);
                }

                res = {id, jsonrpc, method, result};
              } catch(err) {
                err = err;
                console.log('sendAsync err: ', err);
              }
              
              console.log('res: ', res);
              if (callback) {
                callback(err, res);
              } else {
                return res || err;
              }
            }

            // ensure window.ethereum.send and window.ethereum.sendAsync are not undefined
            setInterval(() => {
              if (!window.ethereum.send) {
                window.ethereum.send = sendAsync;
              }
              if (!window.ethereum.sendAsync) {
                window.ethereum.sendAsync = sendAsync;
              }
              if (!window.ethereum.request) {
                window.ethereum.request = sendAsync;
              }
            }, 1000)
          }

          initNotification();
          initWeb3();
        }) ();
      true
    `;
  }

  injectJavaScript = (address) => {
    const jsCode = this.getJsCode(address);
    return jsCode;
  }

  onNavigationStateChange = (navState) => {
    if (navState) {
      const { canGoBack } = navState;
      this.setState({ canGoBack });
    }
  }

  handleEthEstimateGas = async (payload) => {
    const { params, id } = payload;
    const res = await this.rsk3.estimateGas(params[0]);
    const estimateGas = Number(res);
    const result = { id, result: estimateGas };
    this.webview.current.postMessage(JSON.stringify(result));
  }

  handleEthGasPrice = async (payload) => {
    const { id } = payload;
    const res = await this.rsk3.getGasPrice();
    const result = { id, result: res };
    this.webview.current.postMessage(JSON.stringify(result));
  }

  handleEthCall = async (payload) => {
    const { id, params } = payload;
    const res = await this.rsk3.call(params[0], params[1]);
    const result = { id, result: res };
    this.webview.current.postMessage(JSON.stringify(result));
  }

  handleEthGetBlockByNumber = async (payload) => {
    const { id, params } = payload;
    let res = 0;
    // Get latest block info when passed block number is 0.
    const blockNumber = (_.isEmpty(params) || (params[0] && params[0] === '0x0')) ? 'latest' : params[0];
    res = await this.rsk3.getBlock(blockNumber);
    const result = { id, result: res };
    this.webview.current.postMessage(JSON.stringify(result));
  }

  handleEthGetBlockNumber = async (payload) => {
    const { id } = payload;
    const res = await this.rsk3.getBlockNumber();
    const result = { id, result: res };
    this.webview.current.postMessage(JSON.stringify(result));
  }

  handlePersonalSign = async (id, message) => {
    const { callAuthVerify } = this.props;
    const { wallet: { coins } } = this.state;
    callAuthVerify(async () => {
      try {
        const { privateKey } = coins[0];
        const accountInfo = await this.rsk3.accounts.privateKeyToAccount(privateKey);
        const signature = await accountInfo.sign(
          message, privateKey,
        );
        const result = { id, result: signature.signature };
        this.webview.current.postMessage(JSON.stringify(result));
      } catch (err) {
        console.log('personal_sign err: ', err);
        this.handleReject(id, err.message);
      }
    }, () => { this.handleReject(id, 'Verify error'); });
  }

  handleEthSendTransaction = async (id, txData) => {
    const { callAuthVerify } = this.props;
    const { wallet: { coins } } = this.state;
    callAuthVerify(async () => {
      try {
        const { privateKey } = coins[0];
        const accountInfo = await this.rsk3.accounts.privateKeyToAccount(privateKey);
        const signedTransaction = await accountInfo.signTransaction(
          txData, privateKey,
        );
        const { rawTransaction } = signedTransaction;
        this.rsk3.sendSignedTransaction(rawTransaction)
          .on('transactionHash', (hash) => {
            const result = { id, result: hash };
            this.webview.current.postMessage(JSON.stringify(result));
          })
          .on('error', (error) => {
            console.log('sendSignedTransaction error: ', error);
            this.handleReject(id, error.message);
          });
      } catch (err) {
        console.log('eth_sendTransaction err: ', err);
        this.handleReject(id, err.message);
      }
    }, () => { this.handleReject(id, 'Verify error'); });
  }

  handleEthGetTransactionReceipt = async (payload) => {
    const { id, params } = payload;
    let res = await this.rsk3.getTransactionReceipt(params[0]);
    if (!res) {
      res = '';
    } else {
      // RNS and tRif faucet's transaction status judge condition: parseInt(status, 16) === 1, so need set true to 1 and false to 0
      res.status = res.status ? 1 : 0;
    }
    const result = { id, result: res };
    this.webview.current.postMessage(JSON.stringify(result));
  }

  handleEthGetTransactionByHash = async (payload) => {
    const { id, params } = payload;
    const res = await this.rsk3.getTransaction(params[0]);
    const result = { id, result: res };
    this.webview.current.postMessage(JSON.stringify(result));
  }

  handleReject = async (id, message = 'User reject') => {
    this.setState({ modalView: null });
    this.webview.current.postMessage(JSON.stringify({ id, error: 1, message }));
  }

  popupMessageModal = async (payload) => {
    const dappUrl = this.getDappUrl();
    const { id, params } = payload;
    const message = this.rsk3.utils.hexToAscii(params[0]);
    this.setState({
      modalView: (
        <MessageModal
          dappUrl={dappUrl}
          confirmPress={async () => {
            this.setState({ modalView: null });
            await this.handlePersonalSign(id, message);
          }}
          cancelPress={() => this.handleReject(id)}
          message={message}
        />
      ),
    });
  }

  popupAllowanceModal = async (id, txData, symbol) => {
    const dappUrl = this.getDappUrl();
    const { gasLimit, gasPrice } = txData;
    const gasLimitNumber = new BigNumber(gasLimit);
    const gasPriceNumber = new BigNumber(gasPrice);
    const feeWei = gasLimitNumber.multipliedBy(gasPriceNumber).toString();
    const fee = Rsk3.utils.fromWei(feeWei, 'ether');
    this.setState({
      modalView: (
        <AllowanceModal
          dappUrl={dappUrl}
          confirmPress={async () => {
            this.setState({ modalView: null });
            await this.handleEthSendTransaction(id, txData);
          }}
          cancelPress={() => this.handleReject(id)}
          asset={symbol}
          fee={fee}
        />
      ),
    });
  }

  popupNormalTransactionModal = async (id, txData, contractMethod = 'Smart Contract Call') => {
    const { wallet: { address, network } } = this.state;
    const dappUrl = this.getDappUrl();
    const networkId = network === 'Mainnet' ? MAINNET.NETWORK_VERSION : TESTNET.NETWORK_VERSION;
    const from = Rsk3.utils.toChecksumAddress(address, networkId);
    const to = Rsk3.utils.toChecksumAddress(txData.to, networkId);

    this.setState({
      modalView: (
        <TransactionModal
          dappUrl={dappUrl}
          confirmPress={async () => {
            this.setState({ modalView: null });
            await this.handleEthSendTransaction(id, txData);
          }}
          cancelPress={() => this.handleReject(id)}
          txData={{
            ...txData, from, to, gasLimit: String(txData.gasLimit), network,
          }}
          txType={contractMethod}
        />
      ),
    });
  }

  popupTransactionModal = async (payload) => {
    const { wallet: { address, network } } = this.state;
    const { id, params } = payload;
    let { nonce, gasPrice, gas } = params[0];
    const { to, data, value } = params[0];

    if (_.isNull(value)) {
      throw new InvalidAmountError();
    }

    // Calculate nonce from blockchain when nonce is null
    if (!nonce) {
      nonce = await this.rsk3.getTransactionCount(address, 'pending');
    }

    // Get current gasPrice from blockchain when gasPrice is null
    if (!gasPrice) {
      await this.rsk3.getGasPrice().then((latestGasPrice) => {
        gasPrice = latestGasPrice;
      }).catch((err) => {
        console.log('getGasPrice error: ', err);
        gasPrice = TRANSACTION.DEFAULT_GAS_PRICE;
      });
    }

    // Estimate gas with { to, data } when gas is null
    if (!gas) {
      await this.rsk3.estimateGas({
        to,
        data,
      }).then((latestGas) => {
        gas = latestGas;
      }).catch((err) => {
        console.log('estimateGas error: ', err);
        gas = TRANSACTION.DEFAULT_GAS_LIMIT;
      });
    }

    const txData = {
      nonce,
      data,
      gasLimit: gas,
      gasPrice,
      to,
      value,
    };
    const networkId = network === 'Mainnet' ? MAINNET.NETWORK_VERSION : TESTNET.NETWORK_VERSION;
    const toAddress = Rsk3.utils.toChecksumAddress(to, networkId);
    const inputData = data;
    const res = await apiHelper.getAbiByAddress(toAddress);
    if (res && res.abi) {
      const { abi, symbol } = res;
      const input = common.ethereumInputDecoder(abi, inputData);
      if (input && input.method === 'approve') {
        this.popupAllowanceModal(id, txData, symbol);
      } else {
        const contractMethod = (input && input.method) || 'Smart Contract Call';
        this.popupNormalTransactionModal(id, txData, contractMethod);
      }
    } else {
      console.log('abi is not exsit');
      this.popupNormalTransactionModal(id, txData);
    }
  }

  onMessage = async (event) => {
    const { addNotification } = this.props;
    const { data } = event.nativeEvent;
    const payload = JSON.parse(data);
    const { method, id } = payload;

    try {
      switch (method) {
        case 'eth_estimateGas': {
          await this.handleEthEstimateGas(payload);
          break;
        }
        case 'eth_gasPrice': {
          await this.handleEthGasPrice(payload);
          break;
        }
        case 'eth_call': {
          await this.handleEthCall(payload);
          break;
        }

        case 'eth_getBlockByNumber': {
          await this.handleEthGetBlockByNumber(payload);
          break;
        }

        case 'eth_blockNumber': {
          await this.handleEthGetBlockNumber(payload);
          break;
        }

        case 'personal_sign': {
          await this.popupMessageModal(payload);
          break;
        }

        case 'eth_sendTransaction': {
          await this.popupTransactionModal(payload);
          break;
        }

        case 'eth_getTransactionReceipt': {
          await this.handleEthGetTransactionReceipt(payload);
          break;
        }

        case 'eth_getTransactionByHash': {
          await this.handleEthGetTransactionByHash(payload);
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.log('onMessage error: ', err);
      let notification;
      if (err && err.code) {
        notification = getErrorNotification(err.code, strings('page.wallet.walletconnect.tryLater'), err.message);
      } else {
        notification = createErrorNotification(
          'page.dapp.browser.errorTitle',
          'page.dapp.browser.errorContent',
          'page.dapp.browser.errorButton',
        );
      }
      addNotification(notification);
      this.handleReject(id, err.message);
    }
  }

  switchWallet = (toWallet) => {
    const { navigation } = this.props;
    navigation.replace('DAppBrowser', { wallet: toWallet, dapp: navigation.state.params.dapp });
  }

  getWebView = (address) => {
    const { web3JsContent, ethersJsContent } = this.state;
    const dappUrl = this.getDappUrl();
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

  getDappUrl = () => {
    const { navigation } = this.props;
    const dapp = navigation.state.params.dapp || { url: '', title: '' };
    const { url } = dapp;
    const dappUrl = common.completionUrl(url);
    return dappUrl;
  }

  render() {
    const { navigation, language } = this.props;
    const {
      walletSelectionVisible, wallet: { address }, modalView,
    } = this.state;
    const dapp = navigation.state.params.dapp || { url: '', title: '' };
    const { url, title } = dapp;
    const domain = common.getDomain(url);

    return (
      <View style={{ flex: 1 }}>
        <BrowserHeader
          title={(title && (title[language] || title.en)) || domain}
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
        {this.getWebView(address)}
        <WalletSelection
          navigation={navigation}
          visible={walletSelectionVisible}
          closeFunction={() => this.setState({ walletSelectionVisible: false })}
          confirmButtonPress={this.switchWallet}
          dapp={dapp}
        />
        <Modal
          animationType="fade"
          transparent
          visible={modalView !== null}
          onRequestClose={this.onRequestClose}
        >
          <View style={styles.backgroundView}>
            <View style={styles.modalView}>
              {modalView}
            </View>
          </View>
        </Modal>
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
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  passcode: state.App.get('passcode'),
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  callAuthVerify: (callback, fallback) => dispatch(
    appActions.callAuthVerify(callback, fallback),
  ),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DAppBrowser);

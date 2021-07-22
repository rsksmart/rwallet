import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView, Modal, Dimensions, BackHandler,
} from 'react-native';
import WalletConnect from '@walletconnect/client';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import BasePageSimple from '../../base/base.page.simple';
import WalletConnecting from './connecting';
import WalletConnected from './connected';
import MessageModal from './modal/message';
import ContractModal from './modal/contract';
import TransactionModal from './modal/transaction';
import DisconnectModal from './modal/disconnect';
import SuccessModal from './modal/success';
import ErrorModal from './modal/error';
import WalletConnectHeader from '../../../components/headers/header.walletconnect';
import { createErrorNotification, createInfoNotification, getErrorNotification } from '../../../common/notification.controller';

import { strings } from '../../../common/i18n';
import {
  NETWORK, TRANSACTION, WALLET_CONNECT, TIMEOUT_VALUE,
} from '../../../common/constants';
import common from '../../../common/common';
import apiHelper from '../../../common/apiHelper';
import screenHelper from '../../../common/screenHelper';
import color from '../../../assets/styles/color';
import fontFamily from '../../../assets/styles/font.family';
import appActions from '../../../redux/app/actions';
import coinType from '../../../common/wallet/cointype';
import { InsufficientRbtcError } from '../../../common/error';
import reportErrorToServer from '../../../common/error/report.error';

const { MAINNET, TESTNET } = NETWORK;

// WALLET_CONNECTING and WALLET_CONNECTED is the status of contentType, to control the page display
// If contentType === WALLET_CONNECTING will show Wallet Connecting Page
// If contentType === WALLET_CONNECTED will show Wallet Connected Page
const WALLET_CONNECTING = 'WalletConnecting';
const WALLET_CONNECTED = 'WalletConnected';

// Get modal view width
const MODAL_WIDTH = Dimensions.get('window').width * 0.87;

const styles = StyleSheet.create({
  body: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: color.white,
    marginTop: -(200 + screenHelper.topHeight) / 2 + 23,
    elevation: 1,
    paddingVertical: 30,
    paddingHorizontal: 23,
  },
  block: {
    marginTop: 24,
  },
  loadingFont: {
    color: color.black,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
    marginTop: 6,
    alignSelf: 'center',
  },
  dappName: {
    fontSize: 20,
    color: color.black,
    fontWeight: 'bold',
    fontFamily: fontFamily.AvenirHeavy,
  },
  dappUrl: {
    color: color.dustyGray,
    fontSize: 15,
    fontFamily: fontFamily.AvenirBook,
    marginTop: 6,
  },
  title: {
    color: color.black,
    fontWeight: 'bold',
    fontFamily: fontFamily.AvenirHeavy,
    fontSize: 16,
  },
  content: {
    fontFamily: fontFamily.AvenirBook,
    color: color.mineShaft,
    fontSize: 15,
    marginTop: 8,
  },
  address: {
    width: '100%',
    height: 53,
    backgroundColor: color.concrete,
    marginTop: 12,
    shadowColor: color.approxGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  btnsView: {
    position: 'absolute',
    bottom: 40,
    left: 23,
    right: 23,
  },
  btn: {
    width: '100%',
    height: 40,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    borderColor: color.vividBlue,
    borderWidth: 2,
  },
  rejectText: {
    fontFamily: fontFamily.AvenirHeavy,
    fontSize: 16,
    fontWeight: 'bold',
    color: color.vividBlue,
  },
  allowBtn: {
    marginTop: 18,
    backgroundColor: color.vividBlue,
  },
  allowText: {
    fontFamily: fontFamily.AvenirHeavy,
    fontSize: 16,
    fontWeight: 'bold',
    color: color.white,
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

class WalletConnectPage extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);

    this.state = {
      connector: null,
      peerMeta: {
        description: '',
        url: '',
        icons: [],
        name: '',
        ssl: false,
      },
      chainId: 30,
      payload: null,
      selectedWallet: {},
      contentType: null,
      modalView: null,
      isTestnet: false,
      web3: null,
    };
  }

  async componentDidMount() {
    const { navigation, addNotification } = this.props;

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );

    const selectedWallet = this.getWallet();
    this.initNetwork();

    await this.setState({
      modalView: this.renderWalletConnectingView(),
      selectedWallet,
    });

    await this.initWalletConnect();

    // Show timeout alert if cannot connect within 20s
    this.timeout = setTimeout(async () => {
      console.log('show timeout alert');
      await this.setState({ modalView: null });
      const notification = createErrorNotification(
        'page.wallet.walletconnect.timeoutTitle',
        'page.wallet.walletconnect.timeoutBody',
        'page.wallet.walletconnect.timeoutButton',
        () => navigation.goBack(),
      );
      addNotification(notification);
    }, TIMEOUT_VALUE.WALLET_CONNECT);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    const { navigation } = this.props;
    if (!navigation.isFocused()) {
      // The screen is not focused, so don't do anything
      return false;
    }

    this.onBackButtonPress();

    return true;
  }

  // Get current wallet's address and private key
  getWallet = () => {
    const { isTestnet } = this.state;
    const { navigation: { state: { params: { wallet } } } } = this.props;
    const { coins } = wallet;
    const network = isTestnet ? 'Testnet' : 'Mainnet';
    const networkId = isTestnet ? TESTNET.NETWORK_VERSION : MAINNET.NETWORK_VERSION;
    const rskCoins = _.filter(coins, (coin) => coin.symbol !== 'BTC' && coin.type === network);

    // Format coins data: [['RBTC Token', 'RIF Token'], [ ... ], ...]
    // One row shows two tokens
    const coinsListData = [];
    let rowCoinsData = [];
    _.forEach(WALLET_CONNECT.ASSETS, (token, index) => {
      const coinId = isTestnet ? token + network : token;
      const { icon } = coinType[coinId];
      const name = common.getSymbolName(token, network);
      const item = {
        name, icon, selected: false, symbol: token, type: network, token: { symbol: token, type: network },
      };
      const coin = _.find(coins, { symbol: token, type: network });
      if (coin) {
        item.token = coin;
        item.selected = true;
      }

      rowCoinsData.push(item);
      if (index % 2) {
        coinsListData.push(rowCoinsData);
        rowCoinsData = [];
      }
    });

    if (WALLET_CONNECT.ASSETS.length % 2) {
      coinsListData.push(rowCoinsData);
    }

    if (_.isEmpty(rskCoins)) {
      return {
        address: '',
        privateKey: '',
        coins: coinsListData,
      };
    }
    return {
      address: Web3.utils.toChecksumAddress(rskCoins[0].address, networkId),
      privateKey: rskCoins[0].privateKey,
      coins: coinsListData,
    };
  }

  updateWallet = () => {
    const selectedWallet = this.getWallet();
    this.setState({ selectedWallet });
  }

  initWalletConnect = async () => {
    const { navigation } = this.props;
    const { uri } = navigation.state.params;

    try {
      const connector = new WalletConnect({ uri });

      if (!connector.connected) {
        await connector.createSession();
      }

      this.setState({ connector }, () => {
        this.subscribeToEvents();
      });
    } catch (error) {
      console.log('init wallet error: ', error);
      reportErrorToServer({
        developerComment: 'walletConnect: initWalletConnect',
        additionalInfo: { uri },
        errorObject: error,
      });
      throw error;
    }
  }

  initNetwork = () => {
    const { isTestnet } = this.state;
    const rskEndpoint = isTestnet ? TESTNET.RSK_END_POINT : MAINNET.RSK_END_POINT;
    const web3 = new Web3(rskEndpoint);
    const chainId = isTestnet ? TESTNET.NETWORK_VERSION : MAINNET.NETWORK_VERSION;
    this.setState({ chainId, web3 });
  }

  subscribeToEvents = () => {
    console.log('ACTION', 'subscribeToEvents');
    const { connector } = this.state;
    const { navigation, addNotification } = this.props;

    if (connector) {
      connector.on('session_request', async (error, payload) => {
        console.log('EVENT', 'session_request');

        if (error) {
          throw error;
        }

        const { peerMeta } = payload.params[0];
        this.setState({
          peerMeta,
          modalView: null,
          contentType: WALLET_CONNECTING,
          connector,
        });

        // Clear timeout if wallet connect establish session connect
        clearTimeout(this.timeout);
      });

      connector.on('session_update', (error) => {
        console.log('EVENT', 'session_update');

        if (error) {
          throw error;
        }
      });

      connector.on('call_request', async (error, payload) => {
        // tslint:disable-next-line
        console.log('EVENT', 'call_request', 'payload', payload);

        if (error) {
          throw error;
        }

        await this.setState({ payload });

        this.popupOperationModal(payload);
      });

      connector.on('connect', (error) => {
        console.log('EVENT', 'connect');

        if (error) {
          throw error;
        }
      });

      connector.on('disconnect', (error) => {
        console.log('EVENT', 'disconnect');

        if (error) {
          throw error;
        }

        const { peerMeta } = this.state;
        const notification = createInfoNotification(
          'page.wallet.walletconnect.disconnectAlertTitle',
          strings('page.wallet.walletconnect.disconnectAlertContent', { dappName: (peerMeta && peerMeta.name) || '' }),
          'page.wallet.walletconnect.okGotIt',
          () => navigation.goBack(),
        );
        addNotification(notification);
      });

      this.setState({ connector });
    }
  };

  approveSession = () => {
    console.log('ACTION', 'approveSession');
    const {
      connector, chainId, selectedWallet,
    } = this.state;
    const { address } = selectedWallet;
    if (connector) {
      connector.approveSession({ chainId, accounts: [address] });
    }
    this.setState({
      connector,
      contentType: WALLET_CONNECTED,
    });
  };

  rejectSession = () => {
    console.log('ACTION', 'rejectSession');
    const { connector } = this.state;
    if (connector) {
      connector.rejectSession();
    }
    this.setState({ connector });
  };

  killSession = () => {
    console.log('ACTION', 'killSession');
    const { connector } = this.state;
    if (connector) {
      connector.killSession();
    }
  };

  approveRequest = async () => {
    const { callAuthVerify } = this.props;

    await this.setState({ modalView: null });

    callAuthVerify(async () => {
      try {
        await this.handleCallRequest();
        await this.closeRequest();
      } catch (err) {
        this.handleError(err);
      }
    }, () => {
      this.handleError();
    });
  }

  rejectRequest = async () => {
    const { connector, payload } = this.state;
    if (connector) {
      connector.rejectRequest({
        id: payload.id,
        error: { message: 'Failed or Rejected Request' },
      });
    }
    await this.closeRequest();
    await this.setState({ connector, modalView: null });
  };

  closeRequest = async () => {
    await this.setState({
      payload: null,
    });
  };

  popupDisconnectModal = async () => {
    this.setState({
      modalView: <DisconnectModal
        confirmPress={() => {
          this.closeModalPress();
          this.killSession();
        }}
        cancelPress={this.closeModalPress}
      />,
    });
  }

  popupTransactionModal = async () => {
    const { payload: { params }, chainId } = this.state;
    const toAddress = params[0].to;
    const txData = await this.generateTxData();
    await this.setState({ txData });

    const isContractAddress = await common.isContractAddress(toAddress, chainId);
    if (isContractAddress) {
      // popup contract modal
      const input = params[0].data;
      const res = await apiHelper.getAbiByAddress(toAddress);
      if (res && res.abi) {
        const { abi, symbol } = res;
        const inputData = common.ethereumInputDecoder(abi, input);

        const formatedInputData = common.formatContractABIInputData(inputData, symbol);
        if (formatedInputData) {
          // popup decode contract modal
          this.popupContractModal(formatedInputData);
        } else {
          // popup default contract modal
          this.popupContractModal();
        }
      } else {
        // popup default contract modal
        this.popupContractModal();
      }
    } else {
      // popup normal transaction modal
      this.popupNormalTransactionModal();
    }
  }

  popupContractModal = async (formatedInputData) => {
    const {
      peerMeta, txData, chainId, selectedWallet: { address }, isTestnet,
    } = this.state;
    const from = Web3.utils.toChecksumAddress(address, chainId);
    const to = Web3.utils.toChecksumAddress(txData.to, chainId);

    this.setState({
      modalView: (
        <ContractModal
          dappUrl={peerMeta.url}
          confirmPress={this.approveRequest}
          cancelPress={this.rejectRequest}
          txData={{
            ...txData, from, to, network: isTestnet ? 'Testnet' : 'Mainnet',
          }}
          abiInputData={formatedInputData}
        />
      ),
    });
  }

  popupMessaageModal = async (message) => {
    const { peerMeta } = this.state;
    this.setState({
      modalView: (
        <MessageModal
          dappUrl={peerMeta.url}
          confirmPress={this.approveRequest}
          cancelPress={this.rejectRequest}
          message={message}
        />
      ),
    });
  }

  popupNormalTransactionModal = async () => {
    const {
      peerMeta, txData, chainId, selectedWallet: { address }, isTestnet,
    } = this.state;
    const from = Web3.utils.toChecksumAddress(address, chainId);
    const to = Web3.utils.toChecksumAddress(txData.to, chainId);

    this.setState({
      modalView: (
        <TransactionModal
          dappUrl={peerMeta.url}
          confirmPress={this.approveRequest}
          cancelPress={this.rejectRequest}
          txData={{
            ...txData, from, to, network: isTestnet ? 'Testnet' : 'Mainnet',
          }}
        />
      ),
    });
  }

  popupOperationModal = async (payload) => {
    try {
      const { method, params } = payload;

      switch (method) {
        case 'personal_sign': {
          const message = Web3.utils.hexToAscii(params[0]);
          await this.popupMessaageModal(message);
          break;
        }

        case 'eth_sign': {
          const message = Web3.utils.hexToAscii(params[1]);
          await this.popupMessaageModal(message);
          break;
        }

        case 'eth_signTypedData': {
        // popup sign typed data modal
          break;
        }

        case 'eth_sendTransaction': {
          await this.popupTransactionModal();
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log('popupOperationModal error: ', error);
      reportErrorToServer({
        developerComment: 'walletConnect: popupOperationModal',
        errorObject: error,
      });
      this.handleError(error);
    }
  }

  insufficientRBTC = async () => {
    const {
      txData: { gasLimit, gasPrice, value }, selectedWallet: { address }, web3,
    } = this.state;
    const gasLimitNumber = new BigNumber(gasLimit);
    const gasPriceNumber = new BigNumber(gasPrice);
    const valueNumber = new BigNumber(value);
    const total = gasLimitNumber.multipliedBy(gasPriceNumber).plus(valueNumber).toString();
    const balance = await web3.getBalance(address.toLowerCase());
    return Number(balance) < Number(total);
  }

  handleCallRequest = async () => {
    try {
      const {
        selectedWallet: { privateKey }, payload, connector,
      } = this.state;
      const { id, method, params } = payload;

      let result = null;
      switch (method) {
        case 'personal_sign': {
          const message = Web3.utils.hexToAscii(params[0]);
          result = await this.signMessage(privateKey, message);
          await connector.approveRequest({ id, result });
          this.setState({ modalView: (<SuccessModal title={strings('page.wallet.walletconnect.signApproved')} description={strings('page.wallet.walletconnect.signApprovedDesc')} cancelPress={this.closeModalPress} />) });
          break;
        }

        case 'eth_sign': {
          const message = Web3.utils.hexToAscii(params[1]);
          result = await this.signMessage(privateKey, message);
          await connector.approveRequest({ id, result });
          this.setState({ modalView: (<SuccessModal title={strings('page.wallet.walletconnect.signApproved')} description={strings('page.wallet.walletconnect.signApprovedDesc')} cancelPress={this.closeModalPress} />) });
          break;
        }

        case 'eth_signTypedData': {
          break;
        }

        case 'eth_sendTransaction': {
          const insufficientRBTC = await this.insufficientRBTC();
          if (insufficientRBTC) {
            throw new InsufficientRbtcError();
          }

          // Show loading when transaction is signing or sending
          await this.setState({ modalView: this.renderTransactionSigningView() });
          result = await this.sendTransaction(privateKey);
          await connector.approveRequest({ id, result });

          this.setState({
            modalView: (
              <SuccessModal
                title={strings('page.wallet.walletconnect.transactionApproved')}
                description={strings('page.wallet.walletconnect.successDesc')}
                cancelPress={this.closeModalPress}
              />),
          });
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log('handleCallRequest error: ', error);
      reportErrorToServer({
        developerComment: 'walletConnect: handleCallRequest',
        errorObject: error,
      });
      throw error;
    }
  }

  handleError = async (error) => {
    const { addNotification } = this.props;
    const { connector } = this.state;
    await this.setState({ connector, modalView: null });

    if (error && error.code) {
      const notification = getErrorNotification(error.code, strings('page.wallet.walletconnect.tryLater'), {}, this.rejectRequest);
      addNotification(notification);
    } else {
      this.setState({ modalView: <ErrorModal tryAgain={this.approveRequest} tryLater={this.rejectRequest} /> });
    }
  }

  generateTxData = async () => {
    const {
      selectedWallet: { address }, payload: { params }, web3,
    } = this.state;

    let {
      nonce, gasPrice, gas, value,
    } = params[0];
    const { to, data } = params[0];

    // When value is undefiend, set to default value.
    if (!value) {
      value = TRANSACTION.DEFAULT_VALUE;
    }
    if (!nonce) {
      // Get nonce if params[0].nonce is null
      nonce = await web3.getTransactionCount(address.toLowerCase(), 'pending');
    }
    if (!gasPrice) {
      // Get gasPrice if params[0].gasPrice is null
      await web3.getGasPrice().then((latestGasPrice) => {
        gasPrice = latestGasPrice;
      }).catch((err) => {
        console.log('getGasPrice error: ', err);
        gasPrice = TRANSACTION.DEFAULT_GAS_PRICE;
      });
    }

    if (!gas) {
      await web3.estimateGas({
        from: address.toLowerCase(),
        to,
        data,
        value,
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
      // gas * 1.5 to ensure gas limit is enough
      gasLimit: parseInt(gas * 1.5, 10),
      gasPrice,
      to,
      value,
    };

    return txData;
  }

  signMessage = async (privateKey, message) => {
    const { web3 } = this.state;
    const accountInfo = await web3.accounts.privateKeyToAccount(privateKey);
    const signature = await accountInfo.sign(
      message, privateKey,
    );

    return signature.signature;
  }

  sendTransaction = async (privateKey) => {
    const { txData, web3 } = this.state;
    console.log('sendTransaction txData: ', txData);
    const accountInfo = await web3.accounts.privateKeyToAccount(privateKey);
    const signedTransaction = await accountInfo.signTransaction(
      txData, privateKey,
    );

    const { rawTransaction } = signedTransaction;
    return new Promise((resolve, reject) => {
      web3.sendSignedTransaction(rawTransaction)
        .on('transactionHash', (hash) => {
          resolve(hash);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  closeModalPress = () => {
    this.setState({ modalView: null, payload: null });
  }

  onBackButtonPress = () => {
    const { connector } = this.state;
    if (connector.connected) {
      this.popupDisconnectModal();
    } else {
      this.rejectSession();
    }
  }

  onRequestClose = () => {
    const { modalView, payload } = this.state;
    if (modalView && payload && payload.id) {
      this.rejectRequest();
    } else {
      this.closeModalPress();
    }
  }

  onSwitchValueChanged = async () => {
    const { isTestnet } = this.state;
    await this.setState({ isTestnet: !isTestnet });
    this.initNetwork();
    this.updateWallet();
  }

  renderWalletConnectingView = () => (
    <View>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingFont}>{strings('page.wallet.walletconnect.isConnecting')}</Text>
    </View>
  )

  renderTransactionSigningView = () => (
    <View>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingFont}>{strings('page.wallet.walletconnect.isSigning')}</Text>
    </View>
  )

  renderContentView = () => {
    const {
      contentType, peerMeta, selectedWallet, isTestnet,
    } = this.state;
    const { navigation: { state: { params: { wallet } } } } = this.props;
    const { address, coins } = selectedWallet;
    const { name, url } = peerMeta;
    if (contentType === WALLET_CONNECTING) {
      return (
        <WalletConnecting
          wallet={wallet}
          updateWallet={this.updateWallet}
          approve={this.approveSession}
          reject={this.rejectSession}
          address={address}
          dappName={name}
          dappUrl={url}
          isTestnet={isTestnet}
          onSwitchValueChanged={this.onSwitchValueChanged}
          coins={coins}
        />
      );
    }
    if (contentType === WALLET_CONNECTED) {
      return (
        <WalletConnected
          disconnect={this.popupDisconnectModal}
          dappName={name}
          dappUrl={url}
          address={address}
        />
      );
    }
    return null;
  }

  render() {
    const { modalView } = this.state;

    return (
      <BasePageSimple
        isSafeView
        headerComponent={(
          <WalletConnectHeader
            title={strings('page.wallet.walletconnect.title')}
            onBackButtonPress={this.onBackButtonPress}
          />
        )}
      >
        <ScrollView style={styles.body} contentContainerStyle={{ flexGrow: 1 }}>
          {this.renderContentView()}

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
        </ScrollView>
      </BasePageSimple>
    );
  }
}

WalletConnectPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.string.isRequired,
    }).isRequired,
    isFocused: PropTypes.func.isRequired,
  }).isRequired,
  callAuthVerify: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  callAuthVerify: (callback, fallback) => dispatch(
    appActions.callAuthVerify(callback, fallback),
  ),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnectPage);

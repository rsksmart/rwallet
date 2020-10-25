import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView, Modal, Dimensions, BackHandler,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import WalletConnect from '@walletconnect/client';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Rsk3 from '@rsksmart/rsk3';

import BasePageSimple from '../../base/base.page.simple';
import WalletConnecting from './connecting';
import WalletConnected from './connected';
import AllowanceModal from './modal/allowance';
import MessageModal from './modal/message';
import TransactionModal from './modal/transaction';
import DisconnectModal from './modal/disconnect';
import SuccessModal from './modal/success';
import ErrorModal from './modal/error';
import WalletConnectHeader from '../../../components/headers/header.walletconnect';
import { createInfoNotification } from '../../../common/notification.controller';

import { strings } from '../../../common/i18n';
import { NETWORK, TRANSACTION, WALLET_CONNECT } from '../../../common/constants';
import common from '../../../common/common';
import apiHelper from '../../../common/apiHelper';
import screenHelper from '../../../common/screenHelper';
import color from '../../../assets/styles/color';
import fontFamily from '../../../assets/styles/font.family';
import appActions from '../../../redux/app/actions';
import coinType from '../../../common/wallet/cointype';

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
      inputDecode: null,
      symbol: null,
      selectedWallet: {},
      contentType: null,
      modalView: null,
      isTestnet: false,
      rsk3: null,
    };
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );

    const selectedWallet = this.getWallet();
    this.initNetwork();
    // setTimeout 500ms in order to ui change smoothly
    setTimeout(async () => {
      await this.setState({
        modalView: this.renderWalletConnectingView(),
        selectedWallet,
      });

      await this.initWalletConnect();
    }, 500);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    const { connector } = this.state;
    const { navigation } = this.props;
    if (connector.connected) {
      this.closePress();
      this.killSession();
    }
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Dashboard' }),
      ],
    });
    navigation.dispatch(resetAction);
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
      const coinId = isTestnet === 'Testnet' ? token + network : token;
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
      address: Rsk3.utils.toChecksumAddress(rskCoins[0].address, networkId),
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
      throw error;
    }
  }

  initNetwork = () => {
    const { isTestnet } = this.state;
    const rskEndpoint = isTestnet ? TESTNET.RSK_END_POINT : MAINNET.RSK_END_POINT;
    const rsk3 = new Rsk3(rskEndpoint);
    const chainId = isTestnet ? TESTNET.NETWORK_VERSION : MAINNET.NETWORK_VERSION;
    this.setState({ chainId, rsk3 });
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

        this.popupOperationModal();
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
    const { navigation } = this.props;
    if (connector) {
      connector.rejectSession();
    }
    this.setState({ connector });
    navigation.goBack();
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

    setTimeout(async () => {
      callAuthVerify(async () => {
        try {
          await this.handleCallRequest();
          await this.closeRequest();
        } catch (err) {
          this.handleError();
        }
      }, () => {
        this.handleError();
      });
    }, 500);
  }

  rejectRequest = async () => {
    console.log('rejectRequest');
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
    const toAddress = Rsk3.utils.toChecksumAddress(params[0].to, chainId);
    const inputData = params[0].data;
    const res = await apiHelper.getAbiByAddress(toAddress);
    const txData = await this.generateTxData();
    await this.setState({ txData });
    if (res && res.abi) {
      const { abi, symbol } = res;
      const input = common.ethereumInputDecoder(abi, inputData);
      await this.setState({ inputDecode: input, symbol });
      if (input && input.method === 'approve') {
        this.popupAllowanceModal();
      } else {
        const contractMethod = (input && input.method) || 'Smart Contract Call';
        this.popupNormalTransactionModal(contractMethod);
      }
    } else {
      console.log('abi is not exsit');
      this.popupNormalTransactionModal();
    }
  }

  popupAllowanceModal = async () => {
    const { peerMeta, symbol, txData } = this.state;
    const { gasLimit, gasPrice } = txData;
    const gasLimitNumber = Rsk3.utils.hexToNumber(gasLimit);
    const gasPriceNumber = Rsk3.utils.hexToNumber(gasPrice);
    const feeWei = gasLimitNumber * gasPriceNumber;
    const fee = Rsk3.utils.fromWei(String(feeWei), 'ether');
    this.setState({
      modalView: (
        <AllowanceModal
          dappUrl={peerMeta.url}
          confirmPress={this.approveRequest}
          cancelPress={this.rejectRequest}
          asset={symbol}
          fee={fee}
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

  popupNormalTransactionModal = async (contractMethod = 'Smart Contract Call') => {
    const {
      peerMeta, txData, chainId, selectedWallet: { address },
    } = this.state;
    const from = Rsk3.utils.toChecksumAddress(address, chainId);
    const to = Rsk3.utils.toChecksumAddress(txData.to, chainId);

    this.setState({
      modalView: (
        <TransactionModal
          dappUrl={peerMeta.url}
          confirmPress={this.approveRequest}
          cancelPress={this.rejectRequest}
          txData={{ ...txData, from, to }}
          txType={contractMethod}
        />
      ),
    });
  }

  popupOperationModal = async () => {
    const { payload: { method, params } } = this.state;

    switch (method) {
      case 'personal_sign': {
        const message = Rsk3.utils.hexToAscii(params[0]);
        this.popupMessaageModal(message);
        break;
      }

      case 'eth_sign': {
        const message = Rsk3.utils.hexToAscii(params[1]);
        this.popupMessaageModal(message);
        break;
      }

      case 'eth_signTypedData': {
        // popup sign typed data modal
        break;
      }

      case 'eth_sendTransaction': {
        this.popupTransactionModal();
        break;
      }

      default:
        break;
    }
  }

  handleCallRequest = async () => {
    try {
      const {
        selectedWallet: { privateKey }, payload, connector, inputDecode,
      } = this.state;
      const { id, method, params } = payload;

      let result = null;
      switch (method) {
        case 'personal_sign': {
          const message = Rsk3.utils.hexToAscii(params[0]);
          result = await this.signMessage(privateKey, message);
          await connector.approveRequest({ id, result });
          this.setState({ modalView: (<SuccessModal title={strings('page.wallet.walletconnect.signApproved')} description={strings('page.wallet.walletconnect.signApprovedDesc')} cancelPress={this.closeModalPress} />) });
          break;
        }

        case 'eth_sign': {
          const message = Rsk3.utils.hexToAscii(params[1]);
          result = await this.signMessage(privateKey, message);
          await connector.approveRequest({ id, result });
          this.setState({ modalView: (<SuccessModal title={strings('page.wallet.walletconnect.signApproved')} description={strings('page.wallet.walletconnect.signApprovedDesc')} cancelPress={this.closeModalPress} />) });
          break;
        }

        case 'eth_signTypedData': {
          break;
        }

        case 'eth_sendTransaction': {
          // Show loading when transaction is signing or sending
          await this.setState({ modalView: this.renderTransactionSigningView() });
          result = await this.sendTransaction(privateKey);
          await connector.approveRequest({ id, result });

          setTimeout(() => {
            if (inputDecode && inputDecode.method === 'approve') {
              this.setState({ modalView: (<SuccessModal title={strings('page.wallet.walletconnect.allowanceApproved')} cancelPress={this.closeModalPress} />) });
            } else {
              this.setState({ modalView: (<SuccessModal title={strings('page.wallet.walletconnect.transactionApproved')} cancelPress={this.closeModalPress} />) });
            }
          }, 500);
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log('handleCallRequest error: ', error);
      throw error;
    }
  }

  handleError = async () => {
    const { connector } = this.state;

    await this.setState({ connector, modalView: null });
    setTimeout(() => {
      this.setState({ modalView: <ErrorModal tryAgain={this.approveRequest} tryLater={this.rejectRequest} /> });
    }, 500);
  }

  generateTxData = async () => {
    const {
      selectedWallet: { address }, payload: { params }, rsk3,
    } = this.state;

    let { nonce, gasPrice } = params[0];
    if (!nonce) {
      // Get nonce if params[0].nonce is null
      nonce = await rsk3.getTransactionCount(address.toLowerCase(), 'pending');
    }
    if (!gasPrice) {
      // Get gasPrice if params[0].gasPrice is null
      gasPrice = await rsk3.getGasPrice();
    }

    const txData = {
      nonce,
      data: params[0].data,
      gasLimit: params[0].gas || TRANSACTION.DEFAULT_GAS_LIMIT,
      gasPrice,
      to: params[0].to,
      value: params[0].value || TRANSACTION.DEFAULT_VALUE,
    };

    return txData;
  }

  signMessage = async (privateKey, message) => {
    const { rsk3 } = this.state;
    const accountInfo = await rsk3.accounts.privateKeyToAccount(privateKey);
    const signature = await accountInfo.sign(
      message, privateKey,
    );

    return signature.signature;
  }

  sendTransaction = async (privateKey) => {
    const { txData, rsk3 } = this.state;
    console.log('sendTransaction txData: ', txData);
    const accountInfo = await rsk3.accounts.privateKeyToAccount(privateKey);
    const signedTransaction = await accountInfo.signTransaction(
      txData, privateKey,
    );

    const { rawTransaction } = signedTransaction;
    return new Promise((resolve, reject) => {
      rsk3.sendSignedTransaction(rawTransaction)
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
    const { payload } = this.state;
    if (payload) {
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
        isSafeView={false}
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
    state: PropTypes.object.isRequired,
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

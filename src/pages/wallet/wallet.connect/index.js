import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, ScrollView, Modal, Dimensions, Alert, BackHandler,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import WalletConnect from '@walletconnect/client';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ethers } from 'ethers';
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

import { strings } from '../../../common/i18n';
import WaleltConnectHeader from '../../../components/headers/header.walletconnect';
import CONSTANTS from '../../../common/constants.json';
import common from '../../../common/common';
import apiHelper from '../../../common/apiHelper';
import screenHelper from '../../../common/screenHelper';
import color from '../../../assets/styles/color';
import appActions from '../../../redux/app/actions';

const { NETWORK: { MAINNET, TESTNET } } = CONSTANTS;

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
    fontFamily: 'Avenir',
    marginTop: 6,
    alignSelf: 'center',
  },
  dappName: {
    fontSize: 20,
    color: color.black,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
  },
  dappUrl: {
    color: '#9B9B9B',
    fontSize: 15,
    fontFamily: 'Avenir',
    marginTop: 6,
  },
  title: {
    color: color.black,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    fontSize: 16,
  },
  content: {
    fontFamily: 'Avenir',
    color: '#2D2D2D',
    fontSize: 15,
    marginTop: 8,
  },
  address: {
    width: '100%',
    height: 53,
    backgroundColor: '#F3F3F3',
    marginTop: 12,
    shadowColor: '#909090',
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
    borderColor: '#028CFF',
    borderWidth: 2,
  },
  rejectText: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#028CFF',
  },
  allowBtn: {
    marginTop: 18,
    backgroundColor: '#028CFF',
  },
  allowText: {
    fontFamily: 'Avenir',
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
      selectedWallet: {},
      contentView: null,
      modalView: null,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    setTimeout(async () => {
      await this.setState({
        modalView: this.renderWalletConnectingView(),
      });

      const selectedWallet = await this.getWallet();
      if (selectedWallet) {
        await this.setState({ selectedWallet });
        this.initWalletConnect();
        this.initNetwork('Mainnet');
      } else {
        Alert.alert(
          'Please select the wallet has rsk asset',
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                this.setState({ modalView: null });
                setTimeout(() => {
                  navigation.goBack();
                }, 500);
              },
            },
          ],
          { cancelable: false },
        );
      }
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

  renderWalletConnectingView = () => (
    <View>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingFont}>Wallet is connecting...</Text>
    </View>
  )

  renderTransactionSigningView = () => (
    <View>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingFont}>Transaction is signing...</Text>
    </View>
  )

  initWalletConnect = async () => {
    const { navigation } = this.props;
    const { uri } = navigation.state.params;

    try {
      const connector = new WalletConnect({ uri });

      if (!connector.connected) {
        await connector.createSession();
      }

      console.log('connector: ', connector);

      this.setState({ connector });

      this.subscribeToEvents();
    } catch (error) {
      console.log('init wallet error: ', error);
      throw error;
    }
  }

  getWallet = () => {
    const { navigation: { state: { params: { wallet } } } } = this.props;
    const ethWallets = [];
    const { coins } = wallet;
    const ethChainCoins = _.filter(coins, (coin) => coin.id !== 'BTC');
    if (!_.isEmpty(ethChainCoins)) {
      ethWallets.push({
        address: ethChainCoins[0].address,
        privateKey: ethChainCoins[0].privateKey,
      });
      return {
        address: ethChainCoins[0].address,
        privateKey: ethChainCoins[0].privateKey,
      };
    }
    return null;
  }

  initNetwork = async (network) => {
    this.rskEndpoint = network === 'Mainnet' ? MAINNET.RSK_END_POINT : TESTNET.RSK_END_POINT;
    this.provider = new ethers.providers.JsonRpcProvider(this.rskEndpoint);
    const chainId = network === 'Mainnet' ? MAINNET.NETWORK_VERSION : TESTNET.NETWORK_VERSION;
    this.setState({ chainId });
  }

  subscribeToEvents = () => {
    console.log('ACTION', 'subscribeToEvents');
    const { connector, selectedWallet } = this.state;
    const { navigation } = this.props;

    if (connector) {
      connector.on('session_request', async (error, payload) => {
        console.log('EVENT', 'session_request');

        if (error) {
          throw error;
        }

        const { peerMeta } = payload.params[0];
        console.log('payload: ', payload);
        console.log('peerMeta: ', peerMeta);
        const address = Rsk3.utils.toChecksumAddress(selectedWallet.address);
        this.setState({
          peerMeta,
          modalView: null,
          contentView: <WalletConnecting approve={this.approveSession} reject={this.rejectSession} address={address} dappName={peerMeta.name} dappUrl={peerMeta.url} />,
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
        const { method, params } = payload;
        // tslint:disable-next-line
        console.log('EVENT', 'call_request', 'payload', payload);
        console.log('EVENT', 'call_request', 'method', method);
        console.log('EVENT', 'call_request', 'params', params);

        if (error) {
          throw error;
        }

        await this.setState({ payload });

        this.popupOperationModal();
      });

      connector.on('connect', (error, payload) => {
        console.log('EVENT', 'connect');

        if (error) {
          throw error;
        }
      });

      connector.on('disconnect', (error, payload) => {
        console.log('EVENT', 'disconnect');

        if (error) {
          throw error;
        }

        navigation.goBack();
      });

      this.setState({ connector });
    }
  };

  approveSession = () => {
    console.log('ACTION', 'approveSession');
    const {
      connector, chainId, selectedWallet, peerMeta,
    } = this.state;
    console.log('connector: ', connector);
    const address = Rsk3.utils.toChecksumAddress(selectedWallet.address);
    if (connector) {
      connector.approveSession({ chainId, accounts: [address] });
    }
    const dappName = peerMeta.name;
    const dappUrl = peerMeta.url;
    this.setState({
      connector,
      contentView: (
        <WalletConnected
          disconnect={this.popupDisconnectModal}
          dappName={dappName}
          dappUrl={dappUrl}
          address={address}
        />),
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
    const { navigation } = this.props;
    if (connector) {
      connector.killSession();
      navigation.goBack();
    }
  };

  signMessage = async (signWallet, message) => {
    const signature = await signWallet.signMessage(message);
    return signature;
  }

  sendTransaction = async (signWallet) => {
    try {
      const { selectedWallet: { address }, payload: { params } } = this.state;
      const nonce = await this.provider.getTransactionCount(Rsk3.utils.toChecksumAddress(address), 'pending');
      const gasPrice = await this.provider.getGasPrice();
      const value = params[0].value ? Rsk3.utils.toHex(Rsk3.utils.toBN(params[0].gasPrice)) : '0x0';
      const txData = {
        nonce,
        data: params[0].data,
        gasLimit: params[0].gas || 600000,
        gasPrice: params[0].gasPrice || gasPrice,
        to: Rsk3.utils.toChecksumAddress(params[0].to),
        value,
      };
      console.log('txData: ', txData);
      const rawTransaction = await signWallet.sign(txData);
      console.log('rawTransaction: ', rawTransaction);
      const res = await this.provider.sendTransaction(rawTransaction);
      const { hash } = res;
      console.log('hash: ', hash);
      return hash;
    } catch (error) {
      console.log('send transaction error: ', error);
      throw error;
    }
  }

  popupDisconnectModal = async () => {
    const { navigation } = this.props;
    this.setState({
      modalView: <DisconnectModal
        confirmPress={() => {
          this.closePress();
          this.killSession();
          setTimeout(() => {
            navigation.goBack();
          }, 500);
        }}
        cancelPress={this.closePress}
      />,
    });
  }

  popupAllowanceModal = async () => {
    const { peerMeta } = this.state;
    const dappUrl = peerMeta.url;
    this.setState({
      modalView: (
        <AllowanceModal
          dappUrl={dappUrl}
          confirmPress={this.approveRequest}
          cancelPress={this.rejectRequest}
          asset="RIF"
          fee="0.00006"
        />
      ),
    });
  }

  popupMessaageModal = async (message) => {
    const { peerMeta } = this.state;
    const dappUrl = peerMeta.url;
    this.setState({
      modalView: (
        <MessageModal
          dappUrl={dappUrl}
          confirmPress={this.approveRequest}
          cancelPress={this.rejectRequest}
          message={message}
        />
      ),
    });
  }

  popupTransactionModal = async (contractMethod = 'Smart Contract Call') => {
    const { selectedWallet: { address }, payload: { params }, peerMeta } = this.state;

    const gasPrice = await this.provider.getGasPrice();

    const txData = {
      data: params[0].data,
      gas: params[0].gas || '600000',
      gasPrice: params[0].gasPrice || gasPrice,
      from: Rsk3.utils.toChecksumAddress(address),
      to: Rsk3.utils.toChecksumAddress(params[0].to),
      value: params[0].value || '0',
    };

    const dappUrl = peerMeta.url;

    this.setState({
      modalView: (
        <TransactionModal
          dappUrl={dappUrl}
          confirmPress={this.approveRequest}
          cancelPress={this.rejectRequest}
          txData={txData}
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
        const toAddress = Rsk3.utils.toChecksumAddress(params[0].to);
        const inputData = params[0].data;
        apiHelper.getAbiByAddress(toAddress).then((res) => {
          const { abi } = res;
          const input = common.ethereumInputDecoder(abi, inputData);
          this.setState({ inputDecode: input });
          if (input && input.method === 'approve') {
            this.popupAllowanceModal();
          } else {
            const contractMethod = (input && input.method) || 'Smart Contract Call';
            this.popupTransactionModal(contractMethod);
          }
        }).catch((err) => {
          console.log('get abi error: ', err);
          this.popupTransactionModal();
        });

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
      const signWallet = new ethers.Wallet(privateKey, this.provider);
      switch (method) {
        case 'personal_sign': {
          const message = Rsk3.utils.hexToAscii(params[0]);
          result = await this.signMessage(signWallet, message);
          await connector.approveRequest({ id, result });
          this.setState({ modalView: (<SuccessModal title="Sign Approved" description="Success! Your message has been signed and it should show in the dapp" cancelPress={this.closePress} />) });
          break;
        }

        case 'eth_sign': {
          const message = Rsk3.utils.hexToAscii(params[1]);
          result = await this.signMessage(signWallet, message);
          await connector.approveRequest({ id, result });
          this.setState({ modalView: (<SuccessModal title="Sign Approved" description="Success! Your message has been signed and it should show in the dapp" cancelPress={this.closePress} />) });
          break;
        }

        case 'eth_signTypedData': {
          break;
        }

        case 'eth_sendTransaction': {
          await this.setState({ modalView: this.renderTransactionSigningView() });
          result = await this.sendTransaction(signWallet);
          await this.setState({ modalView: null });
          await connector.approveRequest({ id, result });

          setTimeout(() => {
            if (inputDecode && inputDecode.method === 'approve') {
              this.setState({ modalView: (<SuccessModal title="Allowance Approved" cancelPress={this.closePress} />) });
            } else {
              this.setState({ modalView: (<SuccessModal title="Transaction Approved" cancelPress={this.closePress} />) });
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
    const { connector, payload: { id } } = this.state;
    if (connector) {
      connector.rejectRequest({
        id,
        error: { message: 'Failed or Rejected Request' },
      });
    }

    await this.setState({ connector, modalView: null });
    setTimeout(() => {
      this.setState({ modalView: <ErrorModal tryAgain={this.approveRequest} tryLater={this.rejectRequest} /> });
    }, 500);
  }

  approveRequest = async () => {
    console.log('approveRequest');
    const { callAuthVerify } = this.props;

    await this.setState({ modalView: null });

    setTimeout(async () => {
      callAuthVerify(async () => {
        try {
          console.log('handleCallRequest');
          await this.handleCallRequest();
          await this.closeRequest();
        } catch (err) {
          console.log('approve request: ', err);
          this.handleError();
        }
      }, () => {
        this.closeRequest();
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

  closePress = () => {
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

  render() {
    const {
      modalView, contentView,
    } = this.state;

    return (
      <BasePageSimple
        isSafeView={false}
        headerComponent={(
          <WaleltConnectHeader
            title={strings('page.wallet.walletconnect.title')}
            onBackButtonPress={this.onBackButtonPress}
          />
        )}
      >
        <ScrollView style={styles.body} contentContainerStyle={{ flexGrow: 1 }}>
          {contentView}

          <Modal
            animationType="fade"
            transparent
            visible={modalView !== null}
            onRequestClose={this.closePress}
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
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }).isRequired,
  callAuthVerify: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  callAuthVerify: (callback, fallback) => dispatch(
    appActions.callAuthVerify(callback, fallback),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnectPage);

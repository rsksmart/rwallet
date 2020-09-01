import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import WalletConnect from '@walletconnect/client';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ethers } from 'ethers';
import Rsk3 from '@rsksmart/rsk3';

import BasePageSimple from '../base/base.page.simple';
import { strings } from '../../common/i18n';
import OperationHeader from '../../components/headers/header.operation';
import CONSTANTS from '../../common/constants.json';

const { NETWORK: { MAINNET, TESTNET } } = CONSTANTS;

class WalletConnectionPage extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);

    this.state = {
      uri: '',
      connector: null,
      loading: true,
      peerMeta: {
        description: '',
        url: '',
        icons: [],
        name: '',
        ssl: false,
      },
      connected: false,
      chainId: 1,
      requests: [],
      results: [],
      // payload: {
      //   method: 'eth_sendTransaction',
      //   params: [
      //     {
      //       data: '0x',
      //       from: '0x015028643c5d0F318dbb10D6Cb0bfcBc25E8509c',
      //       to: '0x015028643c5d0F318dbb10D6Cb0bfcBc25E8509c',
      //       gas: '0x5208',
      //       gasPrice: '0xdbcac8e00',
      //       nonce: '0x0',
      //       value: '0x0',
      //     },
      //   ],
      // },
      payload: null,
      wallets: [],
      selectedWallet: {},
    };
  }

  componentDidMount() {
    this.initWalletConnect();
    this.initWallets();
    this.initNetwork('Testnet');
  }

  initWalletConnect = async () => {
    const { navigation } = this.props;
    const { uri } = navigation.state.params;

    this.setState({ loading: true });

    try {
      const connector = new WalletConnect({ uri });

      if (!connector.connected) {
        await connector.createSession();
      }

      await this.setState({
        loading: false,
        connector,
        uri: connector.uri,
      });

      this.subscribeToEvents();
    } catch (error) {
      this.setState({ loading: false });

      throw error;
    }
  }

  initWallets = () => {
    const { walletManager: { wallets } } = this.props;
    const ethWallets = [];
    _.forEach(wallets, (wallet) => {
      const { coins } = wallet;
      const ethChainCoins = _.filter(coins, (coin) => coin.id !== 'BTC');
      if (!_.isEmpty(ethChainCoins)) {
        ethWallets.push({
          address: ethChainCoins[0].address,
          privateKey: ethChainCoins[0].privateKey,
        });
      }
    });

    if (!_.isEmpty(ethWallets)) {
      this.setState({ wallets: ethWallets, selectedWallet: ethWallets[0] });
    }
  }

  initNetwork = (network) => {
    this.rskEndpoint = network === 'Mainnet' ? MAINNET.RSK_END_POINT : TESTNET.RSK_END_POINT;
    this.networkVersion = network === 'Mainnet' ? MAINNET.NETWORK_VERSION : TESTNET.NETWORK_VERSION;
    this.rsk3 = new Rsk3(this.rskEndpoint);
    this.provider = new ethers.providers.JsonRpcProvider(this.rskEndpoint);
  }

  subscribeToEvents = () => {
    console.log('ACTION', 'subscribeToEvents');
    const { connector } = this.state;
    console.log('connector: ', connector);

    console.log('is connector: ', !!connector);

    if (connector) {
      connector.on('session_request', (error, payload) => {
        console.log('EVENT', 'session_request');

        if (error) {
          throw error;
        }

        const { peerMeta } = payload.params[0];
        console.log('payload: ', payload);
        this.setState({ peerMeta });
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
        console.log('EVENT', 'call_request', 'method', method);
        console.log('EVENT', 'call_request', 'params', params);

        if (error) {
          throw error;
        }

        this.setState({ payload });
      });

      connector.on('connect', (error, payload) => {
        console.log('EVENT', 'connect');

        if (error) {
          throw error;
        }

        this.setState({ connected: true });
      });

      connector.on('disconnect', (error, payload) => {
        console.log('EVENT', 'disconnect');

        if (error) {
          throw error;
        }
      });

      if (connector.connected) {
        this.setState({
          connected: true,
        });
      }

      this.setState({ connector });
    }
  };

  approveSession = () => {
    console.log('ACTION', 'approveSession');
    const { connector, chainId, selectedWallet } = this.state;
    // const addresses = _.map(wallets, (wallet) => wallet.address);
    if (connector) {
      connector.approveSession({ chainId, accounts: [Rsk3.utils.toChecksumAddress(selectedWallet.address)] });
    }
    this.setState({ connector });
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
    const { navigation } = this.props;
    if (connector) {
      connector.killSession();
      navigation.goBack();
    }
  };

  approveRequest = async () => {
    const { connector, payload, selectedWallet } = this.state;
    const { id, method, params } = payload;
    const { address, privateKey } = selectedWallet;

    console.log('params: ', params);

    const signWallet = new ethers.Wallet(privateKey, this.provider);

    try {
      let result = {};
      switch (method) {
        case 'eth_sendTransaction': {
          // result = {
          //   id,
          //   result: '0x41791102999c339c844880b23950704cc43aa840f3739e365323cda4dfa89e7a',
          // };
          const nonce = await this.provider.getTransactionCount(Rsk3.utils.toChecksumAddress(address), 'pending');
          console.log('nonce: ', nonce);
          const txData = {
            nonce,
            data: params[0].data,
            gasLimit: params[0].gas || 600000,
            gasPrice: params[0].gasPrice || ethers.utils.bigNumberify(('1200000000')),
            to: Rsk3.utils.toChecksumAddress(params[0].to),
            value: (params[0].value && ethers.utils.bigNumberify(params[0].value)) || '0x0',
          };
          console.log('txData: ', txData);
          const signedTransaction = await signWallet.sign(txData);
          const res = await this.provider.sendTransaction(signedTransaction);
          result = { id, result: res.hash };
          break;
        }

        case 'personal_sign': {
          const message = this.rsk3.utils.hexToAscii(params[0]);
          const signature = await signWallet.signMessage(message);
          result = {
            id,
            result: signature,
          };
          break;
        }

        case 'eth_signTypedData': {
          const message = params[1];
          const signature = await signWallet.signMessage(message);
          result = {
            id,
            result: signature,
          };
          break;
        }

        default:
          break;
      }
      connector.approveRequest(result);
    } catch (error) {
      console.error(error);
      if (connector) {
        connector.rejectRequest({
          id,
          error: { message: 'Failed or Rejected Request' },
        });
      }
    }

    this.closeRequest();
    await this.setState({ connector });
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
    await this.setState({ connector });
  };

  closeRequest = async () => {
    await this.setState({
      payload: null,
    });
  };

  renderInfoItem = (title, content) => (
    <View style={{ marginTop: 20, marginVertical: 20 }}>
      <View style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
          {title.toLocaleUpperCase()}
        </Text>
      </View>
      <View style={{
        backgroundColor: 'rgb(237,238,239)', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 5,
      }}
      >
        <Text>
          {content}
        </Text>
      </View>
    </View>
  )

  renderTransactionView = (params) => {
    const data = params[0];
    const keys = Object.keys(data);
    console.log('keys: ', keys);
    return (
      <View>
        {_.map(keys, (key) => this.renderInfoItem(key, data[key]))}
      </View>
    );
  }

  renderPersonalSignView = (params) => {
    const data = {
      method: 'personal_sign',
      message: ethers.utils.toUtf8String(params[0]),
      address: params[1],
    };
    const keys = Object.keys(data);
    return (
      <View>
        {_.map(keys, (key) => this.renderInfoItem(key, data[key]))}
      </View>
    );
  }

  renderSignTypedDataView = (params) => {
    const data = {
      method: 'eth_signTypedData',
      params: params[1],
      address: params[0],
    };
    const keys = Object.keys(data);
    return (
      <View>
        {_.map(keys, (key) => this.renderInfoItem(key, data[key]))}
      </View>
    );
  }

  getTxInfoView = () => {
    const { payload } = this.state;
    const { method, params } = payload;
    let infoView = null;
    switch (method) {
      case 'eth_sendTransaction':
        infoView = this.renderTransactionView(params);
        break;

      case 'personal_sign':
        infoView = this.renderPersonalSignView(params);
        break;

      case 'eth_signTypedData':
        infoView = this.renderSignTypedDataView(params);
        break;

      default:
        return null;
    }

    return (
      <>
        {infoView}
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={this.approveRequest}
            style={{
              padding: 5, borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, borderColor: 'rgb(64,153,255)',
            }}
          >
            <Text style={{ color: 'rgb(64,153,255)' }}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.rejectRequest}
            style={{
              padding: 5, borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, borderColor: 'rgb(64,153,255)',
            }}
          >
            <Text style={{ color: 'red' }}>Reject</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  render() {
    const { navigation } = this.props;
    const {
      peerMeta, connected, payload, connector, loading, wallets, selectedWallet,
    } = this.state;
    console.log('peerMeta: ', peerMeta);
    console.log('payload: ', payload);
    console.log('connector: ', connector);

    return (
      <BasePageSimple
        isSafeView={false}
        headerComponent={<OperationHeader title={strings('page.wallet.scan.title')} onBackButtonPress={() => navigation.goBack()} />}
      >
        <ScrollView style={{ flex: 1 }}>
          {
            connected ? (
              <View style={{ marginTop: 20, alignSelf: 'flex-end', alignItems: 'flex-end' }}>
                <Text style={{ marginRight: 20 }}>{selectedWallet.address}</Text>
                <TouchableOpacity
                  style={{
                    padding: 5, margin: 20, borderRadius: 10, borderWidth: 1, borderColor: 'rgb(64,153,255)',
                  }}
                  onPress={this.killSession}
                >
                  <Text style={{ color: 'rgb(64,153,255)' }}>Disconnect</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }

          {loading ? <ActivityIndicator size="large" style={{ alignSelf: 'center', marginTop: 20 }} /> : null}

          {
            !connected && peerMeta && peerMeta.name ? (
              <View style={{
                alignSelf: 'center', width: '80%', marginVertical: 20, padding: 20, borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, borderColor: 'rgb(64,153,255)',
              }}
              >
                <Text style={{
                  fontSize: 20, marginBottom: 20, alignSelf: 'center', color: 'rgb(64,153,255)',
                }}
                >
                  Dapp request to login.
                </Text>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={this.approveSession}
                    style={{
                      padding: 5, borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, borderColor: 'rgb(64,153,255)',
                    }}
                  >
                    <Text style={{ color: 'rgb(64,153,255)' }}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.rejectSession}
                    style={{
                      padding: 5, borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, borderColor: 'rgb(64,153,255)',
                    }}
                  >
                    <Text style={{ color: 'red' }}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }

          {
            connected && payload && payload.method ? (
              <View style={{
                alignSelf: 'center', width: '80%', marginVertical: 20, padding: 20, borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, borderColor: 'rgb(64,153,255)',
              }}
              >
                {this.getTxInfoView()}
              </View>
            ) : null
          }

        </ScrollView>
      </BasePageSimple>
    );
  }
}

WalletConnectionPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnectionPage);

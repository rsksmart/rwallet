import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import Rsk3 from 'rsk3';
import Entypo from 'react-native-vector-icons/Entypo';
import Parse from 'parse/react-native';
import { connect } from 'react-redux';
import flex from '../../assets/styles/layout.flex';
import color from '../../assets/styles/color.ts';
import RadioGroup from './transfer.radio.group';
import { screen, DEVICE } from '../../common/info';
import Loader from '../../components/common/misc/loader';
import common from '../../common/common';
import appContext from '../../common/appContext';
import Loc from '../../components/common/misc/loc';

import ScreenHelper from '../../common/screenHelper';
import ConfirmSlider from '../../components/wallet/confirm.slider';
import circleCheckIcon from '../../assets/images/misc/circle.check.png';
import circleIcon from '../../assets/images/misc/circle.png';
import { createInfoNotification } from '../../common/notification.controller';
import appActions from '../../redux/app/actions';

const buffer = require('buffer');
const bitcoin = require('bitcoinjs-lib');

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    bottom: 25,
    left: 55,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    bottom: 8,
  },
  chevron: {
    color: '#FFF',
  },
  headImage: {
    position: 'absolute',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    marginTop: 30,
  },
  check: {
    margin: 25,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
  },
  text: {
    color: '#4A4A4A',
    fontSize: 15,
    fontWeight: '300',
    width: '80%',
    marginTop: 15,
    textAlign: 'center',
  },
  link: {
    color: '#00B520',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  title1: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.39,
    marginBottom: 15,
    marginTop: 20,
  },
  title2: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.31,
    marginBottom: 10,
    marginTop: 10,
  },
  title3: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.23,
    marginBottom: 10,
    marginTop: 10,
  },
  textInput: {
    color: '#B5B5B5',
    fontSize: 12,
    fontWeight: '300',
    paddingVertical: 0,
    marginLeft: 5,
    marginVertical: 10,
    flex: 1,
  },
  textInputView: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputIcon: {
    marginRight: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.31,
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    width: '33%',
  },
  radioItemLeft: {

  },
  radioItemText1: {
    color: '#000000',
    fontSize: 16,
    letterSpacing: 0.31,
  },
  radioItemText2: {
    color: '#4A4A4A',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.23,
  },
  radioCheck: {
    fontSize: 20,
  },
  RadioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    marginTop: 5,
    marginRight: 10,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00B520',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});


const header = require('../../assets/images/misc/header.png');
const currencyExchange = require('../../assets/images/icon/currencyExchange.png');
const address = require('../../assets/images/icon/address.png');

class Transfer extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      to: null,
      amount: '0.00000001',
      memo: null,
      feeLevel: 1,
      preference: 'medium',
      isConfirm: false,
    };
    this.initContext();
    this.sendRskTransaction = this.sendRskTransaction.bind(this);
    this.sendBtcTransaction = this.sendBtcTransaction.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    appContext.eventEmitter.on('onFirstPasscode', async () => {
      await this.sendBtcTransaction();
      navigation.navigate('TransferCompleted');
    });
  }

  componentWillUnmount() {
    appContext.eventEmitter.removeAllListeners('onFirstPasscode');
  }

  initContext() {
    const { navigation } = this.props;
    const { coin } = navigation.state.params;
    const btcFees = [
      { coin: '0.0046 BTC' },
      { coin: '0.0048 BTC' },
      { coin: '0.0052 BTC' },
    ];
    const rbtcFees = [
      { coin: '0.0046 RBTC' },
      { coin: '0.0048 RBTC' },
      { coin: '0.0052 RBTC' },
    ];
    const rifFees = [
      { coin: '0.0046 RIF' },
      { coin: '0.0048 RIF' },
      { coin: '0.0052 RIF' },
    ];
    this.netType = 'Testnet';
    switch (coin.id) {
      case 'BTC':
        this.feeData = btcFees;
        this.netType = 'Mainnet';
        break;
      case 'BTCTestnet':
        this.feeData = btcFees;
        break;
      case 'RBTC':
        this.feeData = rbtcFees;
        this.netType = 'Mainnet';
        break;
      case 'RBTCTestnet':
        this.feeData = rbtcFees;
        break;
      case 'RIF':
        this.feeData = rifFees;
        this.netType = 'Mainnet';
        break;
      case 'RIFTestnet':
        this.feeData = rifFees;
        break;
      default:
    }
  }


  // symbol: RBTC, RIF
  async sendRskTransaction(symbol) {
    console.log(`transfer::sendRskTransaction, symbol: ${symbol}`);
    const {
      amount, to,
    } = this.state;
    const { navigation: { state } } = this.props;
    const { params } = state;
    const { coin } = params;
    this.setState({ loading: true });
    const createRawTransaction = async () => {
      console.log('transfer::sendRskTransaction, createRawTransaction');
      const value = common.rbtcToWeiHex(amount);
      const [type, sender, receiver, data, gasPrice, gas] = [
        this.netType, coin.address, to || '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        '', '600000000', 21000,
      ];
      const rawTransactionParams = {
        symbol, type, sender, receiver, value, data, gasPrice, gas,
      };
      console.log(`transfer::sendRskTransaction, createRawTransaction, rawTransactionParams: ${JSON.stringify(rawTransactionParams)}`);
      console.log(`transfer::sendRskTransaction, createRawTransaction, privateKey: ${JSON.stringify(coin.addressPrivateKeyHex)}`);
      const result = await Parse.Cloud.run('createRawTransaction', rawTransactionParams);
      return result;
    };
    const sendSignedTransaction = async (rawTransaction) => {
      console.log('transfer::sendRskTransaction, sendSignedTransaction');
      // const privateKey = '9E41AA4BA98146F04039E7974A83BF65A8494D2F27D5CAB32F18650A514AFBEF';
      const privateKey = coin.addressPrivateKeyHex;
      console.log(`transfer::sendRskTransaction, sendSignedTransaction, privateKey: ${privateKey}`);
      const rsk3 = new Rsk3('https://public-node.testnet.rsk.co');
      const accountInfo = await rsk3.accounts.privateKeyToAccount(privateKey);
      const signedTransaction = await accountInfo.signTransaction(
        rawTransaction, privateKey,
      );
      console.log(`signedTransaction: ${JSON.stringify(signedTransaction)}`);
      const [name, hash, type] = ['Rootstock', signedTransaction.rawTransaction, 'Testnet'];
      console.log(`sendSignedTransaction, name: ${name}, hash: ${hash}, type: ${type}`);
      const result = await Parse.Cloud.run('sendSignedTransaction', {
        name, hash, type,
      });
      return result;
    };
    try {
      const rawTransaction = await createRawTransaction();
      console.log(`sendRskTransaction, rawTransaction: ${JSON.stringify(rawTransaction)}`);
      const result = await sendSignedTransaction(rawTransaction);
      console.log(`sendTransaction, result: ${JSON.stringify(result)}`);
    } catch (error) {
      console.log(`sendTransaction, error: ${error.message}`);
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  async sendBtcTransaction() {
    console.log('transfer::sendBtcTransaction');
    const { navigation: { state }, addNotification } = this.props;
    const { params } = state;
    const { coin } = params;
    // console.table(wallet)
    const {
      amount, preference, to,
    } = this.state;
    this.setState({ loading: true });
    this.a = 1;
    const createRawTransaction = async () => {
      console.log('transfer::sendBtcTransaction, createRawTransaction');
      const value = common.btcToSatoshiHex(amount);
      const [symbol, type, sender, receiver, data] = [
        'BTC', 'Testnet', coin.address, to || 'mxSZzJnUvtAmza4ewht1mLwwrK4xthNRzW', '',
      ];
      console.log('before sendSignedTransaction result');
      const rawTranscationParams = {
        symbol, type, sender, receiver, value, data, preference,
      };
      console.log(`rawTranscationParams: ${JSON.stringify(rawTranscationParams)}`);
      console.log(`addressPrivateKeyHex: ${coin.addressPrivateKeyHex}`);
      const result = await Parse.Cloud.run('createRawTransaction', rawTranscationParams);
      console.log('createRawTransaction result: ', JSON.stringify(result));
      return result;
    };
    const sendSignedTransaction = async (rawTransaction) => {
      const tx = rawTransaction;
      console.log(`raw signedTransaction: ${JSON.stringify(tx)}`);
      console.log('transfer::sendBtcTransaction, sendSignedTransaction');
      console.log(`transfer::sendBtcTransaction, addressPrivateKeyHex: ${coin.addressPrivateKeyHex}`);
      const buf = Buffer.from(coin.addressPrivateKeyHex, 'hex');
      const keys = bitcoin.ECPair.fromPrivateKey(buf);
      tx.pubkeys = [];
      tx.signatures = tx.tosign.map((tosign) => {
        tx.pubkeys.push(keys.publicKey.toString('hex'));
        const signature = keys.sign(new buffer.Buffer(tosign, 'hex'));
        const encodedSignature = bitcoin.script.signature.encode(signature, bitcoin.Transaction.SIGHASH_NONE);
        let hexStr = encodedSignature.toString('hex');
        hexStr = hexStr.substr(0, hexStr.length - 2);
        return hexStr;
      });
      console.log(`signedTransaction: ${JSON.stringify(tx)}`);
      const [name, hash, type] = ['Bitcoin', tx, 'Testnet'];
      console.log(`sendSignedTransaction, name: ${name}, type: ${type}`);
      console.log(`sendSignedTransaction, hash: ${JSON.stringify(hash)}`);
      const result = await Parse.Cloud.run('sendSignedTransaction', {
        name, hash, type, preference, memo: '',
      });
      console.log('sendSignedTransaction result: ', result);
      return result;
    };
    try {
      const rawTransaction = await createRawTransaction();
      const result = await sendSignedTransaction(rawTransaction);
      console.log(`sendTransaction, result: ${JSON.stringify(result)}`);
    } catch (error) {
      this.setState({ loading: false });
      console.log(`sendTransaction, error: ${error.message}`);
      if (error.code === 141) {
        let notification;
        const message = error.message.split('|');
        switch (message[0]) {
          case 'err.notenoughbalance':
            notification = createInfoNotification(
              'Transfer is failed',
              'You need more balance to complete the transfer',
            );
            addNotification(notification);
            break;
          case 'err.timeout':
            notification = createInfoNotification(
              'Transfer is failed',
              'Sorry server timeout',
            );
            addNotification(notification);
            break;
          case 'err.customized':
            notification = createInfoNotification(
              'Transfer is failed',
              message[1],
            );
            addNotification(notification);
            break;
          default:
            notification = createInfoNotification(
              'Transfer is failed',
              'Please contact our customer service',
            );
            addNotification(notification);
            break;
        }
      }
    }
    this.setState({ loading: false });
  }

  async confirm() {
    this.a = 1;
    const { navigation } = this.props;
    const { coin } = navigation.state.params;
    const { amount, to } = this.state;

    if (coin.id === 'BTC' || coin.id === 'BTCTestnet') {
      await this.sendBtcTransaction(amount, to);
      navigation.navigate('TransferCompleted');
    }

    switch (coin.id) {
      case 'BTC':
      case 'BTCTestnet':
        await this.sendBtcTransaction(amount, to);
        break;
      case 'RBTC':
      case 'RBTCTestnet':
        await this.sendRskTransaction('RBTC');
        break;
      case 'RIF':
      case 'RIFTestnet':
        await this.sendRskTransaction('RIF');
        break;
      default:
    }
  }

  render() {
    const {
      loading, to, amount, memo, feeLevel, isConfirm,
    } = this.state;
    const { navigation } = this.props;
    const { coin } = navigation.state.params;


    let headerHeight = 100;
    if (DEVICE.isIphoneX) {
      headerHeight += ScreenHelper.iphoneXExtendedHeight;
    }

    return (
      <ScrollView style={[flex.flex1]}>
        <ImageBackground source={header} style={[{ height: headerHeight }]}>
          <Text style={styles.headerTitle}>
            <Loc text="Send" />
            {` ${coin.defaultName}`}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
          </TouchableOpacity>
        </ImageBackground>
        <View style={styles.body}>
          <Loader loading={loading} />
          <View style={styles.sectionContainer}>
            <Loc style={[styles.title1]} text="Sending" />
            <View style={styles.textInputView}>
              <TextInput
                style={[styles.textInput]}
                value={amount}
                onChangeText={(text) => {
                  this.setState({ amount: text });
                }}
              />
              <Image source={currencyExchange} style={styles.textInputIcon} />
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.title2]} text="To" />
            <View style={styles.textInputView}>
              <TextInput
                style={[styles.textInput]}
                value={to}
                onChangeText={(text) => {
                  this.setState({ to: text });
                }}
              />
              <TouchableOpacity
                style={styles.textInputIcon}
                onPress={() => {
                  navigation.navigate('Scan', {
                    onQrcodeDetected: (data) => {
                      const parseUrl = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
                      const url = data;
                      const result = parseUrl.exec(url);
                      const host = result[3];
                      const [address2, coin2] = host.split('.');
                      this.setState({ to: address2 });
                      console.log(`coin: ${coin2}`);
                    },
                  });
                }}
              >
                <Image source={address} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Loc style={[styles.title3]} text="Memo" />
            <View style={styles.textInputView}>
              <TextInput
                style={[styles.textInput, { textAlignVertical: 'top' }]}
                placeholder="Enter a transaction memo"
                multiline
                numberOfLines={4}
                value={memo}
                onChangeText={(text) => {
                  this.setState({ memo: text });
                }}
              />
            </View>
          </View>
          <View style={[styles.sectionContainer, { marginBottom: 10 }]}>
            <Loc style={[styles.title2]} text="Miner fee" />
            <Loc style={[styles.question]} text="How fast you want this done?" />
            <RadioGroup
              data={this.feeData}
              selected={feeLevel}
              onChange={(i) => {
                let preference = '';
                switch (i) {
                  case 0:
                    preference = 'low';
                    break;
                  case 2:
                    preference = 'high';
                    break;
                  case 1:
                  default:
                    preference = 'medium';
                    break;
                }
                this.setState({ preference });
              }}
            />
          </View>
          <View style={styles.sectionContainer}>
            <ConfirmSlider
              // ref={(ref) => this.confirmSlider = ref}
              width={screen.width - 50}
              buttonSize={30}
              buttonColor="#2962FF"
              borderColor="#2962FF"
              backgroundColor="#fff"
              textColor="#37474F"
              borderRadius={15}
              okButton={{ visible: true, duration: 400 }}
              onVerified={async () => {
                await this.confirm();
                this.setState({ isConfirm: true });
              }}
              icon={(
                <Image
                  source={isConfirm ? circleCheckIcon : circleIcon}
                  style={{ width: 20, height: 20 }}
                />
              )}
            >
              <Text>{isConfirm ? 'CONFIRMED' : 'slide to confirm'}</Text>
            </ConfirmSlider>
          </View>
        </View>
      </ScrollView>
    );
  }
}

Transfer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);

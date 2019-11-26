import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Switch, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import Rsk3 from 'rsk3';
import Entypo from 'react-native-vector-icons/Entypo';
import Parse from 'parse/react-native';


import flex from '../../assets/styles/layout.flex';
import color from '../../assets/styles/color.ts';
import RadioGroup from './transfer.radio.group';
import Button from '../../components/common/button/button';
import Loader from '../../components/common/misc/loader';

const buffer = require('buffer');
const bitcoin = require('bitcoinjs-lib');

const styles = StyleSheet.create({
  headerView: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 48,
    left: 55,
    color: '#FFF',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 37,
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
    marginTop: 10,
    paddingHorizontal: 20,
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

export default class Transfer extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      custom: false,
      loading: false,
      to: null,
    };
    this.sendRskTransaction = this.sendRskTransaction.bind(this);
    this.sendBtcTransaction = this.sendBtcTransaction.bind(this);
  }

  async sendRskTransaction() {
    console.log('transfer::sendRskTransaction');
    this.setState({ loading: true });
    this.a = 1;
    const createRawTransaction = async () => {
      console.log('transfer::sendRskTransaction, createRawTransaction');
      const [symbol, type, sender, receiver, value, data] = ['RBTC', 'Testnet', '0x2cf0028790Eed9374fcE149F0dE3449128738cF4', '0xf08f6c2eac2183dfc0a5910c58c186496f32498d', '0x9184e72a000', ''];
      const result = await Parse.Cloud.run('createRawTransaction', {
        symbol, type, sender, receiver, value, data,
      });
      return result;
    };
    const sendSignedTransaction = async (rawTransaction) => {
      console.log('transfer::sendRskTransaction, sendSignedTransaction');
      const privateKey = 'D2ED1BD155583730762B0BE1072E11A018662DCDF4F7D81BDA778AF2B623C52E';
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
    this.setState({ loading: true });
    this.a = 1;
    const createRawTransaction = async () => {
      console.log('transfer::sendBtcTransaction, createRawTransaction');
      const [symbol, type, sender, receiver, value, data] = [
        'BTC', 'Testnet', 'mt8HhEFmdjbeuoUht8NDf8VHiamCWTG45T', 'mxSZzJnUvtAmza4ewht1mLwwrK4xthNRzW', '0x918', '',
      ];
      const result = await Parse.Cloud.run('createRawTransaction', {
        symbol, type, sender, receiver, value, data,
      });
      return result;
    };
    const sendSignedTransaction = async (rawTransaction) => {
      const tx = rawTransaction;
      console.log('transfer::sendBtcTransaction, sendSignedTransaction');
      // 2b38f230bade0b8e39685ac138107a4e89eff8dbb290744ea1d74644c05a0263
      // 3b5aec0ad01107b6b9818834097645a057c7655d917300f68042cae073b14139
      const privateKey = '2b38f230bade0b8e39685ac138107a4e89eff8dbb290744ea1d74644c05a0263';
      const buf = Buffer.from(privateKey, 'hex');
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
        name, hash, type,
      });
      return result;
    };
    try {
      const rawTransaction = await createRawTransaction();
      const result = await sendSignedTransaction(rawTransaction);
      console.log(`sendTransaction, result: ${JSON.stringify(result)}`);
    } catch (error) {
      console.log(`sendTransaction, error: ${error.message}`);
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  render() {
    const { custom, loading, to } = this.state;
    const { navigation } = this.props;
    return (
      <ScrollView style={[flex.flex1]}>
        <View style={[{ height: 100 }]}>
          <Image source={header} style={styles.headImage} />
          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>Send BTC</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          <Loader loading={loading} />
          <View style={styles.sectionContainer}>
            <Text style={styles.title1}>Sending</Text>
            <View style={styles.textInputView}>
              <TextInput style={[styles.textInput]} value="0.15 BTC (1500 USD)" />
              <Image source={currencyExchange} style={styles.textInputIcon} />
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.title2}>To</Text>
            <View style={styles.textInputView}>
              <TextInput style={[styles.textInput]} value={to} />
              <TouchableOpacity
                style={styles.textInputIcon}
                onPress={() => {
                  navigation.navigate('Scan', {
                    onQrcodeDetected: (data) => {
                      this.setState({ to: data });
                    },
                  });
                }}
              >
                <Image source={address} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.title3}>Memo</Text>
            <View style={styles.textInputView}>
              <TextInput style={[styles.textInput, { textAlignVertical: 'top' }]} placeholder="Enter a transaction memo" multiline numberOfLines={4} />
            </View>
          </View>
          <View style={[styles.sectionContainer]}>
            <Text style={styles.title2}>Miner fee</Text>
            <Text style={styles.question}>How fast you want this done?</Text>
            <RadioGroup />
          </View>
          <View style={[styles.sectionContainer, styles.customRow, { paddingBottom: 20 }]}>
            <Text style={[styles.title2, { flex: 1 }]}>Custom</Text>
            <Switch
              value={custom}
              onValueChange={(v) => {
                this.setState({ custom: v });
              }}
            />
          </View>
          <View style={styles.sectionContainer}>
            <Button
              text="COMFIRM"
              onPress={async () => {
                // navigation.navigate('VerifyFingerprint', {
                //   verified: async () => {
                //     await this.sendBtcTransaction();
                //     navigation.navigate('TransferCompleted');
                //   },
                // });
                await this.sendBtcTransaction();
                navigation.navigate('TransferCompleted');
              }}
            />
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
};

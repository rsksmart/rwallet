import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import Parse from 'parse/react-native';
import { connect } from 'react-redux';
import Rsk3 from 'rsk3';
import flex from '../../assets/styles/layout.flex';
import Button from '../../components/common/button/button';
import Input from '../../components/common/input/input';
import SearchInput from '../../components/common/input/searchInput';
import IconTwoTextList from '../../components/common/list/iconTwoTextList';
import SwitchListItem from '../../components/common/list/switchListItem';
import Tags from '../../components/common/misc/tags';
import WordField from '../../components/common/misc/wordField';
import TouchSensorModal from '../../components/common/modal/touchSensorModal';
import PasscodeModal from '../../components/common/modal/passcodeModal';
import Alert from '../../components/common/modal/alert';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Picker from '../../components/common/input/picker';
import wallet from '../../common/wallet/wallet';
import storage from '../../common/storage';
import appActions from '../../redux/app/actions';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 12,
    minWidth: 130,
    marginTop: 12,
    marginLeft: 10,
  },
  text: {
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

const listData = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Address Book',
    onPress: () => {},
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Share rWallet',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Notifications',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d721',
    title: 'Language',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d722',
    title: 'Currency',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d723',
    title: 'Two-Factor Authentication',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d724',
    title: 'Lock',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d725',
    title: 'Help & Support',
    onPress: () => {},
  },
];

const tagDatas = [
  'uncle',
  'cave',
  'donkey',
  'solar',
  'sweet',
  'canyon',
  'bonus',
  'busy',
  'nose',
  'tool',
  'position',
  'joy',
];

const swipableData = [
  {
    key: '1',
    title: 'BTC',
    text: 'BTC Wallet',
    worth: '$23812.48',
    amount: 570,
  },
  {
    key: '2',
    title: 'RIF',
    text: 'RIF Wallet',
    worth: '$454.23',
    amount: 22,
  },
];

class Test1 extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {};

    this.onServerInfoPressed = this.onServerInfoPressed.bind(this);
  }

  onServerInfoPressed() {
    const { getServerInfo } = this.props;
    console.log('this.props,', this.props);

    console.log('button pressed. getServerInfo:', getServerInfo);
    getServerInfo();
  }

  onGetTransactionsPress() {
    const { getTransactions } = this.props;
    console.log('this.props,', this.props);

    console.log('button pressed. getServerInfo:', getTransactions);
    const [symbol, type, address] = ['RBTC', 'Testnet', '0x626042b6e0435e23706376D61bE5e8Fc21d5c7DB'];
    getTransactions(symbol, type, address);
  }

  async save(k, v, id) {
    this.a = 1;
    await storage.save(k, v, id);
  }

  render() {
    const { navigation, serverVersion, transactions } = this.props;
    return (
      <View style={[flex.flex1]}>
        <ScrollView style={{ marginBottom: 5 }}>
          <View style={styles.sectionContainer}>
            <Text>This is the test page 1</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const random = Math.random();
                await this.save('TEST2NUM', random);
                navigation.navigate('Test2');
              }}
            >
              <Text style={styles.text}>Go to Test 2 Tab</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Pages</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  const symbol = 'RBTC';
                  const type = 'Testnet';
                  const sender = '0x2cf0028790Eed9374fcE149F0dE3449128738cF4';
                  const receiver = '0xf08f6c2eac2183dfc0a5910c58c186496f32498d';
                  const value = '0x9184e72a000';
                  const data = '';
                  Parse.Cloud.run('createRawTransaction', {
                    symbol, type, sender, receiver, value, data,
                  }).then(async (result) => {
                    console.log(`createRawTransaction, result: ${JSON.stringify(result)}`);
                    const privateKey = 'D2ED1BD155583730762B0BE1072E11A018662DCDF4F7D81BDA778AF2B623C52E';
                    const rsk3 = new Rsk3('https://public-node.testnet.rsk.co');
                    const rawTransaction = result;
                    // {
                    //   from: sender,
                    //   to: receiver,
                    //   value: Rsk3.utils.toHex(Number(result.value)),
                    //   nonce: Rsk3.utils.toHex(result.nonce),
                    //   gasPrice: result.gasPrice,
                    //   data: '',
                    // };
                    // rawTransaction.chainId = result.chainId;
                    // rawTransaction.gas = result.gas;
                    // 3. Sign the rawTransaction with a specific private key
                    const accountInfo = await rsk3.accounts.privateKeyToAccount(privateKey);
                    const signedTransaction = await accountInfo.signTransaction(
                      rawTransaction, privateKey,
                    );
                    console.log(`signedTransaction: ${JSON.stringify(signedTransaction)}`);
                    const name = 'Rootstock';
                    const hash = signedTransaction.rawTransaction;
                    console.log(`sendSignedTransaction, name: ${name}, hash: ${hash}, type: ${type}`);
                    Parse.Cloud.run('sendSignedTransaction', {
                      name, hash, type,
                    }).then((result1) => {
                      console.log(`sendSignedTransaction, result: ${JSON.stringify(result1)}`);
                    }).catch((reason) => {
                      console.log(reason);
                    });
                  }).catch((reason) => {
                    console.log(reason);
                  });
                }}
              >
                <Text style={styles.text}>createRawTransaction</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  Parse.Cloud.run('getServerInfo', {}).then((result) => {
                    console.log(result);
                  }).catch((reason) => {
                    console.log(reason);
                  });
                }}
              >
                <Text style={styles.text}>getServerInfo</Text>
              </TouchableOpacity>
              <Text>{`transactions: ${transactions.length}`}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  this.onGetTransactionsPress();
                }}
              >
                <Text style={styles.text}>saga getTransactionsByAddress</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  const symbol = 'RBTC';
                  const type = 'Testnet';
                  const address = '0x626042b6e0435e23706376D61bE5e8Fc21d5c7DB';
                  Parse.Cloud.run('getTransactionsByAddress', { symbol, type, address }).then((result) => {
                    console.log(result);
                  }).catch((reason) => {
                    console.log(reason);
                  });
                }}
              >
                <Text style={styles.text}>getTransactionsByAddress</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={async () => {}}>
                <Text style={styles.text}>RSK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  navigation.navigate('ReduxTest');
                }}
              >
                <Text style={styles.text}>Redux Test</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('AddressBook');
                }}
              >
                <Text style={styles.text}>AddressBook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('Transfer');
                }}
              >
                <Text style={styles.text}>Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('Address');
                }}
              >
                <Text style={styles.text}>Address</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  // if(walletManager.wallets.length===0){
                  //   navigation.navigate('WalletAddIndex',{wallet});
                  // } else {
                  //   navigation.navigate('WalletList');
                  // }
                  navigation.navigate('WalletList');
                }}
              >
                <Text style={styles.text}>Wallet List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('StartPage');
                }}
              >
                <Text style={styles.text}>Normal Flow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('VerifyPhraseSuccess');
                }}
              >
                <Text style={styles.text}>VerifyPhraseSuccess</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  try {
                    const params = {
                      addr: '0x626042b6e0435e23706376d61be5e8fc21d5c7db',
                      type: 'Testnet',
                      symbol: 'RBTC',
                    };
                    const t = await Parse.Cloud.run('getTransactionsByAddress', params);
                    console.log(t);
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <Text style={styles.text}>Get Transactions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  navigation.navigate('WalletReceive');
                }}
              >
                <Text style={styles.text}>Wallet Receive</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  try {
                    const params = { name: 'TBTC', addr: 'mt8HhEFmdjbeuoUht8NDf8VHiamCWTG45T' };
                    const t = await Parse.Cloud.run('getBalance', params);
                    console.log(t);
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <Text style={styles.text}>Test Parse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('WalletTest');
                }}
              >
                <Text style={styles.text}>Test Wallet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('WalletTest2');
                }}
              >
                <Text style={styles.text}>Test Wallet 2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('WalletAddIndex');
                }}
              >
                <Text style={styles.text}>Add Wallet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('WalletSelectCurrency');
                }}
              >
                <Text style={styles.text}>SelectCurrency</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('WalletCreate');
                }}
              >
                <Text style={styles.text}>Create Wallet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('RecoveryPhrase');
                }}
              >
                <Text style={styles.text}>Recovery Phrase</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Swipable ListItem</Text>
            <SwipableButtonList data={swipableData} />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Test List</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('Test2');
                }}
              >
                <Text style={styles.text}>scan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('Test3');
                }}
              >
                <Text style={styles.text}>List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  wallet.newWallet();
                }}
              >
                <Text style={styles.text}>New Wallet</Text>
              </TouchableOpacity>
              <TouchSensorModal
                ref={(ref) => {
                  this.touchSensor = ref;
                }}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.touchSensor.setModalVisible(true);
                }}
              >
                <Text style={styles.text}>Touch Sensor</Text>
              </TouchableOpacity>
              <PasscodeModal
                ref={(ref) => {
                  this.passcodeModal = ref;
                }}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.passcodeModal.setModalVisible(true);
                }}
              >
                <Text style={styles.text}>Passcode Modal</Text>
              </TouchableOpacity>
              <Alert
                ref={(ref) => {
                  this.alert = ref;
                }}
                title="Safeguard your recovery phrase"
                text="Your recovery phrase is composed of 12 randomly selected words. Please carefully write down each word in the order they appear."
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.alert.setModalVisible(true);
                }}
              >
                <Text style={styles.text}>Alert</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Button</Text>
            <Button text="GET STARTED" onPress={() => {}} />
          </View>
          <View style={styles.sectionContainer}>
            <Button
              text={`Server Version: ${serverVersion}`}
              onPress={this.onServerInfoPressed}
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Input</Text>
            <Input placeholder="Type address here..." />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>SearchInput</Text>
            <SearchInput placeholder="Start Searching For Assets" />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>SwitchListItem</Text>
            <SwitchListItem title="Use Fingerprint" value />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>IconTwoTextList</Text>
            <IconTwoTextList data={listData} />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <Tags data={tagDatas} />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>WordField</Text>
            <WordField text="canyon" />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Picker</Text>
            <Picker />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  serverVersion: state.App.get('serverVersion'),
  transactions: state.App.get('transactions'),
});

const mapDispatchToProps = (dispatch) => ({
  getServerInfo: () => dispatch(appActions.getServerInfo()),
  getTransactions: (symbol, type, address) => dispatch(
    appActions.getTransactions(symbol, type, address),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test1);

Test1.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  serverVersion: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  transactions: PropTypes.array,
  getServerInfo: PropTypes.func,
  getTransactions: PropTypes.func,
};

Test1.defaultProps = {
  serverVersion: undefined,
  getServerInfo: undefined,
  getTransactions: undefined,
  transactions: [],
};

import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import flex from '../../assets/styles/layout.flex';
import color from '../../assets/styles/color.ts';
import RadioGroup from './transfer.radio.group';
import { screen, DEVICE } from '../../common/info';
import Loader from '../../components/common/misc/loader';
import appContext from '../../common/appContext';
import Loc from '../../components/common/misc/loc';

import ScreenHelper from '../../common/screenHelper';
import ConfirmSlider from '../../components/wallet/confirm.slider';
import circleCheckIcon from '../../assets/images/misc/circle.check.png';
import circleIcon from '../../assets/images/misc/circle.png';
import { createInfoNotification } from '../../common/notification.controller';
import appActions from '../../redux/app/actions';
import Transaction from '../../common/transaction';

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
    color: '#000000',
    fontSize: 12,
    fontWeight: '500',
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
// const currencyExchange = require('../../assets/images/icon/currencyExchange.png');
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
      amount: '',
      memo: null,
      feeLevel: 1,
      preference: null,
      isConfirm: false,
      enableConfirm: false,
    };

    this.confirm = this.confirm.bind(this);
    this.validateConfirmControl = this.validateConfirmControl.bind(this);
    this.onGroupSelect = this.onGroupSelect.bind(this);
  }

  componentDidMount() {
    this.initContext();
    const { navigation } = this.props;
    appContext.eventEmitter.on('onFirstPasscode', async () => {
      await this.sendBtcTransaction();
      navigation.navigate('TransferCompleted');
    });
  }

  componentWillUnmount() {
    appContext.eventEmitter.removeAllListeners('onFirstPasscode');
  }

  onGroupSelect(i) {
    let preference = '';
    switch (i) {
      case 0:
        preference = this.symbol === 'BTC' ? 'low' : { gasPrice: '600000000', gas: 21000 };
        break;
      case 2:
        preference = this.symbol === 'BTC' ? 'high' : { gasPrice: '600000000', gas: 21000 };
        break;
      case 1:
      default:
        preference = this.symbol === 'BTC' ? 'medium' : { gasPrice: '600000000', gas: 21000 };
        break;
    }
    this.setState({ preference });
  }

  initContext() {
    const { navigation } = this.props;
    const { coin } = navigation.state.params;
    const btcFees = [
      { coin: 0.0046, value: '$ 0.46' },
      { coin: 0.0048, value: '$ 0.68' },
      { coin: 0.0052, value: '$ 0.84' },
    ];
    const rbtcFees = [
      { coin: 0.0046, value: '$ 0.46' },
      { coin: 0.0048, value: '$ 0.68' },
      { coin: 0.0052, value: '$ 0.84' },
    ];
    const rifFees = [
      { coin: 0.0046, value: '$ 0.46' },
      { coin: 0.0048, value: '$ 0.68' },
      { coin: 0.0052, value: '$ 0.84' },
    ];
    const feeDatas = { BTC: btcFees, RBTC: rbtcFees, RIF: rifFees };
    this.symbol = coin.symbol;
    const feeData = feeDatas[coin.symbol];
    feeData.forEach((fee) => {
      const item = fee;
      item.coin = `${item.coin}${coin.symbol}`;
      // TODO: calculate coin value
    });
    this.setState({
      preference: this.symbol === 'BTC' ? 'medium' : { gasPrice: '600000000', gas: 21000 },
      feeData,
    });
  }

  async confirm() {
    const { navigation, navigation: { state }, addNotification } = this.props;
    const { params } = state;
    const { coin } = params;
    const {
      amount, to, preference,
    } = this.state;
    try {
      this.setState({ loading: true });
      let transaction = new Transaction(coin, to, amount, '', preference);
      await transaction.processRawTransaction();
      await transaction.signTransaction();
      await transaction.processSignedTransaction();
      transaction = null;
      this.setState({ loading: false });
      navigation.navigate('TransferCompleted');
    } catch (error) {
      this.setState({ loading: false });
      console.log(`confirm, error: ${error.message}`);
      let notification = null;
      if (error.code === 141) {
        const message = error.message.split('|');
        switch (message[0]) {
          case 'err.notenoughbalance':
            notification = createInfoNotification(
              'Transfer is failed',
              'You need more balance to complete the transfer',
            );
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
            break;
          default:
            notification = createInfoNotification(
              'Transfer is failed',
              'Please contact our customer service',
            );
            break;
        }
      }
      if (!notification) {
        notification = createInfoNotification(
          'Transfer error',
          'Please contact our customer service',
        );
      }
      addNotification(notification);
      this.setState({ isConfirm: false });
      this.confirmSlider.reset();
    }
  }

  validateConfirmControl() {
    const { to, amount } = this.state;
    this.setState({ enableConfirm: to && amount });
  }

  render() {
    const {
      loading, to, amount, memo, feeLevel, isConfirm, enableConfirm, feeData,
    } = this.state;
    const { navigation } = this.props;
    const { coin } = navigation.state.params;

    let headerHeight = 100;
    if (DEVICE.isIphoneX) {
      headerHeight += ScreenHelper.iphoneXExtendedHeight;
    }

    return (
      <View style={[flex.flex1]}>
        <ScrollView>
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
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title1]} text="Sending" />
              <View style={styles.textInputView}>
                <TextInput
                  style={[styles.textInput]}
                  placeholder="0.01"
                  value={amount}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const self = this;
                    self.setState({ amount: text });
                    if (parseFloat(text) >= 0) {
                      self.setState({ amount: text }, self.validateConfirmControl.bind(self));
                    }
                  }}
                />
                {/* <Image source={currencyExchange} style={styles.textInputIcon} /> */}
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title2]} text="To" />
              <View style={styles.textInputView}>
                <TextInput
                  style={[styles.textInput]}
                  value={to}
                  onChangeText={(text) => {
                    this.setState({ to: text }, this.validateConfirmControl.bind(this));
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
                  onChange={(text) => {
                    this.setState({ memo: text });
                  }}
                />
              </View>
            </View>
            <View style={[styles.sectionContainer, { marginBottom: 10 }]}>
              <Loc style={[styles.title2]} text="Miner fee" />
              <Loc style={[styles.question]} text="How fast you want this done?" />
              <RadioGroup
                data={feeData}
                selectIndex={feeLevel}
                onChange={(i) => this.onGroupSelect(i)}
              />
            </View>
          </View>
          <Loader loading={loading} />
        </ScrollView>
        <View
          style={[styles.sectionContainer, {
            opacity: enableConfirm ? 1 : 0.5, position: 'absolute', bottom: 0, width: '100%', paddingTop: 20, paddingBottom: 35,
          }]}
          pointerEvents={enableConfirm ? 'auto' : 'none'}
        >
          <ConfirmSlider // All parameter should be adjusted for the real case
            ref={(ref) => { this.confirmSlider = ref; }}
            width={screen.width - 50}
            buttonSize={30}
            buttonColor="transparent" // color for testing purpose, make sure use proper color afterwards
            borderColor="transparent" // color for testing purpose, make sure use proper color afterwards
            backgroundColor="#f3f3f3" // color for testing purpose, make sure use proper color afterwards
            textColor="#37474F" // color for testing purpose, make sure use proper color afterwards
            borderRadius={15}
            okButton={{ visible: true, duration: 400 }}
            onVerified={async () => {
              this.setState({ isConfirm: true });
              await this.confirm();
            }}
            icon={(
              <Image
                source={isConfirm ? circleCheckIcon : circleIcon}
                style={{ width: 32, height: 32 }}
              />
              )}
          >
            <Text style={[{ fontWeight: 'bold', color: 'black', fontSize: 15 }]}>{isConfirm ? 'CONFIRMED' : 'Slide to confirm'}</Text>
          </ConfirmSlider>
        </View>
      </View>
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

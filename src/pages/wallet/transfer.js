import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ImageBackground, ScrollView, Switch, Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import BigNumber from 'bignumber.js';
import { connect } from 'react-redux';
import color from '../../assets/styles/color.ts';
import RadioGroup from './transfer.radio.group';
import { screen, DEVICE } from '../../common/info';
import Loader from '../../components/common/misc/loader';
import Loc from '../../components/common/misc/loc';

import ScreenHelper from '../../common/screenHelper';
import ConfirmSlider from '../../components/wallet/confirm.slider';
import circleCheckIcon from '../../assets/images/misc/circle.check.png';
import circleIcon from '../../assets/images/misc/circle.png';
import { createErrorNotification } from '../../common/notification.controller';
import appActions from '../../redux/app/actions';
import Transaction from '../../common/transaction';
import common from '../../common/common';
import { strings } from '../../common/i18n';
import SafeAreaView from '../../components/common/misc/safe.area.view';

const MEMO_NUM_OF_LINES = 8;
const MEMO_LINE_HEIGHT = 15;

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
    marginTop: 15,
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
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.31,
    marginBottom: 10,
    marginTop: 10,
  },
  title3: {
    color: '#000000',
    fontSize: 15,
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
  customFeeSlider: {
    width: '100%',
    height: 40,
  },
  customFeeSliderWrapper: {
    height: 60,
  },
  customFeeText: {
    alignSelf: 'flex-end',
    fontSize: 13,
  },
  wapper: {
    height: screen.height - 25,
  },
});


const FEE_LEVEL_ADJUSTMENT = 0.25;
const DEFAULT_RBTC_MIN_GAS = 21000;
const DEFAULT_RIF_MIN_GAS = 23064;
const DEFAULT_RBTC_MEDIUM_GAS = DEFAULT_RBTC_MIN_GAS / (1 - FEE_LEVEL_ADJUSTMENT);
const DEFAULT_RIF_MEDIUM_GAS = DEFAULT_RIF_MIN_GAS / (1 - FEE_LEVEL_ADJUSTMENT);
const DEFAULT_BTC_MIN_FEE = 60000;
const DEFAULT_BTC_MEDIUM_FEE = DEFAULT_BTC_MIN_FEE / (1 - FEE_LEVEL_ADJUSTMENT);
const DEFAULT_RBTC_GAS_PRICE = 600000000;
const MAX_FEE_TIMES = 2;

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
      preference: 'medium',
      isConfirm: false,
      enableConfirm: false,
      isCustomFee: false,
      customFee: null,
      customFeeValue: new BigNumber(0),
      feeSymbol: null,
      feeSliderValue: 0,
    };

    this.confirm = this.confirm.bind(this);
    this.validateConfirmControl = this.validateConfirmControl.bind(this);
    this.onGroupSelect = this.onGroupSelect.bind(this);
    this.inputAmount = this.inputAmount.bind(this);
    this.onQrcodeScanPress = this.onQrcodeScanPress.bind(this);
    this.onConfirmSliderVerified = this.onConfirmSliderVerified.bind(this);
    this.onCustomFeeSlideValueChange = this.onCustomFeeSlideValueChange.bind(this);
    this.onCustomFeeSlidingComplete = this.onCustomFeeSlidingComplete.bind(this);
  }

  componentDidMount() {
    this.initContext();
  }

  componentWillReceiveProps(nextProps) {
    const { prices, currency } = nextProps;
    const { prices: curPrices } = this.props;

    if (prices && prices !== curPrices) {
      const { customFee, feeSymbol } = this.state;
      const customFeeValue = common.getCoinValue(customFee, feeSymbol, currency, prices);
      this.setState({ customFeeValue });
    }
  }

  onGroupSelect(index) {
    const preferences = ['low', 'medium', 'high'];
    const preference = preferences[index];
    this.setState({ preference });
  }

  onQrcodeScanPress() {
    const { navigation } = this.props;
    navigation.navigate('Scan', {
      onQrcodeDetected: (data) => {
        const parseUrl = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        const url = data;
        const result = parseUrl.exec(url);
        const host = result[3];
        const [address2] = host.split('.');
        this.setState({ to: address2 });
      },
    });
  }

  async onConfirmSliderVerified() {
    this.setState({ isConfirm: true });
    await this.confirm();
  }

  onCustomFeeSwitchValueChange(value) {
    const { customFee } = this.state;
    this.setState({ isCustomFee: value });
    if (customFee) {
      return;
    }
    if (value) {
      const feeSliderValue = 0.5;
      this.setState({ feeSliderValue });
      this.onCustomFeeSlideValueChange(feeSliderValue);
    }
  }

  /**
   * onCustomFeeSlideValueChange
   * @param {number} value slider value, 0-1
   */
  onCustomFeeSlideValueChange(value) {
    // console.log('onCustomFeeSlideValueChange, value: ', value);
    const { currency, prices, navigation } = this.props;
    const { coin } = navigation.state.params;
    const { feeSymbol } = this.state;
    // maxFee = 2 times high fee
    const maxFee = this.mediumFee.times(MAX_FEE_TIMES).times(1 + FEE_LEVEL_ADJUSTMENT);
    // If feeSymbol is RBTC, fee must multiply DEFAULT_RBTC_GAS_PRICE
    let minFee = null;
    if (coin.symbol === 'RBTC') {
      minFee = common.convertUnitToCoinAmount(feeSymbol, DEFAULT_RBTC_MIN_GAS).times(DEFAULT_RBTC_GAS_PRICE);
    } else if (coin.symbol === 'RIF') {
      minFee = common.convertUnitToCoinAmount(feeSymbol, DEFAULT_RIF_MIN_GAS).times(DEFAULT_RBTC_GAS_PRICE);
    } else {
      minFee = common.convertUnitToCoinAmount(feeSymbol, DEFAULT_BTC_MIN_FEE);
    }
    // minFee + (maxFee-minFee) * value
    const customFee = minFee.plus(maxFee.minus(minFee).times(value));
    const customFeeValue = common.getCoinValue(customFee, feeSymbol, currency, prices);
    this.setState({ customFee, customFeeValue });
  }

  onCustomFeeSlidingComplete(value) {
    this.setState({ feeSliderValue: value });
  }

  getFeeParams() {
    const {
      feeSymbol, isCustomFee, customFee, preference,
    } = this.state;
    const { navigation } = this.props;
    const { coin } = navigation.state.params;
    let feeParams = null;
    if (isCustomFee) {
      if (feeSymbol === 'RBTC') {
        const fee = customFee.div(DEFAULT_RBTC_GAS_PRICE);
        const wei = common.rbtcToWei(fee);
        feeParams = {
          gasPrice: DEFAULT_RBTC_GAS_PRICE.toString(),
          gas: wei.decimalPlaces(0).toNumber(),
        };
      } else {
        // If BTC is costom fee, set fees field = customFee hex
        feeParams = {
          fees: common.btcToSatoshiHex(customFee),
        };
      }
    } else if (feeSymbol === 'RBTC') {
      const feeLevels = {
        low: 1 - FEE_LEVEL_ADJUSTMENT,
        medium: 1,
        high: 1 + FEE_LEVEL_ADJUSTMENT,
      };
      const mediumGas = coin.symbol === 'RIF' ? DEFAULT_RIF_MEDIUM_GAS : DEFAULT_RBTC_MEDIUM_GAS;
      feeParams = {
        gasPrice: DEFAULT_RBTC_GAS_PRICE.toString(),
        gas: mediumGas * feeLevels[preference],
      };
    } else if (feeSymbol === 'BTC') {
      // If BTC is not costom fee, set preference field = high/medium/low
      feeParams = { preference };
    }
    return feeParams;
  }

  initContext() {
    const { navigation, prices, currency } = this.props;
    const { coin } = navigation.state.params;

    console.log('prices: ', prices);
    console.log('currency: ', currency);

    const feeLevels = [
      1 - FEE_LEVEL_ADJUSTMENT,
      1,
      1 + FEE_LEVEL_ADJUSTMENT,
    ];
    const feeBase = { BTC: DEFAULT_BTC_MEDIUM_FEE, RBTC: DEFAULT_RBTC_MEDIUM_GAS, RIF: DEFAULT_RIF_MEDIUM_GAS };
    let feeSymbol = coin.symbol;
    if (feeSymbol === 'RIF') {
      feeSymbol = 'RBTC';
    }
    const feeData = [];
    for (let i = 0; i < 3; i += 1) {
      const item = {};
      const fee = feeLevels[i] * feeBase[coin.symbol];

      let coinAmount = common.convertUnitToCoinAmount(feeSymbol, fee);
      if (feeSymbol === 'RBTC') {
        coinAmount = coinAmount.times(DEFAULT_RBTC_GAS_PRICE);
      }
      const coinValue = common.getCoinValue(coinAmount, feeSymbol, currency, prices);
      item.value = coinValue;
      item.coin = coinAmount;
      feeData.push(item);
    }
    this.mediumFee = feeData[1].coin;
    this.setState({ feeData, feeSymbol });
  }

  async confirm() {
    const { navigation, navigation: { state }, addNotification } = this.props;
    const { params } = state;
    const { coin } = params;
    const { amount, to } = this.state;
    try {
      this.setState({ loading: true });
      const feeParams = this.getFeeParams();
      let transaction = new Transaction(coin, to, amount, '', feeParams);
      await transaction.processRawTransaction();
      await transaction.signTransaction();
      await transaction.processSignedTransaction();
      this.setState({ loading: false });
      const completedParams = {
        symbol: coin.symbol,
        type: coin.type,
        hash: transaction.txHash,
      };
      navigation.navigate('TransferCompleted', completedParams);
      transaction = null;
    } catch (error) {
      this.setState({ loading: false });
      console.log(`confirm, error: ${error.message}`);
      const buttonText = 'RETRY';
      let notification = null;
      if (error.code === 141) {
        const message = error.message.split('|');
        switch (message[0]) {
          case 'err.notenoughbalance':
            notification = createErrorNotification(
              'Transfer is failed',
              'You need more balance to complete the transfer',
              buttonText,
            );
            break;
          case 'err.timeout':
            notification = createErrorNotification(
              'Transfer is failed',
              'Sorry server timeout',
              buttonText,
            );
            addNotification(notification);
            break;
          case 'err.customized':
            notification = createErrorNotification(
              'Transfer is failed',
              message[1],
              buttonText,
            );
            break;
          default:
            break;
        }
      }
      // Default error notification
      if (!notification) {
        notification = createErrorNotification(
          'Transfer is failed',
          'Please contact customer service',
          buttonText,
        );
      }
      addNotification(notification);
      // Reset confirmSlider
      this.setState({ isConfirm: false });
      this.confirmSlider.reset();
    }
  }

  validateConfirmControl() {
    const { to, amount } = this.state;
    this.setState({ enableConfirm: to && amount });
  }

  inputAmount(text) {
    this.setState({ amount: text });
    if (parseFloat(text) >= 0) {
      this.setState({ amount: text }, this.validateConfirmControl.bind(this));
    }
  }

  renderCustomFee(isCustomFee) {
    const {
      customFee, feeSymbol, customFeeValue, feeSliderValue,
    } = this.state;
    const { currency } = this.props;
    const currencySymbol = common.getCurrencySymbol(currency);
    return (
      <View style={[styles.customFeeSliderWrapper]}>
        { isCustomFee && (
          <View>
            <Slider
              value={feeSliderValue}
              style={styles.customFeeSlider}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#00B520"
              maximumTrackTintColor="#D8D8D8"
              thumbTintColor="#00B520"
              onValueChange={(value) => this.onCustomFeeSlideValueChange(value)}
              onSlidingComplete={(value) => this.onCustomFeeSlidingComplete(value)}
            />
            <Text style={styles.customFeeText}>
              {`${common.getBalanceString(feeSymbol, customFee)} ${feeSymbol} = ${currencySymbol}${common.getAssetValueString(customFeeValue)}`}
            </Text>
          </View>
        )}
      </View>

    );
  }

  renderFeeOptions() {
    const {
      feeSymbol, feeData, feeLevel, currency,
    } = this.state;
    const currencySymbol = common.getCurrencySymbol(currency);
    const items = [];
    if (!feeData) {
      return null;
    }
    for (let i = 0; i < feeData.length; i += 1) {
      const item = {};
      const fee = feeData[i];
      const coinAmount = common.getBalanceString(feeSymbol, fee.coin);
      item.coin = `${coinAmount} ${feeSymbol}`;
      const coinValue = common.getAssetValueString(fee.value);
      item.value = `${currencySymbol}${coinValue}`;
      items.push(item);
    }
    return (
      <RadioGroup
        data={items}
        selectIndex={feeLevel}
        onChange={(i) => this.onGroupSelect(i)}
      />
    );
  }

  renderMemo(memo) {
    const paddingBottom = 4;
    return (
      <TextInput
        style={[styles.textInput, { textAlignVertical: 'top', paddingBottom }]}
        placeholder={strings('Enter a transaction memo')}
        multiline
        numberOfLines={Platform.OS === 'ios' ? null : MEMO_NUM_OF_LINES}
        minHeight={(Platform.OS === 'ios' && MEMO_NUM_OF_LINES) ? (MEMO_LINE_HEIGHT * MEMO_NUM_OF_LINES + paddingBottom) : null}
        value={memo}
        onChange={(event) => this.setState({ memo: event.nativeEvent.text })}
      />
    );
  }

  render() {
    const {
      loading, to, amount, memo, isConfirm, isCustomFee, enableConfirm,
    } = this.state;
    const { navigation, showPasscode } = this.props;
    const { coin } = navigation.state.params;
    let headerHeight = 100;
    if (DEVICE.isIphoneX) {
      headerHeight += ScreenHelper.iphoneXTopHeight;
    }

    return (
      <SafeAreaView>
        <ScrollView style={{ paddingBottom: 0, marginBottom: 0 }}>
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
                  onChangeText={this.inputAmount}
                />
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
                  onPress={this.onQrcodeScanPress}
                >
                  <Image source={address} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title3]} text="Memo" />
              <View style={styles.textInputView}>
                {this.renderMemo(memo)}
              </View>
            </View>
            <View style={[styles.sectionContainer, { marginBottom: 15 }]}>
              <Loc style={[styles.title2, { marginBottom: 5 }]} text="Miner fee" />
              <Loc style={[styles.question]} text="How fast you want this done?" />
              {this.renderFeeOptions()}
            </View>
            <View style={[styles.sectionContainer]}>
              <View style={[styles.customRow]}>
                <Loc style={[styles.title2, { flex: 1 }]} text="Custom" />
                <Switch
                  value={isCustomFee}
                  onValueChange={(v) => this.onCustomFeeSwitchValueChange(v)}
                />
              </View>
              {this.renderCustomFee(isCustomFee)}
            </View>
          </View>
          <View
            style={[styles.sectionContainer, {
              opacity: enableConfirm ? 1 : 0.5,
              width: '100%',
              justifyContent: 'center',
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
                // onVerified={this.onConfirmSliderVerified}
              onVerified={async () => {
                if (global.passcode) {
                  showPasscode('verify', this.onConfirmSliderVerified, this.confirmSlider.reset);
                } else {
                  await this.onConfirmSliderVerified();
                }
              }}
              icon={(
                <Image
                  source={isConfirm ? circleCheckIcon : circleIcon}
                  style={{ width: 32, height: 32 }}
                />
                )}
            >
              <Text style={[{ fontWeight: 'bold', color: 'black', fontSize: 15 }]}>{isConfirm ? strings('CONFIRMED') : strings('Slide to confirm')}</Text>
            </ConfirmSlider>
          </View>
          <Loader loading={loading} />
        </ScrollView>
      </SafeAreaView>
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
  prices: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currency: PropTypes.string.isRequired,
  showPasscode: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  prices: state.Wallet.get('prices'),
  currency: state.App.get('currency'),
  wallets: state.Wallet.get('walletManager') && state.Wallet.get('walletManager').wallets,
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
  showPasscode: (category, callback, fallback) => dispatch(
    appActions.showPasscode(category, callback, fallback),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);

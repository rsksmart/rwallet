import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ExchangeHeader from '../../components/headers/header.exchange';
// import Loc from '../../components/common/misc/loc';
import BasePageGereral from '../base/base.page.general';
import Button from '../../components/common/button/button';
import space from '../../assets/styles/space';
import color from '../../assets/styles/color.ts';

const styles = StyleSheet.create({
  body: {
    marginTop: -330,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 30,
  },
  greenLine: {
    marginTop: 7,
    marginBottom: 15,
    width: 35,
    height: 3,
    backgroundColor: '#00B520',
    borderRadius: 1.5,
  },
  listText: {
    lineHeight: 25,
  },
  rightButton: {
    color: '#FFF',
  },
  board: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 28,
    paddingVertical: 22,
  },
  sepratorLine: {
    borderColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
    width: '100%',
  },
  seprator: {
    marginVertical: 12,
    justifyContent: 'center',
  },
  exchangeIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  exchangeIconView: {
    alignSelf: 'center',
    backgroundColor: '#54B52D',
    alignItems: 'center',
  },
  operationView: {
    backgroundColor: '#F3F7F4',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
  },
  boardTokenViewLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  operationAmount: {
    color: '#FFBB00',
  },
  operationValue: {
    alignSelf: 'flex-end',
  },
  operationLeft: {
    flex: 1,
  },
  operationRight: {

  },
  receivingAmount: {
    color: '#00B520',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  boardTokenIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginLeft: -5,
  },
  boardTokenName: {
    fontSize: 25,
    color: color.component.swipableButtonList.title.color,
    fontFamily: 'Avenir-Book',
    letterSpacing: 0.4,
  },
  boardText: {
    color: '#9B9B9B',
  },
  boardWalletName: {
    color: '#000',
  },
  boardTokenView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  boardTokenExchangeIcon: {
    marginTop: -6,
  },
  boardAmountView: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  boardAmount: {
    color: '#FFBB00',
    fontSize: 27,
    fontFamily: 'Avenir-Book',
    letterSpacing: 0.4,
    flex: 1,
  },
  boardAmountReceive: {
    color: '#00B520',
  },
  boardValue: {
    fontFamily: 'Avenir-Book',
  },
  switcherView: {
    height: 40,
    marginTop: 33,
    backgroundColor: '#F3F3F3',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  switcherItem: {
    width: '33.3%',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 25,
  },
  switcherItemActived: {
    backgroundColor: '#00B520',
  },
  switcherText: {
    fontFamily: 'Avenir-Heavy',
  },
  switcherTextActived: {
    color: '#FFF',
  },
});

const res = {};
res.exchange = require('../../assets/images/icon/exchange.png');
res.BTC = require('../../assets/images/icon/BTC.png');
res.RBTC = require('../../assets/images/icon/RBTC.png');
res.RIF = require('../../assets/images/icon/RIF.png');
res.currencyExchange = require('../../assets/images/icon/currencyExchange.png');

export default class Exchange extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  render() {
    const { navigation } = this.props;
    const rightButton = (
      <TouchableOpacity onPress={() => null}>
        <MaterialCommunityIcons style={styles.rightButton} name="progress-clock" size={30} />
      </TouchableOpacity>
    );
    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        headerComponent={<ExchangeHeader title="page.wallet.exchange.title" onBackButtonPress={() => navigation.goBack()} rightButton={rightButton} />}
      >
        <View style={styles.body}>
          <View style={styles.board}>
            <Text style={styles.boardText}>
              I have 0.00463127 Bitcoin in
              <Text style={styles.boardWalletName}> Wallet name 1</Text>
            </Text>
            <View style={styles.boardTokenView}>
              <View style={styles.boardTokenViewLeft}>
                <Image style={styles.boardTokenIcon} source={res.BTC} />
                <Text style={styles.boardTokenName}>BTC</Text>
                <EvilIcons name="chevron-down" color="#9B9B9B" size={40} />
              </View>
              <Image style={styles.boardTokenExchangeIcon} source={res.currencyExchange} />
            </View>
            <View style={styles.boardAmountView}>
              <Text style={styles.boardAmount}>0.00362297</Text>
              <Text style={styles.boardValue}>$0</Text>
            </View>
          </View>
          <View style={styles.seprator}>
            <View style={styles.sepratorLine} />
            <View style={styles.exchangeIconView}>
              <Image style={styles.exchangeIcon} source={res.exchange} />
            </View>
          </View>
          <View style={styles.board}>
            <Text style={styles.boardText}>
              I want RBTC in
              <Text style={styles.boardWalletName}> Wallet name 1</Text>
            </Text>
            <View style={styles.boardTokenView}>
              <View style={styles.boardTokenViewLeft}>
                <Image style={styles.boardTokenIcon} source={res.BTC} />
                <Text style={styles.boardTokenName}>RBTC</Text>
                <EvilIcons name="chevron-down" color="#9B9B9B" size={40} />
              </View>
              <Image style={styles.boardTokenExchangeIcon} source={res.currencyExchange} />
            </View>
            <View style={styles.boardAmountView}>
              <Text style={[styles.boardAmount, styles.boardAmountReceive]}>0.00362297</Text>
              <Text style={styles.boardValue}>$0</Text>
            </View>
          </View>

          <View style={styles.switcherView}>
            <View style={[styles.switcherItem, styles.switcherItemActived]}>
              <Text style={[styles.switcherText, styles.switcherTextActived]}>MIN</Text>
            </View>
            <View style={styles.switcherItem}>
              <Text style={styles.switcherText}>HALF</Text>
            </View>
            <View style={styles.switcherItem}>
              <Text style={styles.switcherText}>ALL</Text>
            </View>
          </View>

          <View style={[styles.operationView, space.marginTop_27]}>
            <View style={styles.operationLeft}>
              <Text>Exchanging</Text>
            </View>
            <View style={styles.operationRight}>
              <Text style={styles.operationAmount}>0.00362297 BTC</Text>
              <Text style={styles.operationValue}>$35</Text>
            </View>
          </View>
          <View style={[styles.operationView, space.marginTop_10]}>
            <View style={styles.operationLeft}>
              <Text>Receiving</Text>
            </View>
            <View style={styles.operationRight}>
              <Text style={[styles.operationAmount, styles.receivingAmount]}>+0.16277451 RBTC</Text>
              <Text style={styles.operationValue}>+$33.99</Text>
            </View>
          </View>
          <View style={[styles.buttonView, space.marginTop_30, space.marginBottom_20]}>
            <Button text="button.Exchange" onPress={() => null} />
          </View>
        </View>
      </BasePageGereral>
    );
  }
}

Exchange.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

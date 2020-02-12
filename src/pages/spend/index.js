/* eslint-disable */

import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EarnHeader from '../../components/headers/header.earn';
import Loc from '../../components/common/misc/loc';
import RSKad from '../../components/common/rsk.ad';
import BasePageGereral from '../base/base.page.general';
import CoinswitchHelper from '../../common/coinswitch.helper';
import Transaction from '../../common/transaction';


const headerImage = require('../../assets/images/misc/title.image.spend.png');

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginHorizontal: 30,
    marginBottom: 50,
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
});

class SpendIndex extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  exchange = async () => {
    const FEE_LEVEL_ADJUSTMENT = 0.25;
    const DEFAULT_RBTC_GAS_PRICE = 600000000;
    const DEFAULT_RBTC_MIN_GAS = 21000;
    const DEFAULT_RBTC_MEDIUM_GAS = DEFAULT_RBTC_MIN_GAS / (1 - FEE_LEVEL_ADJUSTMENT);
    const COIN_ID = 'RBTCTestnet';
    const SOURCE_ADDRESS = '0x35E694f4984f66E85cDE79155dec6568345655e6';
    const TARGET_ADDRESS = '0x0cD30a224d5B86d9729ab3E32C196AcFD927101E';


    try {
      const order = await CoinswitchHelper.placeOrder('rbtc', 'btc', 0.02, { address: '1736ZdbgBLy4mL4VuzsqavGJqY9KYcPnM9' }, { address: '0x3D503484703bcF9C9e75E197d254045E30b3025e' });
      const {orderId, exchangeAddress: {address}} = order;

      let coin = null;
      const { walletManager: { wallets } } = this.props;
      console.log(wallets);
      for (let i = 0; i < wallets.length; i++) {
        coin = wallets[i].coins.find((c) => c.id === COIN_ID && c.address === SOURCE_ADDRESS);
        if (coin) break;
      }
      const feeParams = {
        gasPrice: DEFAULT_RBTC_GAS_PRICE.toString(),
        gas: DEFAULT_RBTC_MEDIUM_GAS * (1 + FEE_LEVEL_ADJUSTMENT),
      };
      const extraParams = { data: '', memo: '', gasFee: feeParams };

      let transaction = new Transaction(coin, TARGET_ADDRESS, '0.01', extraParams);
      await transaction.processRawTransaction();
      await transaction.signTransaction();
      await transaction.processSignedTransaction();
      const completedParams = {
        type: coin.type,
        hash: transaction.txHash,
      };
      transaction = null;
      console.log(completedParams);

    } catch (error) {
      console.log(error)
    }

  };

  render() {
    return (
      <BasePageGereral
        isSafeView={false}
        hasBottomBtn={false}
        hasLoader={false}
        renderAccessory={() => <RSKad />}
        headerComponent={<EarnHeader title="page.spend.index.title" imageSource={headerImage} imageBgColor="#61DABF" />}
      >
        <TouchableOpacity onPress={this.exchange}>
          <View style={styles.body}>
            <Loc style={[styles.title]} text="page.spend.index.featuresTitle" />
            <View style={styles.greenLine} />
            <Loc style={[styles.listText]} text="page.spend.index.feature1" />
            <Loc style={[styles.listText]} text="page.spend.index.feature2" />
            <Loc style={[styles.listText]} text="page.spend.index.feature3" />
          </View>
        </TouchableOpacity>
      </BasePageGereral>
    );
  }
}

SpendIndex.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }),
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

export default connect(mapStateToProps, null)(SpendIndex);

import React, { Component } from 'react';
import {
  StyleSheet, FlatList, TouchableOpacity, Text, Image, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import color from '../../assets/styles/color.ts';
import common from '../../common/common';

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: color.component.swipableButtonList.rowFront.backgroundColor,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    borderBottomColor: color.component.swipableButtonList.right.borderBottomColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right1: {
    flex: 1,
  },
  right2: {
    alignItems: 'flex-end',
    right: 5,
    position: 'absolute',
  },
  title: {
    color: color.component.swipableButtonList.title.color,
    fontSize: 16,
    fontFamily: 'Avenir-Heavy',
    letterSpacing: 0.4,
  },
  text: {
    color: color.component.swipableButtonList.text.color,
    fontFamily: 'Avenir-Roman',
    fontSize: 13,
    letterSpacing: 0.27,
  },
  icon: {
    marginRight: 10,
    marginLeft: 5,
  },
  body: {
    marginHorizontal: 18,
  },
});

class SelectWallet extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static renderWalletList(listData) {
    return (
      <FlatList
        data={listData}
        extraData={listData}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            activeOpacity={1.0}
            onPress={() => item.onPress()}
          >
            <Image style={styles.icon} source={item.icon} />
            <View style={styles.right}>
              <View style={styles.right1}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  static createListData(wallets, navigation) {
    const { operation } = navigation.state.params;
    if (!_.isArray(wallets)) {
      return [];
    }

    const listData = [];

    // Create element for each wallet (e.g. key 0)
    wallets.forEach((wallet) => {
      const wal = { name: wallet.name, coins: [] };
      // Create element for each Token (e.g. BTC, RBTC, RIF)
      wallet.coins.forEach((coin, index) => {
        const coinType = common.getSymbolFullName(coin.symbol, coin.type);
        const item = {
          key: `${index}`,
          title: coin.defaultName,
          text: coinType,
          icon: coin.icon,
          onPress: () => {
            if (operation === 'send') {
              navigation.navigate('Transfer', { wallet, coin });
            } else if (operation === 'receive') {
              navigation.navigate('WalletReceive', { coin });
            }
          },
        };
        wal.coins.push(item);
      });
      listData.push(wal);
    });

    return listData;
  }

  componentWillMount() {
    const {
      walletManager, navigation,
    } = this.props;

    const { wallets } = walletManager;
    const listData = SelectWallet.createListData(wallets, navigation);

    this.setState({ listData });
  }

  render() {
    const { navigation } = this.props;
    const { listData } = this.state;
    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn={false}
        hasLoader={false}
        headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="Select Wallet" />}
      >
        <View style={styles.body}>
          <FlatList
            data={listData}
            renderItem={({ item }) => (
              <View>
                <Text style={[styles.sectionTitle]}>{item.name}</Text>
                {SelectWallet.renderWalletList(item.coins)}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </BasePageGereral>
    );
  }
}

SelectWallet.propTypes = {
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

SelectWallet.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

export default connect(mapStateToProps)(SelectWallet);

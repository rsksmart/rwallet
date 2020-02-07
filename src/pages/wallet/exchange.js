import React, { Component } from 'react';
import {
  StyleSheet, FlatList, TouchableOpacity, Text, Image, View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import common from '../../common/common';
import coinListItemStyles from '../../assets/styles/coin.listitem.styles';

const styles = StyleSheet.create({
  body: {
    marginHorizontal: 18,
  },
});

class Exchange extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static renderWalletList(listData) {
    return (
      <FlatList
        data={listData}
        extraData={listData}
        renderItem={({ item }) => (
          <TouchableOpacity style={coinListItemStyles.row} onPress={() => item.onPress()}>
            <Image style={coinListItemStyles.icon} source={item.icon} />
            <View style={coinListItemStyles.rowRightView}>
              <View style={coinListItemStyles.rowTitleView}>
                <Text style={coinListItemStyles.title}>{item.title}</Text>
                <Text style={coinListItemStyles.text}>{item.text}</Text>
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
    const listData = Exchange.createListData(wallets, navigation);

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
        headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.selectWallet.title" />}
      >
        <View style={styles.body}>
          <FlatList
            data={listData}
            renderItem={({ item }) => (
              <View style={coinListItemStyles.itemView}>
                <Text style={[coinListItemStyles.sectionTitle]}>{item.name}</Text>
                {Exchange.renderWalletList(item.coins)}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
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
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }),
};

Exchange.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

export default connect(mapStateToProps)(Exchange);

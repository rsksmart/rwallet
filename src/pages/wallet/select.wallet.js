import React, { Component } from 'react';
import {
  StyleSheet, FlatList, TouchableOpacity, Text, Image, View,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BasePageSimple from '../base/base.page.simple';
import Header from '../../components/headers/header';
import common from '../../common/common';
import coinListItemStyles from '../../assets/styles/coin.listitem.styles';

const styles = StyleSheet.create({
  body: {
    marginTop: 5,
    marginHorizontal: 18,
  },
});

export default class SelectWallet extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static renderAssetsList(listData) {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
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

  static createListData(wallet, navigation) {
    const { operation, onDetectedAction } = navigation.state.params;
    const listData = [];
    // Create element for each Token (e.g. BTC, RBTC, RIF)
    _.each(wallet.coins, (coin) => {
      const coinType = common.getSymbolName(coin.symbol, coin.type);
      const item = {
        title: coin.defaultName,
        text: coinType,
        icon: coin.icon,
        onPress: () => {
          if (operation === 'send') {
            navigation.navigate('Transfer', { wallet, coin });
          } else if (operation === 'receive') {
            navigation.navigate('WalletReceive', { coin });
          } else if (operation === 'scan') {
            navigation.navigate('Scan', { coin, onDetectedAction });
          }
        },
      };
      listData.push(item);
    });
    return listData;
  }

  componentWillMount() {
    const { navigation } = this.props;

    const { wallet } = navigation.state.params;
    const listData = SelectWallet.createListData(wallet, navigation);

    this.name = wallet.name;
    this.setState({ listData });
  }

  render() {
    const { navigation } = this.props;
    const { listData } = this.state;
    return (
      <BasePageSimple
        isSafeView
        headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.selectWallet.title" />}
      >
        <View style={styles.body}>
          <Text style={[coinListItemStyles.sectionTitle]}>{this.name}</Text>
          { SelectWallet.renderAssetsList(listData) }
        </View>
      </BasePageSimple>
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
};

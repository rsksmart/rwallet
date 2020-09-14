import React, { Component } from 'react';
import {
  StyleSheet, FlatList, TouchableOpacity, Text, Image, View,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Rsk3 from '@rsksmart/rsk3';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import BasePageSimple from '../base/base.page.simple';
import Header from '../../components/headers/header';
import common from '../../common/common';
import coinListItemStyles from '../../assets/styles/coin.listitem.styles';
import space from '../../assets/styles/space';
import screenHelper from '../../common/screenHelper';
import { createErrorNotification } from '../../common/notification.controller';
import appActions from '../../redux/app/actions';

const styles = StyleSheet.create({
  body: {
    marginTop: 5,
    marginHorizontal: 18,
    flex: 1,
  },
  listFooter: {
    marginBottom: 10 + screenHelper.bottomHeight,
  },
});

class SelectWallet extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static validateAddress(address, symbol, type, networkId) {
    let toAddress = address;
    if (symbol !== 'BTC') {
      try {
        toAddress = Rsk3.utils.toChecksumAddress(address, networkId);
      } catch (error) {
        return false;
      }
    }
    const isAddress = common.isWalletAddress(toAddress, symbol, type, networkId);
    if (!isAddress) {
      return false;
    }
    return true;
  }

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
        ListFooterComponent={<View style={space.marginBottom_20} />}
      />
    );
  }

  static createListData(wallet, navigation, addNotification) {
    const { operation, onDetectedAction, toAddress } = navigation.state.params;
    const listData = [];
    // Create element for each Token (e.g. BTC, RBTC, RIF)
    _.each(wallet.coins, (coin) => {
      const coinType = common.getSymbolName(coin.symbol, coin.type);
      const item = {
        title: coinType,
        text: coin.defaultName,
        icon: coin.icon,
        onPress: () => {
          if (operation === 'send') {
            navigation.navigate('Transfer', { wallet, coin });
          } else if (operation === 'receive') {
            navigation.navigate('WalletReceive', { coin });
          } else if (operation === 'scan') {
            this.isAddressValid = SelectWallet.validateAddress(toAddress, coin.symbol, coin.type, coin.networkId);
            if (!this.isAddressValid) {
              const notification = createErrorNotification(
                'modal.invalidAddress.title',
                'modal.invalidAddress.body',
              );
              addNotification(notification);
              navigation.goBack();
              return;
            }

            if (onDetectedAction === 'backToTransfer') {
              navigation.state.params.onQrcodeDetected(toAddress);
              navigation.goBack();
            } else {
              const resetAction = StackActions.reset({
                index: 1,
                actions: [
                  NavigationActions.navigate({ routeName: 'Dashboard' }),
                  NavigationActions.navigate({ routeName: 'Transfer', params: { coin, toAddress } }),
                ],
              });
              navigation.dispatch(resetAction);
            }
          }
        },
      };
      listData.push(item);
    });
    return listData;
  }

  componentWillMount() {
    const { navigation, addNotification } = this.props;

    const { wallet } = navigation.state.params;
    const listData = SelectWallet.createListData(wallet, navigation, addNotification);

    this.name = wallet.name;
    this.setState({ listData });
  }

  render() {
    const { navigation } = this.props;
    const { listData } = this.state;
    return (
      <BasePageSimple
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
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectWallet);

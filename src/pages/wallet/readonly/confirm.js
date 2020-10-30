import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, TextInput, Image, Text, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';
import Header from '../../../components/headers/header';
import Loc from '../../../components/common/misc/loc';
import presetStyle from '../../../assets/styles/style';
import walletActions from '../../../redux/wallet/actions';
import BasePageGereral from '../../base/base.page.general';
import coinListItemStyles from '../../../assets/styles/coin.listitem.styles';
import flex from '../../../assets/styles/layout.flex';
import Button from '../../../components/common/button/button';
import readOnlyStyles from '../../../assets/styles/readonly';
import parseHelper from '../../../common/parse';
import common from '../../../common/common';
import Switch from '../../../components/common/switch/switch';
import { strings } from '../../../common/i18n';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';
import config from '../../../../config';

const styles = StyleSheet.create({
  addAsset: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonView: {
    marginTop: 10,
    marginBottom: -20,
  },
  rowAmountViewRight: {
    alignItems: 'flex-end',
  },
});

class AddReadOnlyWalletConfirmation extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const {
        chain, type, address, subdomain,
      } = props.navigation.state.params;
      this.chain = chain;
      this.type = type;
      this.address = address;
      this.subdomain = subdomain;
      let coins = [];
      if (chain === 'Rootstock') {
        const { consts: { supportedTokens } } = config;
        coins = _.map(_.filter(supportedTokens, (token) => token !== 'BTC'), (token) => ({ symbol: token }));
      } else {
        coins = [{ symbol: 'BTC' }];
      }
      coins = _.map(coins, (coin) => {
        const { symbol } = coin;
        const { icon, defaultName: name } = common.getCoinType(symbol, type);
        return {
          symbol, icon, name, balance: null, worth: null, type,
        };
      });
      this.state = { coins };
    }

    async componentDidMount() {
      const { coins } = this.state;
      const { type, address } = this;
      _.each(coins, async (coin, index) => {
        const balance = await CancelablePromiseUtil.makeCancelable(parseHelper.getBalance({
          type, symbol: coin.symbol, address, needFetch: false,
        }), this);
        const newCoins = [...coins];
        newCoins[index].balance = common.convertUnitToCoinAmount(newCoins[index].symbol, balance, newCoins[index].precision);
        this.setState({ coins: newCoins });
      });
    }

    componentWillUnmount() {
      CancelablePromiseUtil.cancel(this);
    }

    onBackButtonPress = () => {
      const { navigation } = this.props;
      navigation.goBack();
    }

    renderListItem = (item) => {
      const { prices, currency } = this.props;
      const symbol = common.getSymbolName(item.symbol, item.type);
      const balanceText = item.balance ? common.getBalanceString(item.balance, item.symbol) : '0';
      const worseText = item.balance ? common.getCoinValue(item.balance, item.symbol, item.type, currency, prices) : '0';
      const balanceValueText = common.getAssetValueString(worseText) || '0';
      const currencySymbol = common.getCurrencySymbol(currency);

      return (
        <View style={coinListItemStyles.row} onPress={item.onPress}>
          <Image style={coinListItemStyles.icon} source={item.icon} />
          <View style={coinListItemStyles.rowRightView}>
            <View style={coinListItemStyles.rowTitleView}>
              <Text style={coinListItemStyles.title}>{symbol}</Text>
              <Text style={coinListItemStyles.text}>{item.name}</Text>
            </View>
            <View style={coinListItemStyles.rowAmountView}>
              { !item.balance ? (<ActivityIndicator size="small" />)
                : (
                  <View style={styles.rowAmountViewRight}>
                    <Text style={coinListItemStyles.worth}>{balanceText}</Text>
                    <Text style={coinListItemStyles.amount}>{`${currencySymbol}${balanceValueText}`}</Text>
                  </View>
                )}
            </View>
          </View>
        </View>
      );
    }

    onConfirm = () => {
      const { createReadOnlyWallet, navigation } = this.props;
      const { chain, type, address } = this;
      const { coins } = this.state;
      createReadOnlyWallet(chain, type, address, coins);
      const stackActions = StackActions.popToTop();
      navigation.dispatch(stackActions);
    }

    render() {
      const { address, subdomain, type } = this;
      const { coins } = this.state;

      const inputText = subdomain || address;
      const subdomainAddressText = subdomain ? address : null;
      const questionText = subdomainAddressText ? strings('page.wallet.addReadOnlyWallet.rnsQuestion') : strings('page.wallet.addReadOnlyWallet.question');

      const customButton = (
        <View>
          <Button text="button.confirm" onPress={this.onConfirm} />
          <Button style={styles.cancelButtonView} type="cancel" text="button.Reset" onPress={this.onBackButtonPress} />
        </View>
      );
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn={false}
          hasLoader={false}
          bottomBtnText="button.check"
          bottomBtnOnPress={this.onPress}
          headerComponent={<Header onBackButtonPress={this.onBackButtonPress} title="page.wallet.addReadOnlyWallet.title" />}
          customBottomButton={customButton}
        >
          <View style={readOnlyStyles.body}>
            <View style={readOnlyStyles.titleRow}>
              <Loc style={[readOnlyStyles.title]} text="page.wallet.addReadOnlyWallet.address" />
            </View>
            <TextInput
              style={[presetStyle.textInput, readOnlyStyles.addressInput]}
              value={inputText}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              editable={false}
              multiline
            />
            <View style={readOnlyStyles.chainType}>
              <Loc style={[readOnlyStyles.switchTitle]} text="page.wallet.addCustomToken.mainnet" />
              <Switch value={type === 'Mainnet'} onValueChange={this.onSwitchValueChanged} disabled />
            </View>
            <View style={readOnlyStyles.questionRow}>
              <Text>{questionText}</Text>
            </View>
            { subdomainAddressText && (
            <View style={readOnlyStyles}>
              <Text style={readOnlyStyles.addressText}>{subdomainAddressText}</Text>
            </View>
            ) }
            <FlatList
              style={flex.flex1}
              data={coins}
              renderItem={({ item }) => this.renderListItem(item)}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              bounces={false}
            />
          </View>
        </BasePageGereral>
      );
    }
}

AddReadOnlyWalletConfirmation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({}),
  createReadOnlyWallet: PropTypes.func.isRequired,
  prices: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currency: PropTypes.string.isRequired,
};

AddReadOnlyWalletConfirmation.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  prices: state.Price.get('prices'),
  currency: state.App.get('currency'),
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  createReadOnlyWallet: (chain, type, address, coins) => dispatch(walletActions.createReadOnlyWallet(chain, type, address, coins)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddReadOnlyWalletConfirmation);

import React, { Component } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';
import _ from 'lodash';
import Loc from '../../components/common/misc/loc';
import appActions from '../../redux/app/actions';
import walletActions from '../../redux/wallet/actions';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import { createInfoNotification } from '../../common/notification.controller';
import config from '../../../config';
import coinType from '../../common/wallet/cointype';
import common from '../../common/common';
import Item from '../../components/wallet/coin.type.list.item';
import color from '../../assets/styles/color';

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: color.black,
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionContainer: {
    paddingHorizontal: 10,
    marginTop: 15,
  },
});

class WalletSelectCurrency extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.state = {
        isLoading: false,
        isDisabledSwitch: false,
      };
      this.phrase = navigation.state.params ? navigation.state.params.phrases : '';
      this.isImportWallet = !!this.phrase;
      this.onCreateButtonPress = this.onCreateButtonPress.bind(this);
      this.mainnet = [];
      this.testnet = [];
      const { consts: { supportedTokens } } = config;
      // Generate mainnet and testnet list data
      _.each(supportedTokens, (token) => {
        const item = { title: token, icon: coinType[token].icon };
        item.selected = true;
        this.mainnet.push(item);
        const testnetItem = { title: common.getSymbolName(token, 'Testnet'), icon: coinType[`${token}Testnet`].icon };
        testnetItem.selected = false;
        this.testnet.push(testnetItem);
      });
    }

    componentWillReceiveProps(nextProps) {
      const { navigation, isWalletsUpdated } = nextProps;
      const { isLoading } = this.state;
      // isWalletsUpdated is true indicates wallet is added, the app will navigate to other page.
      if (isWalletsUpdated && isLoading) {
        this.setState({ isLoading: false });
        const statckActions = StackActions.popToTop();
        navigation.dispatch(statckActions);
      }
    }

    // call resetWalletsUpdated when componentWillUnmount is safe.
    componentWillUnmount() {
      const { isWalletsUpdated, resetWalletsUpdated } = this.props;
      if (isWalletsUpdated) {
        resetWalletsUpdated();
      }
    }

    async onCreateButtonPress() {
      const { navigation } = this.props;
      const coins = [];
      for (let i = 0; i < this.mainnet.length; i += 1) {
        if (this.mainnet[i].selected) {
          coins.push({ symbol: this.mainnet[i].title, type: 'Mainnet' });
        }
      }
      for (let i = 0; i < this.testnet.length; i += 1) {
        if (this.testnet[i].selected) {
          coins.push({ symbol: this.mainnet[i].title, type: 'Testnet' });
        }
      }
      if (this.isImportWallet) {
        this.requestCreateWallet(this.phrase, coins);
      } else {
        navigation.navigate('RecoveryPhrase', { coins, shouldCreatePhrase: true, shouldVerifyPhrase: true });
      }
    }

    onSwitchValueChanged = () => {
      const selectedMainnetItems = _.filter(this.mainnet, { selected: true });
      const selectedTestnetItems = _.filter(this.testnet, { selected: true });
      const selectedCount = selectedMainnetItems.length + selectedTestnetItems.length;
      this.setState({ isDisabledSwitch: selectedCount === 1 });
    }

    requestCreateWallet(phrase, coins) {
      const { addNotification, showPasscode, passcode } = this.props;
      if (passcode) {
        this.createWallet(phrase, coins);
      } else {
        const notification = createInfoNotification(
          'modal.createPasscode.title',
          'modal.createPasscode.body',
          null,
          () => showPasscode('create', () => this.createWallet(phrase, coins)),
        );
        addNotification(notification);
      }
    }

    createWallet(phrase, coins) {
      // createKey cost time, it will block ui.
      // So we let run at next tick, loading ui can present first.
      const { navigation } = this.props;
      const { createKey, walletManager } = this.props;
      let derivationPaths = null;
      if (navigation.state.params && navigation.state.params.derivationPaths) {
        derivationPaths = navigation.state.params.derivationPaths;
      }
      this.setState({ isLoading: true }, () => {
        setTimeout(() => {
          createKey(null, phrase, coins, walletManager, derivationPaths);
        }, 0);
      });
    }

    renderList = (data, isDisabled) => (
      // Restrict the deletion of the last token
      <FlatList
        extraData={isDisabled}
        data={data}
        renderItem={({ item }) => <Item data={item} isDisabled={isDisabled && item.selected} onValueChange={this.onSwitchValueChanged} />}
        keyExtractor={(item) => item.title}
      />
    )

    render() {
      const { isLoading, isDisabledSwitch } = this.state;
      const { navigation } = this.props;
      const bottomBtnText = this.isImportWallet ? 'button.IMPORT' : 'button.create';
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          bottomBtnText={bottomBtnText}
          bottomBtnOnPress={this.onCreateButtonPress}
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.selectCurrency.title" />}
        >
          <View style={[styles.sectionContainer]}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.selectCurrency.mainnet" />
            { this.renderList(this.mainnet, isDisabledSwitch) }
          </View>
          <View style={[styles.sectionContainer]}>
            <Loc style={[styles.sectionTitle]} text="page.wallet.selectCurrency.testnet" />
            { this.renderList(this.testnet, isDisabledSwitch) }
          </View>
        </BasePageGereral>
      );
    }
}

WalletSelectCurrency.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  walletManager: PropTypes.shape({}),
  createKey: PropTypes.func.isRequired,
  resetWalletsUpdated: PropTypes.func.isRequired,
  isWalletsUpdated: PropTypes.bool.isRequired,
  addNotification: PropTypes.func.isRequired,
  showPasscode: PropTypes.func.isRequired,
  passcode: PropTypes.string,
};

WalletSelectCurrency.defaultProps = {
  walletManager: undefined,
  passcode: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  passcode: state.App.get('passcode'),
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (updateFields) => dispatch(appActions.updateUser(updateFields)),
  createKey: (name, phrases, coins, walletManager, derivationPaths) => dispatch(walletActions.createKey(name, phrases, coins, walletManager, derivationPaths)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  showPasscode: (category, callback) => dispatch(appActions.showPasscode(category, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectCurrency);

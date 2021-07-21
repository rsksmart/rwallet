import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, FlatList, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import color from '../../assets/styles/color';
import fontFamily from '../../assets/styles/font.family';
import space from '../../assets/styles/space';
import Loc from '../../components/common/misc/loc';
import coinType from '../../common/wallet/cointype';
import common from '../../common/common';
import config from '../../../config';
import references from '../../assets/references';
import walletActions from '../../redux/wallet/actions';
import { strings } from '../../common/i18n';
import ResponsiveText from '../../components/common/misc/responsive.text';
import { createBTCAddressTypeConfirmation } from '../../common/confirmation.controller';
import appActions from '../../redux/app/actions';
import { WalletType, BtcAddressType } from '../../common/constants';
import TokenSwitch from '../../components/common/switch/switch.token';

const styles = StyleSheet.create({
  enabledAssetsView: {
    flexDirection: 'row',
  },
  enabledAssetsText: {
    color: color.white,
    fontFamily: fontFamily.AvenirMedium,
    fontSize: 20,
    letterSpacing: -0.44,
  },
  note: {
    color: color.white,
    fontFamily: fontFamily.AvenirBook,
    fontSize: 15,
    letterSpacing: 0.07,
    marginTop: 14,
  },
  body: {
    marginTop: -32,
    marginHorizontal: 24,
  },
  addCustomTokenView: {
    backgroundColor: color.whiteA50,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 24,
    flex: 1,
  },
  addCustomTokenText: {
    color: color.white,
    fontFamily: fontFamily.AvenirMedium,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: color.white,
    alignItems: 'center',
    height: 67,
    marginTop: 10,
    borderRadius: 10,
  },
  switch: {
    marginRight: 20,
  },
  rightButtonView: {
    position: 'absolute',
    bottom: 94,
    right: 0,
  },
  cornerButton: {
    height: 67,
    width: 129,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  cornerButtonView: {
    marginLeft: 13,
    flexDirection: 'row',
  },
  cornerButtonText: {
    width: 75,
  },
  cornerButtonFont: {
    fontFamily: fontFamily.AvenirMedium,
  },
  cornerButtonPlus: {
    color: color.app.theme,
    fontFamily: fontFamily.AvenirMedium,
    fontSize: 20,
  },
});

class AddToken extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static getSelectedTokenCount(listData) {
    let count = 0;
    _.each(listData, (item) => {
      count += item.selected;
    });
    return count;
  }

  constructor(props) {
    super(props);
    this.wallet = props.navigation.state.params.wallet;
    const listData = this.createListData();
    const selectedTokenCount = AddToken.getSelectedTokenCount(listData);
    this.state = { listData, tokenCount: listData.length, selectedTokenCount };
  }

  componentWillUnmount() {
    const { isWalletsUpdated, resetWalletsUpdated } = this.props;
    if (isWalletsUpdated) {
      resetWalletsUpdated();
    }
  }

  onSwitchValueChanged = (index, value) => {
    const {
      walletManager, addToken, deleteToken, resetWalletsUpdated, addConfirmation,
    } = this.props;
    const { listData } = this.state;
    const listItem = listData[index];
    listItem.selected = value;

    if (listItem.selected && listItem.token.symbol === 'BTC' && !this.wallet.getBtcAddressType()) {
      // If the BTC address type has not been set before, when we choose BTC, we should ask the user for the BTC address type
      const confirmation = createBTCAddressTypeConfirmation(() => {
        this.addBTCToken(listItem.token, BtcAddressType.legacy);
      }, () => {
        this.addBTCToken(listItem.token, BtcAddressType.segwit);
      });
      addConfirmation(confirmation);
    } else if (listItem.selected) {
      addToken(walletManager, this.wallet, listItem.token);
    } else {
      deleteToken(walletManager, this.wallet, listItem.token);
    }
    const selectedTokenCount = AddToken.getSelectedTokenCount(listData);
    this.setState({ listData, selectedTokenCount });
    // Before changing the token, force to reset the isWalletsUpdated state.
    // Avoid other pages not being able to detect the change of state.
    resetWalletsUpdated();
  }

  onAddCustomTokenPressed = () => {
    const { navigation, resetWalletsUpdated } = this.props;
    resetWalletsUpdated();
    navigation.navigate('AddCustomToken', navigation.state.params);
  }

  addBTCToken = (token, btcAddressType) => {
    const { walletManager, addToken } = this.props;
    const newToken = token;
    newToken.addressType = btcAddressType;
    addToken(walletManager, this.wallet, newToken);
  }

  createListData() {
    const { coins } = this.wallet;
    let listData = [];
    const { consts: { supportedTokens } } = config;

    const createItem = (token, type) => {
      const coinId = type === 'Mainnet' ? token : token + type;
      // If token doesnt have a config file, dont create the item
      if (!coinType[coinId]) {
        return null;
      }
      const { icon } = coinType[coinId];
      const name = common.getSymbolName(token, type);
      const item = {
        name, icon, selected: false, symbol: token, type, token: { symbol: token, type },
      };
      const coin = _.find(coins, { symbol: token, type });
      if (coin) {
        item.token = coin;
        item.selected = true;
      }
      return item;
    };

    // add custom tokens to list data
    _.each(coins, (coin) => {
      const foundToken = _.find(supportedTokens, (token) => coin.symbol === token);
      if (!foundToken) {
        const name = common.getSymbolName(coin.symbol, coin.type);
        listData.push({
          name, icon: coin.icon, symbol: coin.symbol, type: coin.type, selected: true, token: coin,
        });
      }
    });

    // add supportedTokens to list data
    _.each(supportedTokens, (token) => {
      if (this.wallet.walletType === WalletType.Readonly) {
        if (token !== 'BTC') {
          listData.push(createItem(token, this.wallet.type));
        }
      } else {
        const mainnetItem = createItem(token, 'Mainnet');
        if (mainnetItem) {
          listData.push(mainnetItem);
        }
        const testnetItem = createItem(token, 'Testnet');

        if (testnetItem) {
          listData.push(testnetItem);
        }
      }
    });

    listData = common.sortTokens(listData);

    return listData;
  }

  renderList() {
    const { listData } = this.state;
    const selectedItems = _.filter(listData, { selected: true });
    return (
      <FlatList
        style={space.marginBottom_4}
        extraData={this.state}
        data={listData}
        renderItem={({ item, index }) => (
          <TokenSwitch
            style={[styles.row, space.paddingLeft_20, index === 0 ? space.marginTop_0 : 0]}
            switchStyle={styles.switch}
            icon={item.icon}
            name={item.name}
            value={item.selected}
            disabled={selectedItems.length === 1 && item.selected}
            onSwitchValueChanged={(value) => this.onSwitchValueChanged(index, value)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  render() {
    const { navigation } = this.props;
    const { selectedTokenCount, tokenCount } = this.state;

    const customButton = (
      <TouchableOpacity style={styles.addCustomTokenView} onPress={this.onAddCustomTokenPressed}>
        <Text style={styles.addCustomTokenText}>{`+ ${strings('page.wallet.addToken.addCustomToken')}`}</Text>
      </TouchableOpacity>
    );

    const rightButton = () => (
      <TouchableOpacity style={styles.rightButtonView} onPress={this.onAddCustomTokenPressed}>
        <ImageBackground source={references.images.cornerButton} style={styles.cornerButton}>
          <View style={styles.cornerButtonView}>
            <Text style={styles.cornerButtonPlus}>+ </Text>
            <ResponsiveText layoutStyle={styles.cornerButtonText} fontStyle={styles.cornerButtonFont} maxFontSize={16}>{strings('page.wallet.addToken.custom')}</ResponsiveText>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );

    const header = (
      <Header
        onBackButtonPress={() => navigation.goBack()}
        title="page.wallet.addToken.title"
        rightBtn={rightButton}
      />
    );

    return (
      <BasePageGereral
        isViewWrapper
        isSafeView
        customBottomButton={customButton}
        hasLoader={false}
        bgColor={color.app.theme}
        headerComponent={header}
      >
        <View style={[styles.body, { flex: 1 }]}>
          <View style={styles.enabledAssetsView}>
            <Loc style={styles.enabledAssetsText} text="page.wallet.addToken.enabledAssets" />
            <Text style={styles.enabledAssetsText}>
              {` (${selectedTokenCount}/${tokenCount})`}
            </Text>
          </View>
          <Loc style={[styles.note, space.marginBottom_17]} text="page.wallet.addToken.note" />
          { this.renderList() }
        </View>
      </BasePageGereral>
    );
  }
}

AddToken.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        wallet: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  addToken: PropTypes.func.isRequired,
  deleteToken: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({}).isRequired,
  resetWalletsUpdated: PropTypes.func.isRequired,
  isWalletsUpdated: PropTypes.bool.isRequired,
  addConfirmation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  deleteToken: (walletManager, wallet, token) => dispatch(walletActions.deleteToken(walletManager, wallet, token)),
  addToken: (walletManager, wallet, token) => dispatch(walletActions.addToken(walletManager, wallet, token)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddToken);

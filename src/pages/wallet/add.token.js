import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, FlatList, Image, Switch, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import color from '../../assets/styles/color.ts';
import space from '../../assets/styles/space';
import Loc from '../../components/common/misc/loc';
import coinType from '../../common/wallet/cointype';
import common from '../../common/common';
import config from '../../../config';
import references from '../../assets/references';
import walletActions from '../../redux/wallet/actions';

const styles = StyleSheet.create({
  enabledAssetsView: {
    flexDirection: 'row',
  },
  enabledAssetsText: {
    color: color.white,
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    letterSpacing: -0.44,
  },
  note: {
    color: color.white,
    fontFamily: 'Avenir-Book',
    fontSize: 15,
    letterSpacing: 0.07,
    marginTop: 14,
  },
  body: {
    marginTop: -32,
    marginHorizontal: 24,
  },
  addCustomTokenView: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 24,
    flex: 1,
  },
  addCustomTokenText: {
    color: color.white,
    fontFamily: 'Avenir-Medium',
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
  rowTitle: {
    marginLeft: 20,
    flex: 1,
  },
  icon: {
    marginLeft: 20,
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
  cornerButtonText: {
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    marginLeft: 13,
  },
  cornerButtonPlus: {
    color: '#00BA00',
    fontFamily: 'Avenir-Medium',
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
    this.onSwitchValueChanged = this.onSwitchValueChanged.bind(this);
    this.onAddCustomTokenPressed = this.onAddCustomTokenPressed.bind(this);
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

  onSwitchValueChanged(index, value) {
    const {
      walletManager, addToken, deleteToken, resetWalletsUpdated,
    } = this.props;
    const { listData } = this.state;
    listData[index].selected = value;
    const selectedTokenCount = AddToken.getSelectedTokenCount(listData);
    this.setState({ listData, selectedTokenCount });
    // Before changing the token, force to reset the isWalletsUpdated state.
    // Avoid other pages not being able to detect the change of state.
    resetWalletsUpdated();
    if (listData[index].selected) {
      addToken(walletManager, this.wallet, listData[index].token);
    } else {
      deleteToken(walletManager, this.wallet, listData[index].token);
    }
  }

  onAddCustomTokenPressed() {
    const { navigation, resetWalletsUpdated } = this.props;
    resetWalletsUpdated();
    navigation.navigate('AddCustomToken', navigation.state.params);
  }

  createListData() {
    const { coins } = this.wallet;
    let listData = [];
    const { consts: { supportedTokens } } = config;

    const createItem = (token, type) => {
      const coinId = type === 'Mainnet' ? token : token + type;
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
      listData.push(createItem(token, 'Mainnet'));
      listData.push(createItem(token, 'Testnet'));
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
          <View style={[styles.row, index === 0 ? space.marginTop_0 : 0]}>
            <Image style={styles.icon} source={item.icon} />
            <Text style={styles.rowTitle}>{item.name}</Text>
            <Switch
              style={styles.switch}
              value={item.selected}
              onValueChange={(value) => this.onSwitchValueChanged(index, value)}
              // Restrict the deletion of the last token
              disabled={selectedItems.length === 1 && item.selected}
            />
          </View>
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
        <Text style={styles.addCustomTokenText}>+ Add Custom Tokens</Text>
      </TouchableOpacity>
    );

    const rightButton = () => (
      <TouchableOpacity style={styles.rightButtonView} onPress={this.onAddCustomTokenPressed}>
        <ImageBackground source={references.images.cornerButton} style={styles.cornerButton}>
          <Text style={styles.cornerButtonText}>
            <Text style={styles.cornerButtonPlus}>+ </Text>
            Custom
          </Text>
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
        bgColor="#00B520"
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
    state: PropTypes.object.isRequired,
  }).isRequired,
  addToken: PropTypes.func.isRequired,
  deleteToken: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({}).isRequired,
  resetWalletsUpdated: PropTypes.func.isRequired,
  isWalletsUpdated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  deleteToken: (walletManager, wallet, token) => dispatch(walletActions.deleteToken(walletManager, wallet, token)),
  addToken: (walletManager, wallet, token) => dispatch(walletActions.addToken(walletManager, wallet, token)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddToken);

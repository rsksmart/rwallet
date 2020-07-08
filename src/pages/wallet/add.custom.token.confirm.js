import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Image, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';
import _ from 'lodash';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import BasePageGereral from '../base/base.page.general';
// import color from '../../assets/styles/color.ts';
import space from '../../assets/styles/space';
import color from '../../assets/styles/color.ts';
import references from '../../assets/references';
import parseHelper from '../../common/parse';
import walletActions from '../../redux/wallet/actions';
import appActions from '../../redux/app/actions';
import { createErrorNotification, getErrorNotification, getDefaultErrorNotification } from '../../common/notification.controller';
import common from '../../common/common';
import CancelablePromiseUtil from '../../common/cancelable.promise.util';

const styles = StyleSheet.create({
  sectionContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D8D8D8',
    paddingBottom: 20,
  },
  title: {
    color: color.black,
    fontFamily: 'Avenir-Roman',
    fontSize: 17,
    alignSelf: 'center',
  },
  tokenView: {
    marginTop: 10,
    marginHorizontal: 50,
  },
  row: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  rowTitle: {
    color: color.black,
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
    flex: 1,
  },
  tokenLogo: {
    width: 26,
    height: 26,
  },
  symbol: {
    color: '#042C5C',
    fontFamily: 'Avenir-Heavy',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  rowText: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
    letterSpacing: 1,
  },
});

class AddCustomToken extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.onComfirmPressed = this.onComfirmPressed.bind(this);
      const {
        navigation: {
          state: {
            params: {
              address, symbol, decimals, type, chain, wallet, name,
            },
          },
        },
      } = props;
      this.address = address;
      this.symbol = symbol;
      this.decimals = decimals;
      this.type = type;
      this.chain = chain;
      this.wallet = wallet;
      this.name = name;
      this.state = { isLoading: false, balance: null, isLoadingBalance: false };
    }

    componentDidMount() {
      this.requestBalance();
    }

    componentWillReceiveProps(nextProps) {
      const {
        navigation, addNotification, isWalletsUpdated, resetAddTokenResult, addTokenResult,
      } = nextProps;
      if (isWalletsUpdated) {
        resetAddTokenResult();
        const statckActions = StackActions.popToTop();
        navigation.dispatch(statckActions);
      }
      if (addTokenResult && addTokenResult.state === 'error') {
        const notification = createErrorNotification('modal.duplicateToken.title', 'modal.duplicateToken.body');
        addNotification(notification);
        resetAddTokenResult();
      }
    }

    componentWillUnmount() {
      const { removeNotification, isWalletsUpdated, resetWalletsUpdated } = this.props;
      removeNotification();
      CancelablePromiseUtil.cancel(this);
      if (isWalletsUpdated) {
        resetWalletsUpdated();
      }
    }

    async onComfirmPressed() {
      const {
        symbol, type, chain, address, wallet, decimals, name,
      } = this;
      const {
        addToken, walletManager, addNotification,
      } = this.props;
      try {
        this.setState({ isLoading: true });
        const saveResult = await parseHelper.saveToken(type, chain, address);
        console.log(saveResult);
        addToken(walletManager, wallet, {
          symbol, type, contractAddress: address, precision: decimals, chain, name,
        });
      } catch (error) {
        const notification = getErrorNotification(error.code) || getDefaultErrorNotification();
        addNotification(notification);
      } finally {
        this.setState({ isLoading: false });
      }
    }

    requestBalance = async () => {
      const {
        type, chain, wallet, address: contractAddress,
      } = this;
      try {
        this.setState({ isLoadingBalance: true });
        const derivation = _.find(wallet.derivations, { symbol: 'RBTC', type });
        const result = await CancelablePromiseUtil.makeCancelable(parseHelper.getUserTokenBalance(type, chain, contractAddress, derivation.address), this);
        console.log('UserTokenBalance: ', result);
        this.setState({ balance: common.weiToCoin(result.balance) });
      } catch (error) {
        console.log('getUserTokenBalance, error: ', error);
      } finally {
        this.setState({ isLoadingBalance: false });
      }
    }

    render() {
      const { navigation } = this.props;
      const { isLoading, balance, isLoadingBalance } = this.state;
      const { symbol, type, decimals } = this;
      const balanceText = balance ? common.getBalanceString(balance, symbol) : '-';

      const symbolName = common.getSymbolName(symbol, type);
      const icon = type === 'Mainnet' ? references.images.customToken : references.images.customToken_grey;

      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn
          hasLoader
          isLoading={isLoading}
          bottomBtnText="button.confirm"
          bottomBtnOnPress={this.onComfirmPressed}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.addCustomTokenConfirm.title" />}
        >
          <View>
            <Loc style={[styles.title, space.marginTop_30]} text="page.wallet.addCustomTokenConfirm.question" />
            <View style={styles.tokenView}>
              <View style={styles.row}>
                <Loc style={styles.rowTitle} text="page.wallet.addCustomTokenConfirm.token" />
                <Image style={[styles.tokenLogo, space.marginRight_10]} source={icon} />
                <Text style={styles.symbol}>{symbolName}</Text>
              </View>
              <View style={styles.row}>
                <Loc style={styles.rowTitle} text="page.wallet.addCustomTokenConfirm.decimals" />
                <Text style={styles.rowText}>{decimals}</Text>
              </View>
              <View style={styles.row}>
                <Loc style={styles.rowTitle} text="page.wallet.addCustomTokenConfirm.balance" />
                { isLoadingBalance && (<ActivityIndicator size="small" animating={isLoadingBalance} />)}
                { !isLoadingBalance && (<Text style={styles.rowText}>{`${balanceText} ${symbolName}`}</Text>)}
              </View>
            </View>
          </View>
        </BasePageGereral>
      );
    }
}

AddCustomToken.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  addToken: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({}).isRequired,
  addNotification: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  addTokenResult: PropTypes.shape({
    state: PropTypes.string,
  }),
  isWalletsUpdated: PropTypes.bool.isRequired,
  resetWalletsUpdated: PropTypes.func.isRequired,
  resetAddTokenResult: PropTypes.func.isRequired,
};

AddCustomToken.defaultProps = {
  addTokenResult: null,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  addTokenResult: state.Wallet.get('addTokenResult'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  addToken: (walletManager, wallet, token) => dispatch(walletActions.addToken(walletManager, wallet, token)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  removeNotification: () => dispatch(appActions.removeNotification()),
  resetAddTokenResult: () => dispatch(walletActions.resetAddTokenResult()),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomToken);

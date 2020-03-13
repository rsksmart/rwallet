import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import BasePageGereral from '../base/base.page.general';
// import color from '../../assets/styles/color.ts';
import space from '../../assets/styles/space';
import color from '../../assets/styles/color.ts';
import references from '../../assets/references';
import parseHelper from '../../common/parse';
import walletActions from '../../redux/wallet/actions';
import definitions from '../../common/definitions';
import appActions from '../../redux/app/actions';
import { createErrorNotification } from '../../common/notification.controller';

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
  balance: {
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
              address, symbol, decimals, type, chain, wallet,
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
      this.state = { isLoading: false };
    }

    componentWillUnmount() {
      const { removeNotification } = this.props;
      removeNotification();
    }

    async onComfirmPressed() {
      const {
        symbol, type, chain, address, wallet, decimals,
      } = this;
      const {
        navigation, addCustomToken, walletManager, addNotification,
      } = this.props;
      try {
        this.setState({ isLoading: true });
        const saveResult = await parseHelper.saveToken(type, chain, address);
        console.log(saveResult);
        addCustomToken(walletManager, wallet, {
          symbol, type, contractAddress: address, decimalPlaces: decimals,
        });
        const statckActions = StackActions.popToTop();
        navigation.dispatch(statckActions);
      } catch (error) {
        const notification = createErrorNotification(definitions.defaultErrorNotification.title, definitions.defaultErrorNotification.message);
        addNotification(notification);
      } finally {
        this.setState({ isLoading: false });
      }
    }

    render() {
      const { navigation } = this.props;
      const { isLoading } = this.state;
      const { symbol } = this;
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
                <Image style={[styles.tokenLogo, space.marginRight_10]} source={references.images.customToken} />
                <Text style={styles.symbol}>{symbol}</Text>
              </View>
              <View style={styles.row}>
                <Loc style={styles.rowTitle} text="page.wallet.addCustomTokenConfirm.balance" />
                <Text style={styles.balance}>{`1396.723 ${symbol}`}</Text>
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
  addCustomToken: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({}).isRequired,
  addNotification: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  addCustomToken: (walletManager, wallet, token) => dispatch(walletActions.addCustomToken(walletManager, wallet, token)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  removeNotification: () => dispatch(appActions.removeNotification()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomToken);

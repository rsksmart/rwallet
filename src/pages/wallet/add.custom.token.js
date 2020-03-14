import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput, Switch,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import presetStyle from '../../assets/styles/style';
import BasePageGereral from '../base/base.page.general';
import color from '../../assets/styles/color.ts';
import parseHelper from '../../common/parse';
import appActions from '../../redux/app/actions';
import { createErrorNotification } from '../../common/notification.controller';
import { createErrorConfirmation } from '../../common/confirmation.controller';
import Button from '../../components/common/button/button';
import CancelablePromiseUtil from '../../common/cancelable.promise.util';
import definitions from '../../common/definitions';

const styles = StyleSheet.create({
  sectionContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.seporatorLineGrey,
    paddingBottom: 20,
  },
  title: {
    color: color.black,
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
    letterSpacing: 0.4,
    marginBottom: 10,
    marginTop: 17,
  },
  body: {
    marginHorizontal: 25,
    marginTop: 13,
  },
  switchView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.seporatorLineGrey,
    paddingBottom: 15,
    paddingTop: 15,
  },
  switchTitle: {
    flex: 1,
    marginBottom: 0,
  },
});

class AddCustomToken extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        address: '',
        symbol: '',
        decimals: '',
        isMainnet: true,
        isCanConfirm: false,
      };
      this.name = '';
      this.type = 'Mainnet';
      this.chain = 'Rootstock';
    }

    componentWillUnmount() {
      this.setState({ isLoading: false });
      CancelablePromiseUtil.cancel(this);
    }

    onSwitchValueChanged = (value) => {
      this.setState({ isMainnet: value });
      this.type = value ? 'Mainnet' : 'Testnet';
      this.requestTokenInfo();
    }

    onAddressInputBlur = async () => {
      this.requestTokenInfo();
    }

    onAddressInputChanged = async (text) => {
      this.setState({ address: text });
    }

    onPressed = () => {
      const { navigation } = this.props;
      const { address, symbol, decimals } = this.state;
      const { name, type, chain } = this;
      navigation.navigate('AddCustomTokenConfirm', {
        address, symbol, decimals, name, type, chain, ...navigation.state.params,
      });
    }

    requestTokenInfo = async () => {
      const { addNotification, navigation, addConfirmation } = this.props;
      const { address } = this.state;
      const { type, chain } = this;
      if (_.isEmpty(address)) {
        return;
      }
      try {
        this.setState({ isLoading: true });
        const tokenInfo = await CancelablePromiseUtil.makeCancelable(parseHelper.getTokenBasicInfo(type, chain, address), this);
        console.log('tokenInfo: ', tokenInfo);
        const { name, symbol, decimals } = tokenInfo;
        this.setState({ symbol, decimals, isCanConfirm: true });
        this.name = name;
      } catch (error) {
        console.log('getTokenBasicInfo, erorr: ', error);
        this.setState({ isCanConfirm: false });
        if (error.message === 'err.erc20contractnotfound') {
          const notification = createErrorNotification('modal.contractNotFound.title', 'modal.contractNotFound.body');
          addNotification(notification);
        } else {
          const confirmation = createErrorConfirmation(
            definitions.defaultErrorNotification.title,
            definitions.defaultErrorNotification.message,
            'button.retry',
            this.requestTokenInfo,
            () => navigation.goBack(),
          );
          addConfirmation(confirmation);
        }
      } finally {
        this.setState({ isLoading: false });
      }
    }

    render() {
      const { navigation } = this.props;
      const {
        isLoading, address, symbol, decimals, isMainnet, isCanConfirm,
      } = this.state;
      const bottomButton = (<Button style={{ opacity: isCanConfirm ? 1 : 0.5 }} text="button.Next" onPress={this.onPressed} disabled={!isCanConfirm} />);
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn={false}
          hasLoader
          isLoading={isLoading}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.addCustomToken.title" />}
          customBottomButton={bottomButton}
        >
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title, styles.name]} text="page.wallet.addCustomToken.address" />
              <TextInput
                placeholder="0x345dc961828f9fe7c69da34e88d58839f153784c"
                ref={(ref) => { this.nameInput = ref; }}
                style={[presetStyle.textInput, styles.nameInput]}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                value={address}
                onChangeText={this.onAddressInputChanged}
                onBlur={this.onAddressInputBlur}
              />
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title, styles.name]} text="page.wallet.addCustomToken.symbol" />
              <TextInput
                placeholder="BKG"
                style={[presetStyle.textInput, styles.nameInput]}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                value={symbol}
              />
            </View>
            <View style={styles.sectionContainer}>
              <Loc style={[styles.title, styles.name]} text="page.wallet.addCustomToken.decimals" />
              <TextInput
                placeholder="18"
                style={[presetStyle.textInput, styles.nameInput]}
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                value={decimals.toString()}
              />
            </View>
            <View style={[styles.switchView]}>
              <Loc style={[styles.switchTitle]} text="page.wallet.addCustomToken.mainnet" />
              <Switch value={isMainnet} onValueChange={this.onSwitchValueChanged} />
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
  addNotification: PropTypes.func.isRequired,
  addConfirmation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  isWalletNameUpdated: state.Wallet.get('isWalletNameUpdated'),
  confirmation: state.App.get('confirmation'),
});

const mapDispatchToProps = (dispatch) => ({
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  removeConfirmation: () => dispatch(appActions.removeConfirmation()),
  removeNotification: () => dispatch(appActions.removeNotification()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomToken);

import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Rsk3 from '@rsksmart/rsk3';
import Header from '../../components/headers/header';
import Switch from '../../components/common/switch/switch';
import Loc from '../../components/common/misc/loc';
import presetStyle from '../../assets/styles/style';
import BasePageGereral from '../base/base.page.general';
import color from '../../assets/styles/color.ts';
import parseHelper from '../../common/parse';
import appActions from '../../redux/app/actions';
import { createErrorNotification, getErrorNotification, getDefaultErrorNotification } from '../../common/notification.controller';
import Button from '../../components/common/button/button';
import CancelablePromiseUtil from '../../common/cancelable.promise.util';
import common from '../../common/common';
import coinType from '../../common/wallet/cointype';

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
  addressInput: {
    height: 'auto',
    minHeight: 16,
    textAlignVertical: 'top',
    paddingBottom: 12,
    paddingTop: 12,
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
        isMainnet: true,
        isCanConfirm: false,
      };
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
    }

    onAddressInputChanged = async (text) => {
      const address = text.trim();
      this.setState({ address, isCanConfirm: !_.isEmpty(address) });
    }

    onPressed = async () => {
      const { navigation } = this.props;
      const { address } = this.state;
      const { type, chain } = this;

      const tokenInfo = await this.requestTokenInfo();
      if (tokenInfo === null) {
        return;
      }
      const { name, symbol, decimals } = tokenInfo;
      navigation.navigate('AddCustomTokenConfirm', {
        address, symbol, decimals, name, type, chain, ...navigation.state.params,
      });
    }

    requestTokenInfo = async () => {
      const { addNotification } = this.props;
      const { address } = this.state;
      const { type, chain } = this;
      try {
        const contractAddress = Rsk3.utils.toChecksumAddress(address, coinType.RBTC.networkId);
        const isWalletAddress = common.isWalletAddress(contractAddress, 'RBTC', type, coinType.RBTC.networkId);
        if (!isWalletAddress) {
          throw new Error();
        }
      } catch (error) {
        const notification = createErrorNotification(
          'modal.invalidAddress.title',
          'modal.invalidAddress.body',
        );
        addNotification(notification);
        return null;
      }
      try {
        this.setState({ isLoading: true });
        const tokenInfo = await CancelablePromiseUtil.makeCancelable(parseHelper.getTokenBasicInfo(type, chain, address), this);
        console.log('tokenInfo: ', tokenInfo);
        return tokenInfo;
      } catch (error) {
        console.log('getTokenBasicInfo, error: ', error);
        const notification = getErrorNotification(error.code, 'button.retry') || getDefaultErrorNotification();
        addNotification(notification);
        return null;
      } finally {
        this.setState({ isLoading: false });
      }
    }

    render() {
      const { navigation } = this.props;
      const {
        isLoading, address, isMainnet, isCanConfirm,
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
                style={[presetStyle.textInput, styles.addressInput]}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                blurOnSubmit={false}
                value={address}
                onChangeText={this.onAddressInputChanged}
              />
            </View>
            <View style={[styles.switchView]}>
              <Loc style={[styles.switchTitle]} text="page.wallet.addCustomToken.mainnet" />
              <Switch
                value={isMainnet}
                onValueChange={this.onSwitchValueChanged}
              />
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
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
  isWalletNameUpdated: state.Wallet.get('isWalletNameUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  removeNotification: () => dispatch(appActions.removeNotification()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomToken);

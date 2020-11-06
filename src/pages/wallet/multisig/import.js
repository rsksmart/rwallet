import _ from 'lodash';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StackActions } from 'react-navigation';
import Header from '../../../components/headers/header';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import { createErrorNotification, getErrorNotification, getDefaultErrorNotification } from '../../../common/notification.controller';
import color from '../../../assets/styles/color';
import BasePageGereral from '../../base/base.page.general';
import Button from '../../../components/common/button/button';
import { BtcAddressType } from '../../../common/constants';
import SwitchRow from '../../../components/common/switch/switch.row';
import { strings } from '../../../common/i18n';
import space from '../../../assets/styles/space';
import MnemonicInput from '../../../components/common/mnemonic.input';

const bip39 = require('bip39');

const styles = StyleSheet.create({
  bottomBorder: {
    borderBottomColor: color.silver,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  phraseSection: {
    marginTop: 17,
    paddingBottom: 17,
    marginBottom: 10,
  },
});

class ImportMultisigAddress extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        mnemonic: '',
        isCanSubmit: false,
        isLoading: false,
        isMainnet: false,
      };
    }

    componentWillReceiveProps(nextProps) {
      const { navigation, isWalletsUpdated, sharedWalletCreationError } = nextProps;
      const { addNotification, resetSharedWalletCreationError, sharedWalletCreationError: lastSharedWalletCreationError } = this.props;
      const { isLoading } = this.state;

      if (isWalletsUpdated && isLoading) {
        this.setState({ isLoading: false });
        const stackActions = StackActions.popToTop();
        navigation.dispatch(stackActions);
        return;
      }

      if (!lastSharedWalletCreationError && sharedWalletCreationError) {
        this.setState({ isLoading: false });
        const notification = getErrorNotification(sharedWalletCreationError.code, 'button.retry') || getDefaultErrorNotification('button.retry');
        addNotification(notification);
        resetSharedWalletCreationError();
      }
    }

    onImportPress = () => {
      const { addNotification, walletManager, importSharedWallet } = this.props;
      const { mnemonic, isMainnet } = this.state;
      // validate phrase
      const isValid = bip39.validateMnemonic(mnemonic);
      console.log(`isValid: ${isValid}`);
      if (!isValid) {
        const notification = createErrorNotification(
          'modal.unableRecover.title',
          'modal.unableRecover.body',
        );
        addNotification(notification);
        return;
      }
      // If phrases is already in the app, notify user
      const { wallets } = walletManager;
      const wallet = _.find(wallets, { mnemonic });
      if (wallet) {
        const notification = createErrorNotification(
          'modal.duplicatePhrase.title',
          'modal.duplicatePhrase.body',
          'button.gotIt',
          () => {
            this.mnemonicInput.reset();
            this.setState({ isCanSubmit: false });
          },
        );
        addNotification(notification);
        return;
      }

      this.setState({ isLoading: true }, () => {
        setTimeout(() => {
          const multisigParams = {
            type: isMainnet ? 'Mainnet' : 'Testnet',
            addressType: BtcAddressType.legacy,
          };
          importSharedWallet(mnemonic, multisigParams);
        }, 0);
      });
    }

    onSwitchValueChanged = (value) => {
      this.setState({ isMainnet: value });
    }

    onMnemonicInputted = (mnemonic) => this.setState({ isCanSubmit: true, mnemonic })

    onWordsDeleted = () => this.setState({ isCanSubmit: false })

    render() {
      const { navigation } = this.props;
      const { isCanSubmit, isLoading, isMainnet } = this.state;

      const bottomButton = (<Button text="button.IMPORT" onPress={this.onImportPress} disabled={!isCanSubmit} />);
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn={false}
          hasLoader
          isLoading={isLoading}
          headerComponent={<View />}
          customBottomButton={bottomButton}
        >
          <Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.recovery.title" />
          <View style={styles.body}>
            <MnemonicInput
              style={[styles.phraseSection, styles.bottomBorder]}
              ref={(ref) => { this.mnemonicInput = ref; }}
              onMnemonicInputted={this.onMnemonicInputted}
              onWordsDeleted={this.onWordsDeleted}
            />
            <View style={[styles.fieldView, space.marginTop_10]}>
              <SwitchRow
                text={strings('page.wallet.addCustomToken.mainnet')}
                value={isMainnet}
                onValueChange={this.onSwitchValueChanged}
              />
            </View>
          </View>
        </BasePageGereral>
      );
    }
}

ImportMultisigAddress.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }),
  importSharedWallet: PropTypes.func.isRequired,
  resetSharedWalletCreationError: PropTypes.func.isRequired,
  isWalletsUpdated: PropTypes.bool.isRequired,
  sharedWalletCreationError: PropTypes.shape({
    code: PropTypes.number,
  }),
};

ImportMultisigAddress.defaultProps = {
  walletManager: undefined,
  sharedWalletCreationError: undefined,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
  sharedWalletCreationError: state.Wallet.get('sharedWalletCreationError'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  importSharedWallet: (phrase, multisigParams) => dispatch(walletActions.importSharedWallet(phrase, multisigParams)),
  resetSharedWalletCreationError: () => dispatch(walletActions.setSharedWalletCreationError(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportMultisigAddress);

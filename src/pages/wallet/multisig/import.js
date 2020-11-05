import _ from 'lodash';
import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StackActions } from 'react-navigation';
import Tags from '../../../components/common/misc/tags';
import Header from '../../../components/headers/header';
import Loc from '../../../components/common/misc/loc';
import appActions from '../../../redux/app/actions';
import walletActions from '../../../redux/wallet/actions';
import { createErrorNotification, getErrorNotification, getDefaultErrorNotification } from '../../../common/notification.controller';
import color from '../../../assets/styles/color';
import fontFamily from '../../../assets/styles/font.family';
import presetStyles from '../../../assets/styles/style';
import BasePageGereral from '../../base/base.page.general';
import Button from '../../../components/common/button/button';
import { BtcAddressType } from '../../../common/constants';
import SwitchRow from '../../../components/common/switch/switch.row';
import { strings } from '../../../common/i18n';
import space from '../../../assets/styles/space';

const bip39 = require('bip39');

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontFamily: fontFamily.AvenirHeavy,
    fontSize: 14,
    color: color.black,
    marginBottom: 10,
  },
  walletName: {
    fontSize: 20,
  },
  sectionContainer: {
    marginTop: 10,
    paddingBottom: 10,
  },
  buttonView: {
    backgroundColor: color.white,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomBorder: {
    borderBottomColor: color.silver,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  phrasesBorder: {
    minHeight: 120,
    paddingBottom: 10,
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: 350,
    marginTop: -150,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 200,
    left: 24,
    color: color.white,
  },
  phraseView: {
    borderBottomColor: color.silver,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: color.component.input.backgroundColor,
    borderColor: color.component.input.borderColor,
    borderRadius: 4,
    borderStyle: 'solid',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathInputView: {
    borderColor: color.component.input.borderColor,
    backgroundColor: color.component.input.backgroundColor,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    marginHorizontal: 5,
    height: 30,
    justifyContent: 'center',
  },
  pathInput: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 0,
    paddingHorizontal: 3,
    minWidth: 27,
  },
  switchLabel: {
    fontFamily: fontFamily.AvenirBook,
  },
  selectionModalTitle: {
    fontSize: 16,
    fontFamily: fontFamily.AvenirHeavy,
    color: color.black,
    marginVertical: 10,
  },
  phraseSection: {
    marginTop: 17,
    paddingBottom: 17,
    marginBottom: 10,
  },
  phraseTitle: {
    marginBottom: 14,
    fontFamily: fontFamily.AvenirRoman,
    fontSize: 16,
  },
  fieldLabel: {
    fontFamily: fontFamily.AvenirRoman,
    fontSize: 16,
    marginBottom: 5,
  },
  fieldText: {
    fontFamily: fontFamily.AvenirBook,
    fontSize: 15,
  },
});

class ImportMultisigAddress extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        phrases: [],
        phrase: '',
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

    onSubmitEditing = () => {
      const { phrase } = this.state;
      const trimText = phrase.trim();
      this.inputText(trimText);
    }

    onChangeText = (text) => {
      const char = text[text.length - 1];
      if (char !== ' ') {
        this.setState({ phrase: text });
        return;
      }
      const trimText = text.trim();
      this.inputText(trimText);
    }

    onTagsPress = (index) => {
      this.deleteWord(index);
      this.setState({ isCanSubmit: false });
      this.phraseInput.focus();
    }

    onImportPress = () => {
      const { addNotification, walletManager, importSharedWallet } = this.props;
      const { phrases, isMainnet } = this.state;
      let inputPhrases = '';
      for (let i = 0; i < phrases.length; i += 1) {
        if (i !== 0) {
          inputPhrases += ' ';
        }
        inputPhrases += phrases[i];
      }
      // validate phrase
      const isValid = bip39.validateMnemonic(inputPhrases);
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
      const wallet = _.find(wallets, { mnemonic: inputPhrases });
      if (wallet) {
        const notification = createErrorNotification(
          'modal.duplicatePhrase.title',
          'modal.duplicatePhrase.body',
          'button.gotIt',
          () => { this.setState({ phrases: [], isCanSubmit: false }); },
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
          importSharedWallet(inputPhrases, multisigParams);
        }, 0);
      });
    }

    inputText = (text) => {
      const words = text.split(' ');
      words.forEach((word) => {
        const trimWord = word.trim();
        this.inputWord(trimWord);
      });
    }

    inputWord = (word) => {
      const { addNotification } = this.props;
      const { phrases } = this.state;
      if (word === '') {
        this.setState({ phrase: '' });
        return;
      }
      if (phrases.length === 12) {
        const notification = createErrorNotification(
          'modal.tooManyPhrase.title',
          'modal.tooManyPhrase.body',
        );
        addNotification(notification);
        return;
      }
      if (phrases.length === 11) {
        this.setState({ isCanSubmit: true });
      }
      phrases.push(word);
      this.setState({ phrases, phrase: '' });
      this.phraseInput.focus();
    }

    deleteWord = (index) => {
      const { phrases } = this.state;
      phrases.splice(index, 1);
      this.setState({ phrases });
    }

    onSwitchValueChanged = (value) => {
      this.setState({ isMainnet: value });
    }

    render() {
      const { navigation } = this.props;
      const {
        phrase, phrases, isCanSubmit, isLoading, isMainnet,
      } = this.state;

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
            <View style={[styles.phraseSection, styles.bottomBorder]}>
              <Loc style={styles.phraseTitle} text="page.wallet.recovery.note" />
              <View style={styles.phraseView}>
                <TextInput
                  autoFocus // If true, focuses the input on componentDidMount. The default value is false.
                                          // This code uses a ref to store a reference to a DOM node
                                          // https://reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-dom-element
                  ref={(ref) => {
                    this.phraseInput = ref;
                  }}
                                          // set blurOnSubmit to false, to prevent keyboard flickering.
                  blurOnSubmit={false}
                  style={[presetStyles.textInput, styles.input]}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitEditing}
                  value={phrase}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={[styles.phrasesBorder, { flexDirection: 'row' }]}>
                  <Tags
                    style={[{ flex: 1 }]}
                    data={phrases}
                    onPress={this.onTagsPress}
                  />
                </View>
              </View>
            </View>
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

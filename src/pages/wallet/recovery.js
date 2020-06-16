import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput, Text, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Tags from '../../components/common/misc/tags';
import Header from '../../components/headers/header';
import Switch from '../../components/common/switch/switch';
import Loc from '../../components/common/misc/loc';
import SelectionModal from '../../components/common/modal/selection.modal';
import appActions from '../../redux/app/actions';
import { createErrorNotification } from '../../common/notification.controller';
import color from '../../assets/styles/color.ts';
import presetStyles from '../../assets/styles/style';
import flex from '../../assets/styles/layout.flex';
import BasePageGereral from '../base/base.page.general';
import Button from '../../components/common/button/button';
import { strings } from '../../common/i18n';
import coinType from '../../common/wallet/cointype';

const bip39 = require('bip39');

const MAX_ACCOUNT = 4294967295;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 14,
    color: '#000',
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
    backgroundColor: '#FFFFFF',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomBorder: {
    borderBottomColor: '#bbb',
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
    color: '#FFF',
  },
  phraseView: {
    borderBottomColor: '#bbb',
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
    fontFamily: 'Avenir-Book',
  },
  selectionModalTitle: {
    fontSize: 16,
    fontFamily: 'Avenir-Heavy',
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
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
  },
  fieldLabel: {
    fontFamily: 'Avenir-Roman',
    fontSize: 16,
    marginBottom: 5,
  },
  fieldText: {
    fontFamily: 'Avenir-Book',
    fontSize: 15,
  },
});

class WalletRecovery extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);

      this.inputWord = this.inputWord.bind(this);
      this.deleteWord = this.deleteWord.bind(this);
      this.onSubmitEditing = this.onSubmitEditing.bind(this);
      this.onChangeText = this.onChangeText.bind(this);
      this.onTagsPress = this.onTagsPress.bind(this);
      this.onImportPress = this.onImportPress.bind(this);
      this.tokens = [
        { symbol: 'BTC', prefix: "m/44'/0'/", name: coinType.BTC.defaultName },
        { symbol: 'RBTC', prefix: "m/44'/137'/", name: coinType.RBTC.defaultName },
      ];
      this.state = {
        phrases: [],
        phrase: '',
        isCanSubmit: false,
        isDerivationPathEnabled: false,
        // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
        // m / purpose' / coin_type' / account' / change / address_index
        accounts: [undefined, undefined],
        selectedTokenIndex: 0,
      };
      this.coins = _.map(this.tokens, (token) => `${token.name} (${token.symbol})`);
    }

    onSubmitEditing() {
      const { phrase } = this.state;
      const trimText = phrase.trim();
      this.inputText(trimText);
    }

    onChangeText(text) {
      const char = text[text.length - 1];
      if (char !== ' ') {
        this.setState({ phrase: text });
        return;
      }
      const trimText = text.trim();
      this.inputText(trimText);
    }

    onTagsPress(i) {
      this.deleteWord(i);
      this.setState({ isCanSubmit: false });
      this.phraseInput.focus();
    }

    onImportPress() {
      const { navigation, addNotification, walletManager } = this.props;
      const { phrases, accounts, isDerivationPathEnabled } = this.state;
      const { tokens } = this;
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

      const params = { phrases: inputPhrases };
      if (isDerivationPathEnabled) {
        const derivationPaths = {};
        _.each(tokens, (token, index) => {
          const account = accounts[index];
          // account <= 0, It isn't need to pass specifing derivationPath for creating wallet.
          // It use account 0 to create wallet by default.
          if (_.isNil(account) || account <= 0) {
            return;
          }
          const { symbol } = token;
          derivationPaths[symbol] = `${token.prefix + accounts[index]}'/0/0`;
        });
        params.derivationPaths = derivationPaths;
      }

      navigation.navigate('WalletSelectCurrency', params);
    }

    onSelectedTokenIndexSelected = (index) => {
      this.setState({ selectedTokenIndex: index });
    }

    onTokenPressed = () => {
      const { selectedTokenIndex } = this.state;
      this.selectionModal.show(selectedTokenIndex);
    }

    onAccountIndexChanged = (value) => {
      const { selectedTokenIndex, accounts } = this.state;

      if (value === '') {
        accounts[selectedTokenIndex] = null;
        this.setState({ accounts });
      }

      let account = parseInt(value, 10);
      // account < 0, textinput will not be changed, else present number in textinput.
      if (_.isNaN(account) || account < 0) {
        return;
      }
      account = Math.min(account, MAX_ACCOUNT);
      accounts[selectedTokenIndex] = account;
      this.setState({ accounts });
    }

    inputText(text) {
      const words = text.split(' ');
      words.forEach((word) => {
        const trimWord = word.trim();
        this.inputWord(trimWord);
      });
    }

    inputWord(word) {
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

    deleteWord(i) {
      const { phrases } = this.state;
      phrases.splice(i, 1);
      this.setState({ phrases });
    }

    render() {
      const { navigation } = this.props;
      const {
        phrase, phrases, isCanSubmit, isDerivationPathEnabled, selectedTokenIndex, accounts,
      } = this.state;
      const { tokens, coins } = this;

      const { prefix } = tokens[selectedTokenIndex];
      const selectedCoin = coins[selectedTokenIndex];
      const accountIndexText = !_.isNil(accounts[selectedTokenIndex]) ? accounts[selectedTokenIndex].toString() : '';

      const bottomButton = (<Button text="button.IMPORT" onPress={this.onImportPress} disabled={!isCanSubmit} />);
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn={false}
          hasLoader={false}
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
            <View style={[styles.sectionContainer, styles.bottomBorder]}>
              <Loc style={[styles.sectionTitle]} text="page.wallet.recovery.advancedOptions" />
              <View style={styles.row}>
                <Loc style={[flex.flex1, styles.switchLabel]} text="page.wallet.recovery.specifyPath" />
                <Switch
                  value={isDerivationPathEnabled}
                  onValueChange={(value) => { this.setState({ isDerivationPathEnabled: value }); }}
                />
              </View>
            </View>
            { isDerivationPathEnabled && (
              <View>
                <View style={[styles.sectionContainer, styles.bottomBorder]}>
                  <Text style={styles.fieldLabel}>{strings('page.wallet.recovery.coin')}</Text>
                  <TouchableOpacity onPress={this.onTokenPressed}>
                    <View style={styles.row}>
                      <Text style={[flex.flex1, styles.fieldText]}>{selectedCoin}</Text>
                      <EvilIcons name="chevron-down" color="#9B9B9B" size={30} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.sectionContainer, styles.bottomBorder]}>
                  <Text style={styles.fieldLabel}>{strings('page.wallet.recovery.derivationPath')}</Text>
                  <View style={[styles.row]}>
                    <Text style={styles.fieldText}>{prefix}</Text>
                    <View style={styles.pathInputView}>
                      <TextInput
                        style={styles.pathInput}
                        value={accountIndexText}
                        onChangeText={this.onAccountIndexChanged}
                        multiline={false}
                        placeholder="0"
                        placeholderTextColor="#555"
                      />
                    </View>
                    <Text>{'\''}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
          <SelectionModal
            ref={(ref) => { this.selectionModal = ref; }}
            items={coins}
            onConfirm={this.onSelectedTokenIndexSelected}
            title={strings('page.wallet.recovery.selectCoin')}
          />
        </BasePageGereral>
      );
    }
}

WalletRecovery.propTypes = {
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
};

WalletRecovery.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
  walletManager: state.Wallet.get('walletManager'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletRecovery);

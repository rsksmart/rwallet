import _ from 'lodash';
import React, { Component } from 'react';
import {
  View, StyleSheet, TextInput, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SwitchListItem from '../../components/common/list/switchListItem';
import Tags from '../../components/common/misc/tags';
import Header from '../../components/headers/header';
import Loc from '../../components/common/misc/loc';
import appActions from '../../redux/app/actions';
import { strings } from '../../common/i18n';
import { createErrorNotification } from '../../common/notification.controller';
import color from '../../assets/styles/color.ts';
import presetStyles from '../../assets/styles/style';
import BasePageGereral from '../base/base.page.general';
import Button from '../../components/common/button/button';
import { screen } from '../../common/info';

const bip39 = require('bip39');

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
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
  wapper: {
    height: screen.height - 25,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
});

class WalletRecovery extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      this.state = {
        phrases: [],
        phrase: '',
        isCanSubmit: false,
      };
      this.inputWord = this.inputWord.bind(this);
      this.deleteWord = this.deleteWord.bind(this);
      this.onSubmitEditing = this.onSubmitEditing.bind(this);
      this.onChangeText = this.onChangeText.bind(this);
      this.onTagsPress = this.onTagsPress.bind(this);
      this.onImportPress = this.onImportPress.bind(this);
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
      const { phrases } = this.state;
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
          'Unable to recover',
          'Unable to recover Body',
          'button.gotIt',
        );
        addNotification(notification);
        return;
      }
      // If phrases is already in the app, notify user
      const { wallets } = walletManager;
      const wallet = _.find(wallets, { mnemonic: inputPhrases });
      if (wallet) {
        const notification = createErrorNotification(
          'Duplicate Phrase',
          'This phrase is already imported in the app. Please try with a different phrase.',
          'button.gotIt',
        );
        addNotification(notification);
        return;
      }
      navigation.navigate('WalletSelectCurrency', { phrases: inputPhrases });
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
          'Too Many Words',
          'The recovery phrase has to be 12 words',
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
      const { phrase, phrases, isCanSubmit } = this.state;
      const { navigation } = this.props;
      return (
        <BasePageGereral
          isSafeView
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={<View />}
        >
          <View style={styles.wapper}>
            <ScrollView>
              <Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.recovery.title" />
              <View style={styles.body}>
                <Loc style={[styles.sectionTitle]} text="page.wallet.recovery.note" />
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
                <View style={[styles.sectionContainer, styles.bottomBorder]}>
                  <Loc style={[styles.sectionTitle]} text="page.wallet.recovery.advancedOptions" />
                  <SwitchListItem title={strings('page.wallet.recovery.specifyPath')} value={false} />
                </View>
              </View>
            </ScrollView>
            <View style={[styles.buttonView]}>
              <Button text="IMPORT" onPress={this.onImportPress} disabled={!isCanSubmit} />
            </View>
          </View>
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

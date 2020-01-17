import React, { Component } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../../components/common/button/button';
import SwitchListItem from '../../components/common/list/switchListItem';
import Tags from '../../components/common/misc/tags';
import Header from '../../components/common/misc/header';
import Loc from '../../components/common/misc/loc';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';
import { strings } from '../../common/i18n';
import { createErrorNotification } from '../../common/notification.controller';
import color from '../../assets/styles/color.ts';
import presetStyles from '../../assets/styles/style';
import flex from '../../assets/styles/layout.flex';
import { screen } from '../../common/info';
import SafeAreaView from '../../components/common/misc/safe.area.view';

const Mnemonic = require('bitcore-mnemonic');

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
    alignSelf: 'center',
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
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
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
      const { navigation, addNotification } = this.props;
      const { phrases } = this.state;
      let inputPhrases = '';
      for (let i = 0; i < phrases.length; i += 1) {
        if (i !== 0) {
          inputPhrases += ' ';
        }
        inputPhrases += phrases[i];
      }
      // validate phrase
      const isValid = Mnemonic.isValid(inputPhrases);
      console.log(`isValid: ${isValid}`);
      if (!isValid) {
        const notification = createErrorNotification(
          'Unable to recover',
          'Unable to recover Body',
          'GOT IT',
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
        <SafeAreaView>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.wapper}>
              <View style={[flex.flex10]}>
                <Header
                  title="Recovery Phrase"
                  goBack={() => {
                    navigation.goBack();
                  }}
                />
                <View style={[screenHelper.styles.body, flex.flex1, { paddingHorizontal: 20, marginTop: screenHelper.bodyMarginTop + 10 }]}>
                  <Loc style={[styles.sectionTitle]} text="Type the recovery phrase(usually 12 words)" />
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
                    <Loc style={[styles.sectionTitle]} text="Advanced Options" />
                    <SwitchListItem title={strings('Specify derivation path')} value={false} />
                  </View>
                </View>
              </View>
              <View style={[flex.flex1, styles.sectionContainer, styles.button]}>
                <Button
                  text="IMPORT"
                  onPress={this.onImportPress}
                  disabled={!isCanSubmit}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
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
};

const mapStateToProps = (state) => ({
  language: state.App.get('language'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletRecovery);

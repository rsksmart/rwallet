import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Input from '../../components/common/input/input';
import Button from '../../components/common/button/button';
import SwitchListItem from '../../components/common/list/switchListItem';
import Tags from '../../components/common/misc/tags';
import Header from '../../components/common/misc/header';
import Loc from '../../components/common/misc/loc';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';
import { strings } from '../../common/i18n';
import { createInfoNotification } from '../../common/notification.controller';
import color from '../../assets/styles/color.ts';

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
    marginHorizontal: 30,
    paddingBottom: 10,
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  bottomBorder: {
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  phrasesBorder: {
    height: 170,
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
    flex: 1,
    borderBottomColor: '#bbb',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: color.component.input.backgroundColor,
    borderColor: color.component.input.borderColor,
    borderRadius: 4,
    borderStyle: 'solid',
  },
});

class WalletRecovery extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      // const phrases = 'camp lazy topic stomach oyster behind know music melt raccoon during spirit'.split(' ');
      this.state = {
        phrases: [],
        phrase: '',
      };
      this.inputWord = this.inputWord.bind(this);
      this.deleteWord = this.deleteWord.bind(this);
    }

    inputWord() {
      const { phrase, phrases } = this.state;
      phrases.push(phrase);
      this.setState({ phrases });
      this.setState({ phrase: '' });
    }

    deleteWord(i) {
      const { phrases } = this.state;
      phrases.splice(i, 1);
      this.setState({ phrases });
    }

    render() {
      const { phrase, phrases } = this.state;
      const { navigation, addNotification } = this.props;
      return (
        <View style={{ flex: 1 }}>
          <ScrollView>
            <Header
              title="Recovery Phrase"
              goBack={() => {
                navigation.goBack();
              }}
            />
            <View style={[screenHelper.styles.body]}>
              <View style={[{ marginTop: 20, marginHorizontal: 30 }]}>
                <Loc style={[styles.sectionTitle]} text="Type the recovery phrase(usually 12 words)" />
                <View style={styles.phraseView}>
                  <Input
                    style={[styles.input]}
                    onChangeText={(text) => this.setState({ phrase: text })}
                    onSubmitEditing={() => {
                      this.inputWord();
                      this.setState({ phrase: '' });
                    }}
                    value={phrase}
                  />
                  <View style={[styles.phrasesBorder, { flexDirection: 'row' }]}>
                    <Tags
                      style={{ flex: 1 }}
                      data={phrases}
                      onPress={(i) => {
                        this.deleteWord(i);
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.sectionContainer, styles.bottomBorder]}>
                <Text style={[styles.sectionTitle]}>Advanced Options</Text>
                <SwitchListItem title={strings('Specify derivation path')} value={false} />
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttonView}>
            <Button
              text="IMPORT"
              onPress={async () => {
                if (phrases.length !== 12) {
                  const notification = createInfoNotification(
                    'Recovery Phrase',
                    'The recovery phrase is usually 12 words',
                  );
                  addNotification(notification);
                  return;
                }
                let inputPhrases = '';
                for (let i = 0; i < phrases.length; i += 1) {
                  if (i !== 0) {
                    inputPhrases += ' ';
                  }
                  inputPhrases += phrases[i];
                }
                navigation.navigate('WalletSelectCurrency', { phrases: inputPhrases });
              }}
            />
          </View>
        </View>
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

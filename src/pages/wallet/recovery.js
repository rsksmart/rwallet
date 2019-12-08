import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import Input from '../../components/common/input/input';
import Button from '../../components/common/button/button';
import SwitchListItem from '../../components/common/list/switchListItem';
import Tags from '../../components/common/misc/tags';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';

const styles = StyleSheet.create({
  input: {
    height: 50,
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
    marginHorizontal: 10,
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
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
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
});

export default class WalletRecovery extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);
      const phrases = 'multiply merit imitate embrace grass mountain badge stadium pluck rough hospital label'.split(' ');
      this.state = {
        phrases,
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
      const { navigation } = this.props;
      return (
        <View>
          <ScrollView>
            <Header
              title="Recovery Phrase"
              goBack={() => {
                navigation.goBack();
              }}
            />
            <View style={[screenHelper.styles.body]}>
              <View style={[styles.sectionContainer, { paddingBottom: 20, marginTop: 20 }]}>
                <Text style={[styles.sectionTitle]}>Type the recovery phrase(usually 12 words)</Text>
                <Input
                  style={[styles.input]}
                  onChangeText={(text) => this.setState({ phrase: text })}
                  onSubmitEditing={() => {
                    this.inputWord();
                  }}
                  value={phrase}
                />
              </View>
              <View style={[styles.sectionContainer, styles.phrasesBorder]}>
                <Tags
                  data={phrases}
                  onPress={(i) => {
                    this.deleteWord(i);
                  }}
                />
              </View>
              <View style={[styles.sectionContainer, styles.bottomBorder]}>
                <Text style={[styles.sectionTitle]}>Advanced Options</Text>
                <SwitchListItem title="Single address" value={false} />
              </View>
              <View style={[styles.sectionContainer]}>
                <Text style={[styles.sectionTitle]}>Wallet Service URL</Text>
                <Text>https://bws.bitpay.com/bws/api</Text>
              </View>
              <View style={styles.buttonView}>
                <Button
                  text="CREATE"
                  onPress={async () => {
                    let phrases2 = '';
                    for (let i = 0; i < phrases.length; i += 1) {
                      if (i !== 0) {
                        phrases2 += ' ';
                      }
                      phrases2 += phrases[i];
                    }
                    navigation.navigate('WalletSelectCurrency', { phrases: phrases2 });
                  }}
                />
              </View>
            </View>
          </ScrollView>
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
};

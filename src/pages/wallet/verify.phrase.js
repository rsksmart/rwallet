import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Tags from '../../components/common/misc/tags';
import Header from '../../components/common/misc/header';
import WordField from '../../components/common/misc/wordField';
import Alert from '../../components/common/modal/alert';
import walletManager from '../../common/wallet/walletManager';

const styles = StyleSheet.create({
  wordFieldView: {
    height: 150,
    marginTop: 15,
  },
  tags: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 20,
    alignSelf: 'center',
  },
  tip: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.29,
    alignSelf: 'center',
  },
});

export default class VerifyPhrase extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.wallet = navigation.state.params.wallet;
    this.correctPhrases = this.wallet.mnemonic.phrase.split(' ');
    const shuffle = (org) => {
      const input = [];
      Object.assign(input, org);
      for (let i = input.length - 1; i >= 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
      }
      return input;
    };
    this.randomPhrases = shuffle(this.correctPhrases);
    this.randomPhrases2 = [];
    Object.assign(this.randomPhrases2, this.randomPhrases);

    this.state = {
      tags: this.randomPhrases,
      phrases: [],
    };
    this.renderAllItem = this.renderAllItem.bind(this);
    this.tap = this.tap.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    Object.assign(this.randomPhrases, this.randomPhrases2);
    this.setState({
      tags: this.randomPhrases,
      phrases: [],
    });
  }

  async tap(i) {
    const { navigation } = this.props;
    const { tags, phrases } = this.state;
    const s = tags.splice(i, 1);
    this.setState({ tags });
    phrases.push(s[0]);
    this.setState({ phrases });
    if (phrases.length === 12) {
      let same = true;
      for (let k = 0; k < phrases.length; k += 1) {
        const phrase = phrases[k];
        const c = this.correctPhrases[k];
        if (c !== phrase) {
          same = false;
          break;
        }
      }
      if (same) {
        await walletManager.addWallet(this.wallet);
        const resetAction = StackActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'Test1' }),
            NavigationActions.navigate({ routeName: 'VerifyPhraseSuccess' }),
          ],
        });
        navigation.dispatch(resetAction);
      } else {
        this.alert.setModalVisible(true);
      }
    }
  }

  renderAllItem() {
    const startX = -82;
    const words = [];
    const margin = 200;
    let offset = 0;
    const { phrases } = this.state;
    if (phrases.length > 1) {
      offset = -margin * (phrases.length - 1);
    }
    for (let i = 0; i < 12; i += 1) {
      const marginLeft = startX + i * margin + offset;
      const style = {
        position: 'absolute', left: '50%', top: 10, marginLeft,
      };
      let text = '';
      if (i < phrases.length) {
        text = phrases[i];
      }
      words.push(
        <View style={style} key={`${Math.random()}`}>
          <WordField text={text} />
        </View>,
      );
    }
    return words;
  }

  render() {
    const alertTitle = "It's important that you write your recovery phrase down corretly. If something happens to your wallet, you'll need it to recover your money. Please review and try again.";
    const { navigation } = this.props;
    const { phrases, tags } = this.state;
    return (
      <View>
        <Header
          title="Verify Your Phrase"
          goBack={() => {
            if (phrases.length === 0) {
              navigation.goBack();
            } else {
              this.reset();
            }
          }}
        />
        <View style={styles.wordFieldView}>{this.renderAllItem()}</View>
        <Text style={styles.tip}>Tap each word in the correct order</Text>
        <Tags
          data={tags}
          style={[styles.tags]}
          showNumber={false}
          onPress={(i) => {
            this.tap(i);
          }}
        />
        <Alert
          ref={(ref) => {
            this.alert = ref;
          }}
          title={alertTitle}
          onPress={() => {
            this.reset();
          }}
        />
      </View>
    );
  }
}
VerifyPhrase.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

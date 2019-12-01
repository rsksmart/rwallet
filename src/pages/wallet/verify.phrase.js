import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  View, StyleSheet,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Tags from '../../components/common/misc/tags';
import WordField from '../../components/common/misc/wordField';
// import walletManager from '../../common/wallet/walletManager';
import Loader from '../../components/common/misc/loader';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/common/misc/header';
import screenHelper from '../../common/screenHelper';
import appActions from '../../redux/app/actions';
import { createErrorNotification } from '../../common/notification.controller';

const verifyPhraseAlertTitle = 'Please review recovery phrase and try again.';

// import appActions from '../../redux/app/actions';

const MNEMONIC_PHRASE_LENGTH = 12;

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

class VerifyPhrase extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.wallet = navigation.state.params.wallet;
    this.correctPhrases = this.wallet.mnemonic.toString().split(' ');

    this.state = {
      tags: _.shuffle(this.correctPhrases),
      phrases: [],
    };

    this.renderAllItem = this.renderAllItem.bind(this);
    this.onTagsPressed = this.onTagsPressed.bind(this);
    this.reset = this.reset.bind(this);
  }

  async onTagsPressed(index) {
    const { navigation, addNotification } = this.props;
    const { tags, phrases } = this.state;

    const currentWord = tags.splice(index, 1);
    this.setState({ tags });
    phrases.push(currentWord[0]);
    this.setState({ phrases });

    if (phrases.length === MNEMONIC_PHRASE_LENGTH) {
      const isEqual = _.isEqual(phrases, this.correctPhrases);
      console.log('phrases', phrases);
      console.log('this.correctPhrases', this.correctPhrases);
      console.log('isEqual', isEqual);

      if (isEqual) {
        // setPageLoading(true);
        // this.setState({ loading: true });
        // await walletManager.addWallet(this.wallet);
        // this.setState({ loading: false });
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'VerifyPhraseSuccess' }),
          ],
        });
        navigation.dispatch(resetAction);
      } else {
        const notification = createErrorNotification(
          'Error',
          verifyPhraseAlertTitle,
        );
        addNotification(notification);
      }
    }
  }

  reset() {
    // Shuffle the 12-word here so user need to choose from a different order than the last time
    // We want to make sure they really write down the phrase
    this.setState({
      tags: _.shuffle(this.correctPhrases),
      phrases: [],
    });
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
    for (let i = 0; i < MNEMONIC_PHRASE_LENGTH; i += 1) {
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
    const { tags, loading } = this.state;
    const { navigation } = this.props;
    return (
      <View>
        <Loader loading={loading} />
        <Header
          title="Recovery Phrase"
          goBack={() => {
            navigation.goBack();
          }}
        />
        <View style={[screenHelper.styles.body]}>
          <View style={[styles.wordFieldView]}>{this.renderAllItem()}</View>
          <Loc style={[styles.tip]} text="Tap each word in the correct order" />
          <Tags
            data={tags}
            style={[styles.tags]}
            showNumber={false}
            onPress={this.onTagsPressed}
          />
        </View>
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
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhrase);

import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  View, StyleSheet, TouchableOpacity,
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

    // Shuffle the 12-word here so user need to choose from a different order than the last time
    // We want to make sure they really write down the phrase
    this.shuffleWords = _.shuffle(this.correctPhrases);
    this.reset(true);

    this.renderSelectedWords = this.renderSelectedWords.bind(this);
    this.onTagsPressed = this.onTagsPressed.bind(this);
    this.onGobackPress = this.onGobackPress.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { notification } = nextProps;
    const { notification: curNotification } = this.props;
    if (notification !== curNotification && notification === null) {
      this.onNotificationRemoved();
    }
  }

  onNotificationRemoved() {
    this.reset();
  }

  onWordFieldPress(i) {
    this.revert(i);
  }

  async onTagsPressed(index) {
    const { navigation, addNotification } = this.props;
    const { selectedWordIndexs } = this.state;
    selectedWordIndexs.push(index);
    this.setState({
      selectedWordIndexs,
    });

    if (selectedWordIndexs.length === MNEMONIC_PHRASE_LENGTH) {
      const selectedWords = [];
      selectedWordIndexs.forEach((selectedIndex) => {
        selectedWords.push(this.shuffleWords[selectedIndex]);
      });

      const isEqual = _.isEqual(selectedWords, this.correctPhrases);
      console.log('selectedWords', selectedWords);
      console.log('this.correctPhrases', this.correctPhrases);
      console.log('isEqual', isEqual);

      if (isEqual) {
        const resetAction = StackActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'WalletList' }),
            NavigationActions.navigate({ routeName: 'VerifyPhraseSuccess' }),
          ],
        });
        navigation.dispatch(resetAction);
      } else {
        const notification = createErrorNotification(
          'Incorrect backup phrase',
          'verifyPhraseAlertTitle',
          'START OVER',
        );
        addNotification(notification);
      }
    }
  }

  onGobackPress() {
    const { navigation } = this.props;
    navigation.goBack();
  }

  reset(isInitialize = false) {
    if (isInitialize) {
      this.state = { selectedWordIndexs: [] };
    } else {
      this.setState({ selectedWordIndexs: [] });
    }
  }

  revert() {
    const { selectedWordIndexs } = this.state;
    selectedWordIndexs.pop();
    this.setState({
      selectedWordIndexs,
    });
  }

  renderSelectedWords() {
    const startX = -82;
    const words = [];
    const margin = 200;
    let offset = 0;
    const { selectedWordIndexs } = this.state;
    if (selectedWordIndexs.length > 1) {
      offset = -margin * (selectedWordIndexs.length - 1);
    }
    for (let i = 0; i < MNEMONIC_PHRASE_LENGTH; i += 1) {
      const marginLeft = startX + i * margin + offset;
      const style = {
        position: 'absolute', left: '50%', top: 10, marginLeft,
      };
      let text = '';
      if (i < selectedWordIndexs.length) {
        const index = selectedWordIndexs[i];
        text = this.shuffleWords[index];
      }
      let isDisabled = false;
      if (i !== selectedWordIndexs.length - 1) {
        isDisabled = true;
      }
      words.push(
        <TouchableOpacity style={style} key={(`${i}`)} disabled={isDisabled} onPress={() => this.onWordFieldPress(i)}>
          <WordField text={text} />
        </TouchableOpacity>,
      );
    }
    return words;
  }

  render() {
    const { isLoading } = this.props;
    const { selectedWordIndexs } = this.state;
    return (
      <View>
        <Loader loading={isLoading} />
        <Header
          title="Backup Phrase"
          goBack={this.onGobackPress}
        />
        <View style={[screenHelper.styles.body]}>
          <View style={[styles.wordFieldView]}>{this.renderSelectedWords()}</View>
          <Loc style={[styles.tip]} text="Tap each word in the correct order" />
          <Tags
            data={this.shuffleWords}
            style={[styles.tags]}
            showNumber={false}
            onPress={this.onTagsPressed}
            disableIndexs={selectedWordIndexs}
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
  isLoading: PropTypes.bool.isRequired,
  addNotification: PropTypes.func.isRequired,
  notification: PropTypes.shape({}),
};

VerifyPhrase.defaultProps = {
  notification: null,
};

const mapStateToProps = (state) => ({
  notification: state.App.get('notification'),
  isLoading: state.App.get('isPageLoading'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhrase);

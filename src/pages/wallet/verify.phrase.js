import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  View, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Tags from '../../components/common/misc/tags';
import WordField, { wordFieldWidth } from '../../components/common/misc/wordField';
import Loc from '../../components/common/misc/loc';
import appActions from '../../redux/app/actions';
import walletActions from '../../redux/wallet/actions';
import { createErrorNotification, createInfoNotification } from '../../common/notification.controller';
import Button from '../../components/common/button/button';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';

const MNEMONIC_PHRASE_LENGTH = 12;
const WORD_FIELD_MARGIN = 37;

const styles = StyleSheet.create({
  wordFieldView: {
    height: 150,
    marginTop: 15,
    overflow: 'hidden',
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
  confirmationView: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  confirmationTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 20,
  },
  confirmationButton: {
    marginTop: 20,
  },
  confirmationClearButton: {
    marginTop: 20,
  },
  confirmationClearButtonText: {
    color: '#00B520',
    fontSize: 16,
    fontWeight: '500',
  },
  wordsView: {
    flexDirection: 'row',
  },
  wordsWrapper: {
    marginTop: 10,
    marginLeft: '50%',
  },
  wordField: {
    marginLeft: WORD_FIELD_MARGIN,
  },
  firstWordField: {
    marginLeft: -wordFieldWidth / 2,
  },
});

class VerifyPhrase extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const { phrase } = navigation.state.params;
    this.notificationReason = null;
    this.correctPhrases = phrase.split(' ');
    // Shuffle the 12-word here so user need to choose from a different order than the last time
    // We want to make sure they really write down the phrase
    const shuffleWords = _.shuffle(this.correctPhrases);
    this.state = {
      selectedWordIndexs: [], shuffleWords, isLoading: false, isShowConfirmation: false, wordsOffset: new Animated.Value(0),
    };

    this.renderSelectedWords = this.renderSelectedWords.bind(this);
    this.onTagsPressed = this.onTagsPressed.bind(this);
    this.reset = this.reset.bind(this);
    this.onConfirmPress = this.onConfirmPress.bind(this);
    this.onClearPress = this.onClearPress.bind(this);
    this.renderConfirmation = this.renderConfirmation.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, isWalletsUpdated } = nextProps;
    const { isLoading } = this.state;
    // isWalletsUpdated is true indicates wallet is added, the app will navigate to other page.
    if (isWalletsUpdated && isLoading) {
      this.setState({ isLoading: false });
      navigation.navigate('VerifyPhraseSuccess');
    }
  }

  // call resetWalletsUpdated when componentWillUnmount is safe.
  componentWillUnmount() {
    const { isWalletsUpdated, resetWalletsUpdated } = this.props;
    if (isWalletsUpdated) {
      resetWalletsUpdated();
    }
  }

  onWordFieldPress(i) {
    const { isShowConfirmation } = this.state;
    // Avoid user press world field when confirmation
    if (isShowConfirmation) {
      return;
    }
    this.revert(i);
  }

  onPhraseValid() {
    const { navigation } = this.props;
    const { phrase, coins } = navigation.state.params;
    this.requestCreateWallet(phrase, coins);
  }

  onConfirmPress() {
    const { addNotification } = this.props;
    const { shuffleWords, selectedWordIndexs } = this.state;
    const selectedWords = [];
    selectedWordIndexs.forEach((selectedIndex) => {
      selectedWords.push(shuffleWords[selectedIndex]);
    });

    const isEqual = _.isEqual(selectedWords, this.correctPhrases);

    if (isEqual) {
      this.onPhraseValid();
    } else {
      this.notificationReason = 'incorrectPhrase';
      const notification = createErrorNotification(
        'modal.incorrectBackupPhrase.title',
        'modal.incorrectBackupPhrase.body',
        'button.startOver',
        () => this.reset(),
      );
      addNotification(notification);
    }
  }

  onClearPress() {
    this.reset();
  }

  onTagsPressed(index) {
    const { selectedWordIndexs } = this.state;
    selectedWordIndexs.push(index);
    this.setState({
      selectedWordIndexs,
    });

    if (selectedWordIndexs.length === MNEMONIC_PHRASE_LENGTH) {
      this.setState({ isShowConfirmation: true });
    }
    this.moveWordField();
  }

  moveWordField() {
    const { selectedWordIndexs, wordsOffset } = this.state;
    let offset = 0;
    if (selectedWordIndexs.length > 1) {
      offset = -(wordFieldWidth + WORD_FIELD_MARGIN) * (selectedWordIndexs.length - 1);
    }
    Animated.timing(
      wordsOffset,
      {
        toValue: offset,
        duration: 300,
      },
    ).start();
  }

  requestCreateWallet(phrase, coins) {
    const { addNotification, showPasscode } = this.props;
    if (global.passcode) {
      this.createWallet(phrase, coins);
    } else {
      this.notificationReason = 'createPassword';
      const notification = createInfoNotification(
        'modal.createPasscode.title',
        'modal.createPasscode.body',
        null,
        () => showPasscode('create', () => this.createWallet(phrase, coins)),
      );
      addNotification(notification);
    }
  }

  createWallet(phrase, coins) {
    // createKey cost time, it will block ui.
    // So we let run at next tick, loading ui can present first.
    const { createKey, walletManager } = this.props;
    this.setState({ isLoading: true }, () => {
      setTimeout(() => {
        createKey(null, phrase, coins, walletManager);
      }, 0);
    });
  }

  reset() {
    this.setState({ selectedWordIndexs: [], isShowConfirmation: false, wordsOffset: new Animated.Value(0) });
  }

  revert() {
    const { selectedWordIndexs } = this.state;
    selectedWordIndexs.pop();
    this.setState({
      selectedWordIndexs,
    });
    this.moveWordField();
  }

  renderSelectedWords() {
    const { wordsOffset } = this.state;
    const words = [];
    const { shuffleWords, selectedWordIndexs } = this.state;
    for (let i = 0; i < MNEMONIC_PHRASE_LENGTH; i += 1) {
      let text = '';
      if (i < selectedWordIndexs.length) {
        const index = selectedWordIndexs[i];
        text = shuffleWords[index];
      }
      let isDisabled = false;
      if (i !== selectedWordIndexs.length - 1) {
        isDisabled = true;
      }
      words.push(
        <TouchableOpacity
          style={i === 0 ? styles.firstWordField : styles.wordField}
          disabled={isDisabled}
          onPress={() => this.onWordFieldPress(i)}
          key={(`${i}`)}
        >
          <WordField text={text} />
        </TouchableOpacity>,
      );
    }
    const wordsView = (
      <View style={styles.wordsWrapper}>
        <Animated.View style={[styles.wordsView, { marginLeft: wordsOffset }]}>
          {words}
        </Animated.View>
      </View>
    );
    return wordsView;
  }

  renderConfirmation() {
    const { isShowConfirmation } = this.state;
    return !isShowConfirmation ? null : (
      <View style={styles.confirmationView}>
        <Loc style={[styles.confirmationTitle]} text="page.wallet.backupPhrase.isCorrect" />
        <Button style={[styles.confirmationButton]} text="button.Confirm" onPress={this.onConfirmPress} />
        <TouchableOpacity style={styles.confirmationClearButton} onPress={this.onClearPress}><Loc style={[styles.confirmationClearButtonText]} text="button.Clear" /></TouchableOpacity>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { shuffleWords, selectedWordIndexs, isLoading } = this.state;
    return (
      <BasePageGereral
        isSafeView
        hasBottomBtn={false}
        hasLoader
        isLoading={isLoading}
        renderAccessory={this.renderConfirmation}
        headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.wallet.backupPhrase.title" />}
      >
        <View style={[styles.wordFieldView]}>{this.renderSelectedWords()}</View>
        <Loc style={[styles.tip]} text="page.wallet.backupPhrase.note" />
        <Tags
          data={shuffleWords}
          style={[styles.tags]}
          showNumber={false}
          onPress={this.onTagsPressed}
          disableIndexs={selectedWordIndexs}
        />
      </BasePageGereral>
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
  walletManager: PropTypes.shape({}),
  addNotification: PropTypes.func.isRequired,
  createKey: PropTypes.func.isRequired,
  resetWalletsUpdated: PropTypes.func.isRequired,
  isWalletsUpdated: PropTypes.bool.isRequired,
  showPasscode: PropTypes.func.isRequired,
};

VerifyPhrase.defaultProps = {
  walletManager: undefined,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  isWalletsUpdated: state.Wallet.get('isWalletsUpdated'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(appActions.addNotification(notification)),
  createKey: (name, phrases, coins, walletManager) => dispatch(walletActions.createKey(name, phrases, coins, walletManager)),
  resetWalletsUpdated: () => dispatch(walletActions.resetWalletsUpdated()),
  addConfirmation: (confirmation) => dispatch(appActions.addConfirmation(confirmation)),
  showPasscode: (category, callback) => dispatch(appActions.showPasscode(category, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhrase);

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Content,
  Container,
  Text,
} from 'native-base';
import { PropTypes } from 'prop-types';

import ActionHeader from 'mellowallet/src/components/ActionHeader';
import { t } from 'mellowallet/src/i18n';
import RecoveryPhraseBox from 'mellowallet/src/components/RecoveryPhraseBox';
import { onStepCompleted } from 'mellowallet/src/store/actions/onBoarding';
import onBoardingStepEnum from 'mellowallet/src/utils/onBoardingStepEnum';
import { printError } from 'mellowallet/src/utils';

const styles = StyleSheet.create({
  viewElement: {
    padding: 10,
  },
  viewButtonElement: {
    alignSelf: 'center',
    padding: 10,
  },
  boxStyle: {
    minHeight: 180,
    maxHeight: 250,
  },
  bottomBoxStyle: {
    backgroundColor: 'white',
  },
  wordsListChip: {
    margin: 4,
    padding: 4,
    backgroundColor: '#17EAD9',
  },
});

const mapDispatchToProps = dispatch => ({
  onStepCompleted: () => dispatch(onStepCompleted(onBoardingStepEnum.PHRASE_VERIFIED)),
});

class VerifyRecoveryPhraseScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.originalWordsList = navigation.getParam('wordsList');
    var wordsList = Array.from(this.originalWordsList);
    wordsList.sort((x, y) => (x.value > y.value) - (x.value < y.value));
    this.state = {
      wordsList,
      selectedWords: [],
    };
    this.mappedOriginalWordsList = this.reduceWordList(this.originalWordsList);
  }

  componentDidUpdate() {
    const { selectedWords } = this.state;
    if (this.originalWordsList.length !== selectedWords.length) {
      return;
    }

    const mappedSelectedWords = this.reduceWordList(selectedWords);

    if (this.mappedOriginalWordsList === mappedSelectedWords) {
      this.props.onStepCompleted();
    } else if (this.originalWordsList.length === selectedWords.length) {
      printError(t('The order is wrong'));
    }
  }

  reduceWordList = arrayData => arrayData.reduce((data, word) => `${data} ${word.value}`, '').trim();

  goBack = () => {
    const { navigation } = this.props;
    navigation.dispatch(NavigationActions.back());
  }

  onSelectWordPress = (key) => {
    const word = this.originalWordsList.find(item => item.key === key);
    const { selectedWords } = this.state;
    const newSelectedWords = selectedWords;
    newSelectedWords.push(word);
    this.setState(prevState => ({
      selectedWords: newSelectedWords,
      wordsList: prevState.wordsList.filter(item => item.key !== key),
    }));
  }

  onRemoveWordPress = (key) => {
    const word = this.originalWordsList.find(item => item.key === key);
    this.setState(prevState => ({
      selectedWords: prevState.selectedWords.filter(item => item.key !== key),
      wordsList: prevState.wordsList.concat([word]),
    }));
  }

  render() {
    const {
      selectedWords,
      wordsList,
    } = this.state;
    return (
      <Container>
        <ActionHeader
          title={t('Verify Recovery Phrase')}
          backAction={this.goBack}
        />

        <Content>
          <View style={styles.viewElement}>
            <Text>
              {t('This is your recovery phrase')}
            </Text>
          </View>

          <View style={styles.viewElement}>
            <Text note>
              {t("Just to make sure you've written down correctly.")}
              {'\n'}
              {t('Tap the words below in the same order as your recovery phrase')}
            </Text>
          </View>

          <View style={styles.viewElement}>
            <RecoveryPhraseBox
              dataSource={selectedWords.slice()}
              cancelable
              boxStyle={styles.boxStyle}
              onRemovePress={this.onRemoveWordPress}
            />
          </View>

          <View style={styles.viewElement}>
            <RecoveryPhraseBox
              dataSource={wordsList.slice()}
              cancelable={false}
              boxStyle={[styles.boxStyle, styles.bottomBoxStyle]}
              onRemovePress={this.onSelectWordPress}
              chipStyle={styles.wordsListChip}
            />
          </View>

        </Content>
      </Container>
    );
  }
}

VerifyRecoveryPhraseScreen.propTypes = {
  onStepCompleted: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(VerifyRecoveryPhraseScreen);

import React, { PureComponent } from 'react';
import {
  Content,
  Container,
  Text,
  Button,
} from 'native-base';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { StyleSheet, View, BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';

import ActionHeader from 'mellowallet/src/components/ActionHeader';
import { t } from 'mellowallet/src/i18n';
import RecoveryPhraseInput from 'mellowallet/src/components/RecoveryPhraseInput';
import Loader from 'mellowallet/src/components/Loader';
import { printError } from 'mellowallet/src/utils';
import Application from 'mellowallet/lib/Application';
import Label from 'mellowallet/src/components/Label';
import { walletImported, setWalletListDirty } from 'mellowallet/src/store/actions/wallet';
import { conf } from '../../utils/constants';

const mapDispatchToProps = dispatch => ({
  walletImported: value => dispatch(walletImported(value)),
  setWalletListDirty: () => dispatch(setWalletListDirty()),
});

const styles = StyleSheet.create({
  viewElement: {
    padding: 10,
  },
  viewButtonElement: {
    alignSelf: 'center',
    padding: 10,
  },
});


class ImportWalletScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      formValid: false,
      wordsList: [],
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  goBack = () => this.props.navigation.dispatch(NavigationActions.back());

  componentDidUpdate = () => {
    const { wordsList } = this.state;
    this.setState({ formValid: wordsList.length === conf('wordsListSize') });
  };

  onImportWalletPress = (fromWelcomeScreen) => {
    this.setState({ isLoading: true });

    const phrase = this.state.wordsList
      .map(item => (item.value))
      .join(' ');
    // app.wallet_from_phrase calls internally to bip39.mnemonicToSeed thats kills the vm
    // so we must give react a chance to render before.
    setTimeout(() => {
      Application(app => app.wallet_from_phrase(phrase.trim(), undefined, fromWelcomeScreen)
        .then(() => {
          this.props.walletImported(true);
          this.props.setWalletListDirty();
        })
        .catch(error => printError(error))
        .finally(() => this.setState({ isLoading: false })));
    }, 100);
  };

  onRemoveElement = (key) => {
    const { wordsList } = this.state;
    const wordsListFiltered = wordsList.filter(wordItem => wordItem.key !== key);
    this.setState({ wordsList: wordsListFiltered });
  };

  onAddElement = (value) => {
    if (!value) {
      return;
    }
    const { wordsList } = this.state;
    const nextKey = wordsList.length > 0 ? wordsList.slice(-1)[0].key + 1 : 0;
    const wordsListUpdated = [...wordsList, {
      key: nextKey,
      value: value.toLowerCase()
    }];
    this.setState({ wordsList: wordsListUpdated });
  };

  render() {
    const { formValid, wordsList, isLoading } = this.state;
    const { navigation } = this.props;
    const fromWelcomeScreen = navigation.getParam('fromWelcomeScreen', false);
    return (
      <Container>

        <ActionHeader
          backAction={this.goBack}
          title={t('Wallet Import')}
        />

        <Content>
          <Loader loading={isLoading}/>

          <View style={styles.viewElement}>
            <Text>
              {t('Use your recovery phrase')}
            </Text>
          </View>

          <View style={styles.viewElement}>
            <Label>
              {t('Please enter below your 12-words recovery phrase in the exact same order as they were given to you.')}
            </Label>
          </View>

          <View style={styles.viewElement}>
            <RecoveryPhraseInput
              onRemoveElement={this.onRemoveElement}
              onAddElement={this.onAddElement}
              wordsList={wordsList}
              limitSize={conf('wordsListSize')}
            />
          </View>

          <View style={styles.viewButtonElement}>
            <Button
              disabled={!formValid}
              onPress={() => this.onImportWalletPress(fromWelcomeScreen)}
            >
              <Text>{t('Done')}</Text>
            </Button>
          </View>

        </Content>
      </Container>
    );
  }
}

ImportWalletScreen.propTypes = {
  walletImported: PropTypes.func.isRequired,
  setWalletListDirty: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(ImportWalletScreen);

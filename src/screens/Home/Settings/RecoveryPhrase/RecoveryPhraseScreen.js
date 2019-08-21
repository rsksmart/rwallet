
import React, { PureComponent } from 'react';
import {
  Content,
  Container,
  Text,
} from 'native-base';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import {
  AsyncStorage,
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';
import { t } from 'mellowallet/src/i18n';
import Loader from 'mellowallet/src/components/Loader';
import Label from 'mellowallet/src/components/Label';
import RecoveryPhraseBox from 'mellowallet/src/components/RecoveryPhraseBox';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import Application from 'mellowallet/lib/Application';
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
    backgroundColor: 'white',
  },
});


class RecoveryPhraseScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      wordsList: [],
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
    AsyncStorage.getItem(AsyncStorageEnum.FAVOURITE_WALLET)
      .then((favouriteWalletId) => {
        // get wallet from API
        Application(app => app.get_wallet_by_id(parseInt(favouriteWalletId, 10))
          .then((wallet) => {
            wallet.get_phrase()
              .then((phrase) => {
                const wordsListFromPhrase = phrase.split(' ')
                  .map((word, index) => ({ key: index, value: word }));

                this.setState({
                  wordsList: wordsListFromPhrase,
                  isLoading: false,
                });
              })
              .catch(error => printError(error, 'danger'));
          })
          .catch(error => printError(error, 'danger')));
      })
      .catch(error => printError(error, 'danger'))
      .finally(() => this.setState({ isLoading: false }));
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  goBack = () => this.props.navigation.goBack()

  render() {
    const { wordsList } = this.state;
    return (
      <Container>

        <ActionHeader
          backAction={this.goBack}
          title={t('Recovery Phrase')}
        />

        <Content>

          <Loader loading={this.state.isLoading} />

          <View style={styles.viewElement}>
            <Text>
              {t('This is your recovery phrase')}
            </Text>
          </View>

          <View style={styles.viewElement}>
            <Label>
              {t('Write down these 12 words in this exact order and keep it on a safe place. Do not take a screenshot or email them.')}
            </Label>
          </View>

          <View style={styles.viewElement}>
            <RecoveryPhraseBox
              dataSource={wordsList}
              cancelable={false}
              boxStyle={styles.boxStyle}
            />
          </View>

        </Content>
      </Container>
    );
  }
}

export default RecoveryPhraseScreen;

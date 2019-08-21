import React, { PureComponent } from 'react';
import {
  Content,
  Container,
  Text,
  Button,
  ListItem,
  CheckBox,
  Body,
} from 'native-base';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import {
  AsyncStorage,
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'mellowallet/src/i18n';
import Loader from 'mellowallet/src/components/Loader';
import RecoveryPhraseBox from 'mellowallet/src/components/RecoveryPhraseBox';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import Application from 'mellowallet/lib/Application';
import { printError } from 'mellowallet/src/utils';


const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    width: 300,
  },
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
      confirmCheck: false,
    };
  }

  async componentDidMount() {
    const favouriteWalletId = await AsyncStorage.getItem(AsyncStorageEnum.FAVOURITE_WALLET);

    // get wallet from API
    Application(app => app.get_wallet_by_id(parseInt(favouriteWalletId, 10))
      .then((wallet) => {
        wallet.get_phrase()
          .then((phrase) => {
            const wordsListFromPhrase = phrase.split(' ')
              .map((word, index) => ({ key: index, value: word }));

            this.setState({ wordsList: wordsListFromPhrase });
          })
          .catch(error => printError(error, 'danger'))
          .finally(() => this.setState({ isLoading: false }));
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        printError(error, 'danger');
      }));
  }

  onConfirmCheckPress = () => this.setState(
    prevState => ({
      confirmCheck: !prevState.confirmCheck,
    }),
  );

  onVerifyPress = () => {
    const { navigation } = this.props;
    const { wordsList } = this.state;
    navigation.navigate('VerifyRecoveryPhraseScreen', { wordsList });
  }

  render() {
    const { confirmCheck, wordsList } = this.state;
    return (
      <Container>
        <ActionHeader
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
            <Text note>
              {t('Write down these 12 words in this exact order and keep it on a safe place. Do not take a screenshot or email them.')}
            </Text>
          </View>

          <View style={styles.viewElement}>
            <RecoveryPhraseBox
              dataSource={wordsList}
              cancelable={false}
              boxStyle={styles.boxStyle}
            />
          </View>

          <ListItem
            button
            noBorder
            onPress={this.onConfirmCheckPress}
          >
            <CheckBox
              checked={confirmCheck}
              onPress={this.onConfirmCheckPress}
            />
            <Body>
              <Text>{t("I've written down these words")}</Text>
            </Body>
          </ListItem>

          <Button
            disabled={!confirmCheck}
            style={styles.button}
            onPress={this.onVerifyPress}
          >
            <Text>{t('Verify Recovery Phrase')}</Text>
          </Button>

        </Content>
      </Container>
    );
  }
}

export default RecoveryPhraseScreen;

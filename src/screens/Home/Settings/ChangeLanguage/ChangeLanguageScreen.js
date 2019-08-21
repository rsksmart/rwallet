import React, { PureComponent } from 'react';
import {
  Content,
  Container,
  Text,
  List,
  ListItem,
} from 'native-base';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import {
  AsyncStorage,
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';
import { t } from 'mellowallet/src/i18n';
import { Updates } from 'expo';
import AsyncStorageEnum from 'mellowallet/src/utils/asyncStorageEnum';
import { printError } from 'mellowallet/src/utils';

const styles = StyleSheet.create({
  description: {
    padding: 19,
    paddingBottom: 25,
  },
});


export default class ChangeLanguageScreen extends PureComponent {
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  goBack = () => this.props.navigation.goBack()

  changeLanguage = async (lng) => {
    AsyncStorage.setItem(AsyncStorageEnum.LANGUAGE, lng)
      .then(Updates.reload())
      .catch(error => printError(error));
  };

  render() {
    return (
      <Container>

        <ActionHeader
          backAction={this.goBack}
          title={t('Change language')}
        />

        <Content>
          <View style={styles.description}>
            <Text>{t('Please, select your language in the list below')}</Text>
          </View>

          <List>
            <ListItem onPress={() => this.changeLanguage('es_AR')}>
              <Text>{t('Spanish')}</Text>
            </ListItem>

            <ListItem onPress={() => this.changeLanguage('en_US')}>
              <Text>{t('English')}</Text>
            </ListItem>
          </List>

        </Content>
      </Container>
    );
  }
}

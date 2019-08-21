import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import {
  Content,
  Container,
  Text,
  List,
  ListItem,
  Left,
  Right,
  Icon,
} from 'native-base';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import ActionHeader from 'mellowallet/src/components/ActionHeader';
import i18n, { t } from 'mellowallet/src/i18n';

import { walletImported } from 'mellowallet/src/store/actions/wallet';
import Loader from 'mellowallet/src/components/Loader';
import Application from 'mellowallet/lib/Application';
import { printError } from 'mellowallet/src/utils';
import NavigationService from 'mellowallet/src/services/NavigationService';


const styles = StyleSheet.create({
  headerText: {
    fontWeight: '500',
  },
});

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    importedWallet: rootReducer.importedWallet,
  };
};

class SettingsScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      localCurrency: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    Application(app => app.get_display_currency())
      .then((localCurrency) => {
        this.setState({ localCurrency });
      })
      .catch((error) => {
        printError(error);
      })
      .finally(() => this.setState({ isLoading: false }));
  }

  componentWillReceiveProps(props) {
    const { importedWallet } = props;
    if (importedWallet) {
      NavigationService.back();
    }
  }

  onWalletImportPress = () => NavigationService.navigate('WalletImport');

  onChangePinPress = () => NavigationService.navigate('ChangePin');

  onRecoveryPhrasePress = () => NavigationService.navigate('RecoveryPhrase');

  onPortfolioBalancePress = () => NavigationService.navigate('PortfolioBalance');

  onLocalCurrencyPress = () => NavigationService.navigate('LocalCurrency');

  onChangeLanguagePress = () => NavigationService.navigate('ChangeLanguage');

  onAboutPress = () => NavigationService.navigate('AboutMellowallet');

  render() {
    const { localCurrency } = this.state;
    return (
      <Container>

        <ActionHeader
          title={t('Settings')}
        />

        <Content>
          <Loader loading={this.state.isLoading} />

          <List>
            <ListItem itemDivider>
              <Text style={styles.headerText}>{t('Wallets').toUpperCase()}</Text>
            </ListItem>

            <ListItem
              noBorder
              onPress={this.onWalletImportPress}
            >
              <Left>
                <Text>{t('Import Wallet')}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem itemDivider>
              <Text style={styles.headerText}>{t('Security').toUpperCase()}</Text>
            </ListItem>

            <ListItem onPress={this.onChangePinPress}>
              <Left>
                <Text>{t('Change your PIN')}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem noBorder onPress={this.onRecoveryPhrasePress}>
              <Left>
                <Text>{t('Recovery Phrase')}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem itemDivider>
              <Text style={styles.headerText}>{t('Other').toUpperCase()}</Text>
            </ListItem>

            <ListItem onPress={this.onPortfolioBalancePress}>
              <Left>
                <Text>{t('Portfolio balance')}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem onPress={this.onLocalCurrencyPress}>
              <Left>
                <Text>
                  {`${t('Local currency')} (${localCurrency})`}
                </Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem onPress={this.onChangeLanguagePress}>
              <Left>
                <Text>
                  {`${t('Language')} (${i18n.locale()})`}
                </Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem onPress={this.onAboutPress}>
              <Left>
                <Text>
                  {t('About Mellowallet')}
                </Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>

          </List>
        </Content>
      </Container>
    );
  }
}

SettingsScreen.propTypes = {
  importedWallet: PropTypes.bool,
};

SettingsScreen.defaultProps = {
  importedWallet: false,
};

export default connect(mapStateToProps, null)(SettingsScreen);

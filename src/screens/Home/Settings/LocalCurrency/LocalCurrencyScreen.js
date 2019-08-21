import React, { PureComponent } from 'react';
import {
  Content,
  Container,
  Text,
} from 'native-base';
import ActionHeader from 'mellowallet/src/components/ActionHeader';
import { StyleSheet, View, BackHandler } from 'react-native';
import { t } from 'mellowallet/src/i18n';
import Application from 'mellowallet/lib/Application';
import Loader from 'mellowallet/src/components/Loader';
import { printError } from 'mellowallet/src/utils';
import CurrencyList from './CurrencyList';


const styles = StyleSheet.create({
  description: {
    padding: 19,
    paddingBottom: 25,
  },
});

const currencyLabels = {
  USD: { label: 'US Dolar (USD)' },
  ARS: { label: 'Argentine peso (ARS)' },
  EUR: { label: 'Euro (EUR)' },
  JPY: { label: 'Yen (JPY)' },
  GBP: { label: 'Pound Sterling (GBP)' },
};

class LocalCurrencyScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      currencies: [],
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.goBack);
    this.loadAsyncData();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  loadAsyncData = () => {
    Application(app => app.get_fiat_currencies())
      .then((currenciesList) => {
        const currenciesFiltered = currenciesList
          .filter(keyInternal => (keyInternal in currencyLabels))
          .map(keyInternal => ({ key: keyInternal, value: currencyLabels[keyInternal].label }));

        this.setState({
          currencies: currenciesFiltered,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        printError(error);
      });
  }

  goBack = () => this.props.navigation.goBack()

  onChangeCurrencyPress = (currency) => {
    this.setState({ isLoading: true });
    Application(app => app.set_display_currency(currency))
      .then(() => {
        this.setState({ isLoading: false });
        this.goBack();
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        printError(error);
      });
  };

  render() {
    const { currencies, isLoading } = this.state;
    return (
      <Container>

        <ActionHeader
          backAction={this.goBack}
          title={t('Currency Change')}
        />

        <Content>
          <Loader loading={this.state.isLoading} />

          <View style={styles.description}>
            <Text>{t('Please, select your default currency')}</Text>
          </View>

          <CurrencyList
            currencies={currencies}
            isLoading={isLoading}
            onChangeCurrencyPress={this.onChangeCurrencyPress}
          />

        </Content>
      </Container>
    );
  }
}

export default LocalCurrencyScreen;

import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import React from 'react';
import NavigationService from 'mellowallet/src/services/NavigationService';
import HomeNavigator from './Home';
import NewWalletScreen from './Home/Wallets/Wallet/NewWalletScreen';
import SendScreen from './Send';
import WalletDetails from './Home/Wallets/Wallet/Details';
import ConfirmationScreen from './Home/Exchange/ConfirmationScreen';
import ChangeLanguageScreen from './Home/Settings/ChangeLanguage/ChangeLanguageScreen';
import PortfolioBalanceScreen from './Home/Settings/PortfolioBalance/PortfolioBalanceScreen';
import LocalCurrencyScreen from './Home/Settings/LocalCurrency/LocalCurrencyScreen';
import ChangePinScreen from './Home/Settings/ChangePin/ChangePinScreen';
import ImportWalletScreen from './ImportWallet/ImportWalletScreen';
import RecoveryPhraseScreen from './Home/Settings/RecoveryPhrase/RecoveryPhraseScreen';
import AboutMellowalletScreen from './Home/Settings/AboutMellowallet/AboutMellowalletScreen';
import Application from './Application';

const TopLevelNavigator = createStackNavigator(
  {
    Application,
    Home: HomeNavigator,
    NewWalletScreen,
    SendScreen,
    WalletDetails,
    ConfirmationExchange: ConfirmationScreen,
    ChangeLanguage: ChangeLanguageScreen,
    PortfolioBalance: PortfolioBalanceScreen,
    LocalCurrency: LocalCurrencyScreen,
    ChangePin: ChangePinScreen,
    WalletImport: ImportWalletScreen,
    RecoveryPhrase: RecoveryPhraseScreen,
    AboutMellowallet: AboutMellowalletScreen,
  },
  {
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(TopLevelNavigator);

class Navigator extends React.Component {
  static router = TopLevelNavigator.router;

  render() {
    return (
      <AppContainer
        navigation={this.props.navigation}
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

export default Navigator;

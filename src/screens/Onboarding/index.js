import { createSwitchNavigator } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


import ImportWalletScreen from 'mellowallet/src/screens/ImportWallet/ImportWalletScreen';

import WelcomeScreen from './WelcomeScreen';
import CreatePinNavigator from './CreatePin';
import CreateWalletsNavigator from './CreateWallets';
import RecoveryPhraseNavigator from './RecoveryPhrase';

const createWalletFlowNavigation = createSwitchNavigator(
  {
    CreatePinScreen: CreatePinNavigator,
    CreateWalletScreen: CreateWalletsNavigator,
    RecoveryPhraseScreen: RecoveryPhraseNavigator,
  },
  {
    headerMode: 'none',
  },
);

const importWalletFlowNavigation = createSwitchNavigator(
  {
    CreatePinScreen: CreatePinNavigator,
    ImportWalletScreen,
  },
  {
    headerMode: 'none',
  },
);

const welcomeNavigator = createStackNavigator(
  {
    WelcomeScreen,
    CreateWalletFlow: createWalletFlowNavigation,
    ImportWalletFlow: importWalletFlowNavigation,
  },
  {
    headerMode: 'none',
  },
);

export default createSwitchNavigator(
  {
    Welcome: welcomeNavigator,
  },
  {
    headerMode: 'none',
  },
);

import { createStackNavigator } from 'react-navigation-stack';


import RecoveryPhraseScreen from './RecoveryPhraseScreen';
import VerifyRecoveryPhraseScreen from './VerifyRecoveryPhraseScreen';

export default createStackNavigator(
  {
    RecoveryPhraseScreen,
    VerifyRecoveryPhraseScreen,
  },
  {
    headerMode: 'none',
  },
);

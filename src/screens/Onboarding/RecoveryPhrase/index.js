import { createStackNavigator } from 'react-navigation';
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

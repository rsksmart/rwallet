import { createSwitchNavigator,createAppContainer } from 'react-navigation';
import OnboardingNavigator from 'mellowallet/src/screens/Onboarding';
import AuthLoadingScreen from './Auth/AuthLoadingScreen';
import TopLevelNavigator from './TopLevelNavigator';

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: TopLevelNavigator,
    onBoarding: OnboardingNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  },
));
